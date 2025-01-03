import { isFunction } from "flex-tools/typecheck/isFunction"     
import type {  VoerkaI18nScope } from "../scope"
import type { VoerkaI18nLanguageDefine,  VoerkaI18nLanguageLoader, VoerkaI18nEvents, IVoerkaI18nStorage }  from "../types"
import { VoerkaI18nInvalidLanguageError } from '../errors';
import { LiteEvent } from "flex-tools/events/liteEvent" 
import { execAsyncs, isI18nScope, isStorage } from "../utils"  
 
/** 
 * 多语言管理类
 * 
 * 当导入编译后的多语言文件时(import("./languages"))，会自动生成全局实例VoerkaI18n
 *  
 * VoerkaI18n.languages             // 返回支持的语言列表
 * VoerkaI18n.defaultLanguage       // 默认语言
 * VoerkaI18n.language              // 当前语言
 * VoerkaI18n.change(language)      // 切换到新的语言 
 * 
 * 
 * VoerkaI18n.on("change",(language)=>{})  // 注册语言切换事件
 * VoerkaI18n.off("change",(language)=>{}) 
 * 
 * */ 

export class VoerkaI18nManager extends LiteEvent<VoerkaI18nEvents>{
    __VoerkaI18nManager__ = true
    static instance?              : VoerkaI18nManager  
    private _scopes               : VoerkaI18nScope[] = []    
    private _appScope!            : VoerkaI18nScope 
    
    constructor(appScope:VoerkaI18nScope){
        super()      
        if(VoerkaI18nManager.instance){
            return VoerkaI18nManager.instance;
        }        
        this._registerAppScope(appScope)                                // 注册应用作用域     
        this._registerScopes()                                          // 注册所有作用域
        VoerkaI18nManager.instance = this                               // 加载初始格式化器   
        // @ts-ignore
        globalThis.VoerkaI18n = this     
    }
    get debug(){return this.scope.debug }  
    get logger(){ return this.scope.logger! }                            // 日志记录器                        
    get scopes(){ return this._scopes }                                 // 注册VoerkaI18nScope实例 
    get activeLanguage(){ return this._appScope.activeLanguage }        // 当前激活语言名称   
    get loader(){ return this._appScope.loader}                         // 默认语言包加载器 
    get storage(){return this.scope!.storage}
    get languages(){return this.scope.languages}
    get scope(){return this._appScope!}
 
    /**
     * 注册所有i18nScope作用域。
     * 该方法会检查全局对象中的 `__VoerkaI18nScopes__` 属性，
     * 如果该属性存在且为数组，则遍历数组并注册每个作用域。
     * 这是内部实现细节，不对外暴露。
     */
    private _registerScopes() {
        const scopes = globalThis.__VoerkaI18nScopes__
        if(scopes && Array.isArray(scopes)){
            scopes.forEach(scope=>this.register(scope)) 
        }        
        // @ts-ignore
        delete globalThis.__VoerkaI18nScopes__
    }
    /**
     * 
     * 将应用Scope注册到管理器中
     * 
     */
    private _registerAppScope(scope:VoerkaI18nScope){ 
        this._scopes.push(scope)
        this._appScope = scope
        this.logger.debug("注册应用I18nScope: "+scope.id)
        this.emitAsync("init",undefined,true)
            .then(()=>this.emitAsync("ready",this.activeLanguage,true))         
    }
    /**
     * 
     * 注册一个新的作用域
     * 
     * 每一个库均对应一个作用域，每个作用域可以有多个语言包，且对应一个翻译函数
     * 除了默认语言外，其他语言采用动态加载的方式
     * 
     * @param {*} scope 
     */
    register(scope:VoerkaI18nScope){ 
        if(!isI18nScope(scope)) throw new Error("注册的作用域必须是VoerkaI18nScope的实例")
        this._scopes.push(scope)     
        scope.bind(this)            
        this.logger.debug(`VoerkaI18nScope<${scope.id}>已注册`)
    }    
    /**
     *  切换语言
     */
    async change(language:string){
        if(this.hasLanguage(language) || isFunction(this.loader)){                     
            await this._refreshScopes(language)          // 刷新所有作用域                                     
            this.scope.saveLanguage()                    // 保存语言配置到存储器
            this.emit("change",language,true)     
            this.logger.info("语言已切换为："+ language)
            return language
        }else{
            throw new VoerkaI18nInvalidLanguageError(language)
        }
    } 
     /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
     private async _refreshScopes(newLanguage:string){ 
        const scopeRefreshers = this._scopes.map(scope=>scope.refresh(newLanguage))
        await execAsyncs(scopeRefreshers) 
    }     
    /**
     * 刷新所有作用域
     */
    async refresh(){
        return await this._refreshScopes(this.activeLanguage)
    }
    /**
     * 等待管理器初始化完成
     * @returns 
     */
    async ready(){
        return await this.waitFor("ready")
    } 
    /**
     * 清除所有作用域的翻译补丁信息
     */
    clearPatchedMessages(){
        this._scopes.forEach(scope=>scope.clearPatchedMessages())
    }
    /**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(language:string) {
		return this.languages.findIndex((lang:VoerkaI18nLanguageDefine) => lang.name == language) != -1;
	}
    clearLanguage(){
        this.scope.clearLanguage()
    }
    saveLanguage(){
        this.scope.saveLanguage()
    }
    restoreLanguage(){
        this.scope.restoreLanguage()        
    }

} 
 