import type { 
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages,   
    VoerkaI18nLanguageMessagePack,
    IVoerkaI18nStorage, 
    Dict,
    VoerkaI18nLanguagePack
} from "@/types" 
import { DefaultLanguageSettings, DefaultFallbackLanguage } from '../consts';
import { Mixin } from "ts-mixer"
import { EventEmitterMixin } from "./mixins/eventEmitter"
import { PatchMessageMixin } from "./mixins/patch"
import { MessageLoaderMixin } from "./mixins/loader"
import { VoerkaI18nLogger } from "../logger";
import { VoerkaI18nFormatters } from "../formatter/types"
import { getId } from "@/utils/getId"  
import { createLogger } from "@/logger";
import { VoerkaI18nFormatterManager } from "../formatter/manager"; 
import { isI18nManger } from "@/utils/isI18nManger"
import { LanguageMixin } from "./mixins/language"
import { TranslateMixin } from "./mixins/translate"
import { InterpolatorMixin } from "./mixins/interpolator";
import { VoerkaI18nOnlyOneAppScopeError } from "@/errors";
import { isFunction } from "flex-tools/typecheck/isFunction" 
import { assignObject } from "flex-tools/object/assignObject"
import { VoerkaI18nManager } from "../manager"

export interface VoerkaI18nScopeOptions {
    id?        : string                                                  // 作用域唯一id，一般可以使用package.json中的name字段
    debug?     : boolean                                                 // 是否开启调试模式，开启后会输出调试信息
    library?   : boolean                                                 // 当使用在库中时应该置为true
    languages  : VoerkaI18nLanguageDefine[]                              // 当前作用域支持的语言列表
    fallback?  : string                                                  // 默认回退语言
    messages   : VoerkaI18nLanguageMessagePack                           // 当前语言包
    idMap?     : Voerkai18nIdMap                                         // 消息id映射列表
    storage?   : IVoerkaI18nStorage                                      // 语言包存储器
    formatters?: VoerkaI18nFormatters                                    // 当前作用域的格式化
    logger?    : VoerkaI18nLogger                                        // 日志记录器
    attached?  : boolean                                                 // 是否挂接到appScope
}


export type VoerkaI18nScopeFormatterContext = {
    getFormatterConfig: <T=Dict>(configKey?:string )=>T
}

 

