import { isFunction } from "flex-tools/typecheck/isFunction"
import { deepMerge } from "flex-tools/object/deepMerge"
import inlineFormatters from "./formatters"         
import type {  VoerkaI18nScope } from "./scope"
import type { VoerkaI18nLanguageDefine,  VoerkaI18nDefaultMessageLoader, VoerkaI18nFormatter,  IVoerkaI18nStorage }  from "./types"
import { VoerkaI18nFormatterRegistry } from "./formatterRegistry" 
import { InvalidLanguageError } from './errors';
import { LiteEvent } from "flex-tools/events/liteEvent"
import defaultStoage from "./storage"
import { assignObject } from 'flex-tools/object/assignObject';
import { createLogger } from "./logger"


// 默认语言配置
const defaultLanguageSettings = {  
    debug          : true,
    defaultLanguage: "zh",
    activeLanguage : "zh",
    storage        : defaultStoage,
    languages      : [
        {name:"zh",title:"中文",default:true},
        {name:"en",title:"英文"}
    ]
} as VoerkaI18nManagerOptions

export interface VoerkaI18nManagerOptions {
    debug?         : boolean
    defaultLanguage: string
    activeLanguage : string
    languages      : VoerkaI18nLanguageDefine[]
    storage?       : IVoerkaI18nStorage                                 // 语言包存储器
}

export type VoerkaI18nEvents =     
    "ready"                 // 当默认语言第一次加载完成后触发，data={language,scope}
    | "change"              // 当语言切换时    data=language
    | "registered"          // 当Scope注册到成功后    
    | "restore"             // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}
    | "patched"             // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}               


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

export class VoerkaI18nManager extends LiteEvent<any,VoerkaI18nEvents>{
    static instance?:VoerkaI18nManager  
    private _scopes:VoerkaI18nScope[] = []
    private _defaultMessageLoader?:VoerkaI18nDefaultMessageLoader
    private _formatters:VoerkaI18nFormatterRegistry = new VoerkaI18nFormatterRegistry()
    private _appScopeId?:string
    private _options!:Required<VoerkaI18nManagerOptions>  
    private _logger!:ReturnType<typeof createLogger>
    private _appInitilized:boolean = false
    constructor(options?:VoerkaI18nManagerOptions){
        super()
        if(VoerkaI18nManager.instance){
            return VoerkaI18nManager.instance;
        }
        this._options= deepMerge({},defaultLanguageSettings,options) as Required<VoerkaI18nManagerOptions>
        this._logger = createLogger(this.options.debug)
        VoerkaI18nManager.instance = this;
        this.loadInitialFormatters().then(()=>{
            this.loadOptionsFromStorage()                               // 从存储器加载语言包配置        
        })                                // 加载初始格式化器        
    }
    get debug(){return this.options.debug }
    get options(){ return this._options}  
    get logger(){ return this._logger }                            // 日志记录器                        
    get scopes(){ return this._scopes }                             // 注册的报有VoerkaI18nScope实例
    get appScopeId(){ return this._appScopeId }                    // 应用的scopeId
    get activeLanguage(){ return this.options!.activeLanguage}     // 当前激活语言名称
    get defaultLanguage(){ return this.options!.defaultLanguage}   // 默认语言名称    
    get languages(){ return this.options!.languages}               // 支持的语言列表    
    get defaultMessageLoader(){ return this._defaultMessageLoader}  // 默认语言包加载器
    get formatters(){return this._formatters!}
    get storage(){return this.options.storage}

    /**
     * 本方法供scope.options.library=false，即应用时调用更新配置
     * 
     */
    initApp(appScopeOptions:VoerkaI18nManagerOptions){
        if(this._appInitilized){
            this.logger.warn("VoerkaI18n只允许注册一个library=false的i18nScope,请检查是否正确配置了library参数")
            return
        }
        assignObject(this.options,appScopeOptions)
        this.loadOptionsFromStorage()                               // 从存储器加载语言包配置
        this._appInitilized = true
    }
    
    /**
     * 从存储器加载语言包配置
     */
    private loadOptionsFromStorage(){
        if(this.options.storage){
            const storage = this.options.storage
            const savedLangauge = storage.get("language")
            if(savedLangauge && !this.hasLanguage(savedLangauge)) {
                this.logger.warn("从存储中读取到未配置的语言名称参数：",savedLangauge)
            }
            if(savedLangauge) this.logger.info("从存储中读取到当前语言名称参数：",savedLangauge)
            if(savedLangauge && savedLangauge!=='undefined'){
                this.options.activeLanguage = savedLangauge
                this.logger.debug("当前语言设置为：",savedLangauge)
            }
        }
    }
    private saveOptionsToStorage(){
        if(this.options.storage){
            const storage = this.options.storage
            if(!this.options.activeLanguage)  return
            storage.set("language",this.activeLanguage)            
            this.logger.debug("当前语言设置已保存到存储：",this.activeLanguage)
        }
    }
    /**
     * 初始加载格式化器
     */
    private async loadInitialFormatters(){
        this._formatters.loadInitials(inlineFormatters)
        this._formatters.change(this.options!.activeLanguage)
    }
    // 通过默认加载器加载文件
    async loadMessagesFromDefaultLoader(newLanguage:string,scope:VoerkaI18nScope){
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
        if(this.languages.findIndex(lang=>lang.name === language)!==-1 || isFunction(this._defaultMessageLoader)){
            // 切换全局格式化器上下文
            this._formatters.change(language)                          
            // 通知所有作用域刷新到对应的语言包
            await this._refreshScopes(language)                        
            this.options!.activeLanguage = language            
            // 触发语言切换事件
            this.emit("change",language)     
            this.saveOptionsToStorage()                         // 保存语言配置到存储器
            this.logger.info("语言已切换为：",language)
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
            this.logger.error("刷新语言作用域时出错:",e.stack)
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
        const isInit = this._scopes.length===0 && !scope.options.library
        this._scopes.push(scope) 
        if(this._scopes.length===1) this._appScopeId = scope.id
        if(scope.options.library===false) this._appScopeId = scope.id
        await scope.refresh(this.activeLanguage) 
        // 在第一次初始化时触发ready事件
        if(isInit){
            this.emit("ready",{language:this.activeLanguage,scope:scope.id},true)
        }
    }    
    async ready(){
        return await this.waitFor("ready")
    }

    /**
     * 注册全局格式化器
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
       registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
       registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
       registerFormatter(name,value=>{...},{langauge:"zh,cht"})

     
     * @param {*} formatter 
        language : 声明该格式化器适用语言
     */
    registerFormatter(name:string,formatter:VoerkaI18nFormatter,options?:{language?:string | string[] | '*'}){
        const {language = "*"} = options || {}
        if (!isFunction(formatter) || typeof name !== "string") {
			throw new TypeError("格式化器必须是一个函数");
		}
        this._formatters.register(name,formatter,{language})
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
        return this._refreshScopes(this.activeLanguage)
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
 