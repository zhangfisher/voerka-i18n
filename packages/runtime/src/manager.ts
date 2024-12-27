import { isFunction } from "flex-tools/typecheck/isFunction"     
import type {  VoerkaI18nScope } from "./scope"
import type { VoerkaI18nLanguageDefine,  VoerkaI18nDefaultMessageLoader, VoerkaI18nEvents }  from "./types"
import { InvalidLanguageError } from './errors';
import { LiteEvent } from "flex-tools/events/liteEvent" 
import { createLogger, VoerkaI18nLogger } from "./logger"
import { isScope } from "./utils" 


export interface VoerkaI18nManagerOptions extends VoerkaI18nScope {}


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
    static instance?              : VoerkaI18nManager  
    private _scopes               : VoerkaI18nScope[] = []
    private _logger!              : VoerkaI18nLogger
    private _appScope!            : VoerkaI18nScope
    private _defaultMessageLoader?: VoerkaI18nDefaultMessageLoader
    private _activeLanguage       : string = 'zh'
    
    constructor(appScope:VoerkaI18nScope){
        super()      
        if(VoerkaI18nManager.instance){
            return VoerkaI18nManager.instance;
        }        
        this._logger = createLogger(this)
        this._registerAppScope(appScope)                             // 注册应用作用域        
        this._registerScopes()                                      // 注册所有作用域
        VoerkaI18nManager.instance = this                           // 加载初始格式化器        
    }
    get debug(){return this.scope.debug }  
    get logger(){ return this._logger! }                            // 日志记录器                        
    get scopes(){ return this._scopes }                             // 注册VoerkaI18nScope实例 
    get activeLanguage(){ return this._activeLanguage}              // 当前激活语言名称   
    get defaultMessageLoader(){ return this._defaultMessageLoader}  // 默认语言包加载器 
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
    }
    /**
     * 
     * 将应用Scope注册到管理器中
     * 
     */
    private _registerAppScope(scope:VoerkaI18nScope){ 
        this._appScope = scope
        this._activeLanguage = scope.activeLanguage
        this._getLanguageFromStorage()                      // 从存储器加载语言包配置        
        this.emitAsync("init",{
            scope: scope.id,
            language:this.activeLanguage
        },true).then(()=>this.emitAsync("ready",this.activeLanguage,true))         
    }
    
    /**
     * 从存储器加载语言包配置
     */
    private _getLanguageFromStorage(){
        const storage = this.scope.storage 
        if(storage){            
            const savedLanguage = storage.get("language")
            if(!savedLanguage || !this.hasLanguage(savedLanguage))  return 
            this._activeLanguage = savedLanguage
            this.logger.debug("从存储中读取到当前语言：",savedLanguage)
        }
    }
    private _setLanguageToStorage(){
        const storage = this.scope.storage
        if(storage){
            if(!this._activeLanguage)  return
            storage.set("language",this.activeLanguage)            
            this.logger.debug("当前语言设置已保存到存储：",this.activeLanguage)
        }
    } 
    // 通过默认加载器加载文件
    async _loadMessagesFromDefaultLoader(newLanguage:string,scope:VoerkaI18nScope){
        if(this._defaultMessageLoader && isFunction(this._defaultMessageLoader)){
            try{
                return await this._defaultMessageLoader.call(scope,newLanguage,scope)        
            }catch(e:any){
                this.logger.debug(`从远程加载语言包${newLanguage}文件出错:${e.stack}`)
                return {}
            }            
        }
    } 
    /**
     *  切换语言
     */
    async change(language:string){
        if(!this.hasLanguage(language) || isFunction(this._defaultMessageLoader)){                     
            await this._refreshScopes(language)                  // 刷新所有作用域
            this._setLanguageToStorage()                         // 保存语言配置到存储器
            this.emit("change",language)     
            this.logger.info("语言已切换为："+ language)
            return language
        }else{
            throw new InvalidLanguageError(language)
        }
    } 
     /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
     private async _refreshScopes(newLanguage:string){ 
        try{
            const scopeRefreshers = this._scopes.map(scope=>{
                return scope.refresh(newLanguage)
            })
            if(Promise.allSettled){
               await Promise.allSettled(scopeRefreshers)
            }else{
                await Promise.all(scopeRefreshers)
            } 
        }catch(e:any){
            this.logger.error("刷新语言作用域时出错:"+e.stack)
            this.emit("error",e)
        }          
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
    async register(scope:VoerkaI18nScope){ 
        if(!isScope(scope)) throw new Error("注册的作用域必须是VoerkaI18nScope的实例")
        if(scope.id===this.scope.id) return 
        if(scope.options.library===false){
            this._registerAppScope(scope)
        }else{       
            scope.bind(this)
        }      
        this._scopes.push(scope)    
        await scope.refresh(this.activeLanguage) 
    }    
    async ready(){
        return await this.waitFor("ready")
    }
    /**
    * 注册默认文本信息加载器
    */
    registerDefaultLoader(fn:VoerkaI18nDefaultMessageLoader){
        if(!isFunction(fn)) throw new Error("默认语言加载器必须是一个函数")
        this._defaultMessageLoader = fn 
    } 
    /**
     * 刷新所有作用域
     */
    async refresh(){
        try{
            const scopeRefreshers = this._scopes.map(scope=>{
                return scope.refresh(this.activeLanguage)
            })
            if(Promise.allSettled){
               await Promise.allSettled(scopeRefreshers)
            }else{
                await Promise.all(scopeRefreshers)
            } 
        }catch(e:any){
            this.logger.error("刷新语言作用域时出错:",e.stack)
        }    
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

} 
 