export class VoerkaI18nScope<T extends VoerkaI18nScopeOptions = VoerkaI18nScopeOptions> 
    extends Mixin(
        EventEmitterMixin,
        PatchMessageMixin,
        MessageLoaderMixin,
        LanguageMixin,
        TranslateMixin,
        InterpolatorMixin
    ){
    __VoerkaI18nScope__ = true
    private _options          : Required<VoerkaI18nScopeOptions>
    private _manager!         : VoerkaI18nManager                                  // 引用全局VoerkaI18nManager配置，注册后自动引用
    private _formatterManager : VoerkaI18nFormatterManager | null = null
    private _logger!          : VoerkaI18nLogger    
    protected _defaultLanguage: string ='en'                                       // 默认语言名称
    protected _activeLanguage : string ='en'                                       // 默认语言名称    
    protected _activeMessages : VoerkaI18nLanguageMessages = {}                    // 当前语言包
    protected _patchedMessages: VoerkaI18nLanguagePack = {}                        // 补丁语言包
    
    /**
     * 
     * @param options 
     * @param callback  当前作用域初始化完成后的回调函数 
     */
	constructor(options:T) {
        super()
        this._options = assignObject({
            id             : getId(),                       // 作用域唯一id
            library        : false,                         // 当使用在库中时应该置为true
            debug          : false,                         // 是否开启调试模式，开启后会输出调试信息
            languages      : [],                            // 当前作用域支持的语言列表
            fallback       : 'en',                          // 默认回退语言
            messages       : {},                            // 所有语言包={[language]:VoerkaI18nLanguageMessages}
            idMap          : {},                            // 消息id映射列表
            formatters     : {},                            // 是否挂接到appScope
            attached       : true                           // 是否挂接到appScope
        },options) as Required<VoerkaI18nScopeOptions>      
        this._init()                   
	}	
    get id() { return this._options.id;}                                        // 作用域唯一id	    
    get options(){ return this._options}   
	get attached() { return this._options.attached}                             // 作用域唯一id	    
    get debug(){return this._options.debug }                                    // 是否开启调试模式
    get library(){return this._options.library }                                // 是否是库
    get formatters() {	return this._formatterManager! }                        // 格式化器管理器
    get activeMessages() { return this._activeMessages;}                       // 当前语言包
    get defaultLanguage() { return this._defaultLanguage }                      // 默认语言名称    
    get defaultMessages() { return this.messages[this.defaultLanguage];}        // 默认语言包    
	get messages() { return this._options.messages;	}                           // 所有语言包	
	get idMap() { return this._options.idMap;}                                  // 消息id映射列表	
	get languages() { return this._options.languages;}                          // 当前作用域支持的语言列表[{name,title,fallback}]	
	get manager() {	return this._manager;}                                      // 引用全局VoerkaI18n配置，注册后自动引用    
    get global() { return this._manager.scope}                                  // 全局作用域
	get interpolator(){ return this._flexVars! }                                // 变量插值处理器,使用flexvars
    get storage(){ return this._options!.storage}    
    get logger(){ return this._logger!}                                         // 日志记录器
    get t(){ return this.translate.bind(this)}              
    /**
     * 激活语言名称： 以appScope为准    
     */
	get activeLanguage():string { 
        return (this.library ? this._manager.activeLanguage : this._activeLanguage) as string 
    }       
    private _initOptions(){
        // 1. 检测语言配置列表是否有效
        if(!Array.isArray(this.languages)){
            this.logger.warn("无效的语言配置，将使用默认语言配置")
            this._options.languages = Object.assign([],DefaultLanguageSettings)
        }else if(this.languages.length==0){
            throw new Error("[VoerkaI18n] 未提供语言配置")            
        }        

        // 2.为语言配置默认回退语言，并且提取默认语言和活动语言
        let activeLang: string, defaultLang: string
        this.languages.forEach(language => {
            if (!language.fallback) language.fallback = DefaultFallbackLanguage
            if (language.default) defaultLang = language.name
            if (language.active) activeLang = language.name
            if (language.fallback && !this.hasLanguage(language.fallback)) {
                language.fallback = DefaultFallbackLanguage
            }
        })

        // 3. 确保提供了有效的默认语言和活动语言
        const lanMessages = this._options.messages
        if (!(defaultLang! in lanMessages)) defaultLang = Object.keys(lanMessages)[0]
        if (!(activeLang! in lanMessages)) activeLang = defaultLang!
        if (!(defaultLang! in lanMessages)) {
            throw new Error("[VoerkaI18n] 无效的语言配置，必须提供有效的默认语言和活动语言.")
        }

        this._activeLanguage  = activeLang!
        this._defaultLanguage = defaultLang!
        
        // 初始化时，默认和激活的语言包只能是静态语言包，不能是动态语言包
        // 因为初始化时激活语言需要马上显示，如果是异步语言包，会导致显示延迟
        if(isFunction(this.messages[this._defaultLanguage])){
            throw new Error("[VoerkaI18n] 默认语言包必须是静态内容,不能使用异步加载的方式.")
        }

        this._activeMessages = this.messages[this._activeLanguage] as VoerkaI18nLanguageMessages
    } 
    /**
     * 对输入的语言配置进行处理
     * - 将en配置为默认回退语言
     * - 确保提供了有效的默认语言和活动语言
     */
    private _init(){         
        this._logger = createLogger()
        // 处理初始化参数
        this._initOptions()
        // 初始化格式化器
        this._formatterManager = new VoerkaI18nFormatterManager(this)       
        // 初始化格式化器
        this._initInterpolators()        
        // 将当前实例注册到全局单例VoerkaI18nManager中
		this.registerToManager()       
    } 
    /**
     * 
     * 本方法在注册到全局VoerkaI18nManager时由Manager调用，
     * 
     * @param manager 
     * @returns 
     */
    bind(manager:VoerkaI18nManager){
        this._manager = manager               
        this._manager.once('init',this.refresh.bind(this))                          
    }  

    /**
     * 注册当前作用域到全局作用域
     * @param callback 
     */
    private registerToManager(){ 
        if(!this.attached) return
        const isAppScope = !this.options.library 
        if(isAppScope){
            if(globalThis.VoerkaI18n && globalThis.VoerkaI18n.scope){
                throw new VoerkaI18nOnlyOneAppScopeError("应用中只能有一个library=false的i18nScope")
            }
            this._manager = new VoerkaI18nManager(this)            
        }
        // 当前作用域是库时，如果此时Manager和应用Scope还没创建就先保存到了全局变量__VoerkaI18nScopes__中
        // 当应用Scope创建后，会再调用registerToManager方法注册到全局VoerkaI18nManager中
        const manager = globalThis.VoerkaI18n as VoerkaI18nManager
        if(manager && isI18nManger(manager)){
            if(!isAppScope) manager.register(this) 
        }else{
            if(!globalThis.__VoerkaI18nScopes__) globalThis.__VoerkaI18nScopes__ = []
            globalThis.__VoerkaI18nScopes__.push(this)
        }
    }  
	 
	async change(language:string) {
        if(this.attached){
            return await this._manager.change(language)
        }else{
            await this.refresh(language)
        }        
    }  
}

