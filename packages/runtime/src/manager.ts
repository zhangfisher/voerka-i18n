import { isFunction } from "flex-tools/typecheck/isFunction"
import { deepMerge } from "flex-tools/object/deepMerge"
import inlineFormatters from "./formatters"         
import type {  VoerkaI18nScope } from "./scope"
import type { VoerkaI18nLanguageDefine,  VoerkaI18nDefaultMessageLoader, VoerkaI18nFormatter,  IVoerkaI18nStorage }  from "./types"
import { VoerkaI18nFormatterRegistry } from "./formatterRegistry" 
import { InvalidLanguageError } from './errors';
import { FlexEvent, FlexEventOptions } from "flex-tools/events/flexevent"
import defaultStoage from "./storage"
import { assignObject } from 'flex-tools/object/assignObject';

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
    debug?: boolean
    defaultLanguage: string
    activeLanguage: string
    languages: VoerkaI18nLanguageDefine[]
    storage?:IVoerkaI18nStorage                                 // 语言包存储器
}
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

export class VoerkaI18nManager extends FlexEvent{
    static instance?:VoerkaI18nManager  
    #scopes:VoerkaI18nScope[] = []
    #defaultMessageLoader?:VoerkaI18nDefaultMessageLoader
    #formatters:VoerkaI18nFormatterRegistry = new VoerkaI18nFormatterRegistry()
    #appScopeId?:string
    constructor(options?:VoerkaI18nManagerOptions){
        super(deepMerge(
            defaultLanguageSettings,
            options,
            {
                array:'replace',
                ignoreUndefined:true
        }) as FlexEventOptions)
        if(VoerkaI18nManager.instance){
            return VoerkaI18nManager.instance;
        }
        VoerkaI18nManager.instance = this;
        this.loadInitialFormatters()                                // 加载初始格式化器        
        this.loadOptionsFromStorage()                               // 从存储器加载语言包配置        
    }
    get debug(){return this.options.debug }
    get options(){ return super.options as Required<VoerkaI18nManagerOptions & FlexEventOptions>   }                          
    get scopes(){ return this.#scopes }                             // 注册的报有VoerkaI18nScope实例
    get appScopeId(){ return this.#appScopeId }                    // 应用的scopeId
    get activeLanguage(){ return this.options!.activeLanguage}     // 当前激活语言名称
    get defaultLanguage(){ return this.options!.defaultLanguage}   // 默认语言名称    
    get languages(){ return this.options!.languages}               // 支持的语言列表    
    get defaultMessageLoader(){ return this.#defaultMessageLoader}  // 默认语言包加载器
    get formatters(){return this.#formatters!}

    /**
     * 本方法供scope.options.library=false，即应用时调用更新配置
     * 
     */
    initApp(appScopeOptions:VoerkaI18nManagerOptions){
        assignObject(this.options,appScopeOptions)
        this.loadOptionsFromStorage()                               // 从存储器加载语言包配置
    }
    
    /**
     * 从存储器加载语言包配置
     */
    private loadOptionsFromStorage(){
        if(this.options.storage){
            const storage = this.options.storage
            const activeLangauge = storage.get("language")
            if(activeLangauge){
                this.options.activeLanguage = activeLangauge
            }
        }
    }
    private saveOptionsToStorage(){
        if(this.options.storage){
            const storage = this.options.storage
            storage.set("language",this.activeLanguage)
        }
    }
    /**
     * 初始加载格式化器
     */
    private loadInitialFormatters(){
        this.#formatters.loadInitials(inlineFormatters)
        this.#formatters.change(this.options!.activeLanguage)
    }
    // 通过默认加载器加载文件
    async loadMessagesFromDefaultLoader(newLanguage:string,scope:VoerkaI18nScope){
        if(this.#defaultMessageLoader && isFunction(this.#defaultMessageLoader)){
            return  await this.#defaultMessageLoader.call(scope,newLanguage,scope)        
        }
    }
    /**
     *  切换语言
     */
    async change(language:string){
        if(this.languages.findIndex(lang=>lang.name === language)!==-1 || isFunction(this.#defaultMessageLoader)){
            // 切换全局格式化器上下文
            this.#formatters.change(language)                          
            // 通知所有作用域刷新到对应的语言包
            await this._refreshScopes(language)                        
            this.options!.activeLanguage = language            
            this.emit("change",language,true)               // 触发语言切换事件
            this.saveOptionsToStorage()                     // 保存语言配置到存储器
            return language
        }else{
            throw new InvalidLanguageError()
        }
    }
    /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
    async _refreshScopes(newLanguage:string){ 
        try{
            const scopeRefreshers = this.#scopes.map(scope=>{
                return scope.refresh(newLanguage)
            })
            if(Promise.allSettled){
               await Promise.allSettled(scopeRefreshers)
            }else{
                await Promise.all(scopeRefreshers)
            } 
        }catch(e:any){
            console.warn("Error while refreshing i18n scopes:",e.message)
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
        this.#scopes.push(scope) 
        if(this.#scopes.length===1) this.#appScopeId = scope.id
        if(scope.options.library===false) this.#appScopeId = scope.id
        return await scope.refresh(this.activeLanguage) 
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
			throw new TypeError("Formatter must be a function");
		}
        this.#formatters.register(name,formatter,{language})
    }
    /**
    * 注册默认文本信息加载器
    */
    registerDefaultLoader(fn:VoerkaI18nDefaultMessageLoader){
        if(!isFunction(fn)) throw new Error("The default loader must be a async function or promise returned")
        this.#defaultMessageLoader = fn
        //this.refresh()
    } 
    /**
     * 刷新所有作用域
     */
    async refresh(){
        try{
            let requests = this.#scopes.map(scope=>scope.refresh())
            if(Promise.allSettled){
                await Promise.allSettled(requests)
            }else{
                await Promise.all(requests)
            }
        }catch(e:any){
            if(this.debug) console.error(`Error while refresh voerkai18n scopes:${e.message}`) 
        }
    }
    /**
     * 清除所有作用域的翻译补丁信息
     */
    clearPatchedMessages(){
        this.#scopes.forEach(scope=>scope.clearPatchedMessages())
    }

} 
 