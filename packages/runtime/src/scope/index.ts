import { isFunction } from "flex-tools/typecheck/isFunction" 
import { assignObject } from "flex-tools/object/assignObject"
import { VoerkaI18nManager } from "../manager"
import type { 
    VoerkaI18nDefaultMessageLoader,
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages,  
    VoerkaI18nTranslate,   
    VoerkaI18nLanguageMessagePack,
    IVoerkaI18nStorage, 
    Dict
} from "@/types" 
import { DefaultLanguageSettings, DefaultFallbackLanguage } from '../consts';
import {  FlexFilter, FlexVars } from 'flexvars';
import { TranslateMixin } from "./mixins/translate"
import { mix } from "ts-mixer"
import { FormatterMixin } from "./mixins/formatter/formatter"
import { EventEmitterMixin } from "./mixins/eventEmitter"
import { PatchMessageMixin } from "./mixins/patch"
import { MessageLoaderMixin } from "./mixins/loader"
import { LanguageMixin } from "./mixins/language"
import { InterpolatorMixin } from "./mixins/interpolator";
import { VoerkaI18nFormatters } from "./mixins/formatter/types"
import { VoerkaI18nLogger } from "@/logger"
import { getId } from "@/utils/getId"  


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
    ready?     : (error?:Error)=>void                                    // 当注册到全局管理器并切换到语言后的回调函数        
    logger?    : VoerkaI18nLogger                                        // 日志记录器
}


export type VoerkaI18nScopeFormatterContext = {
    getFormatterConfig: <T=Dict>(configKey?:string )=>T
}


export interface VoerkaI18nScope extends 
    TranslateMixin,
    FormatterMixin,
    EventEmitterMixin,
    PatchMessageMixin,
    MessageLoaderMixin,
    LanguageMixin,
    InterpolatorMixin{}

@mix(
    TranslateMixin,
    FormatterMixin,
    EventEmitterMixin,
    PatchMessageMixin,
    MessageLoaderMixin,
    LanguageMixin,
    InterpolatorMixin
)
export class VoerkaI18nScope {
    __VOERKAI18N_SCOPE__ = true
    private _options           : Required<VoerkaI18nScopeOptions>
    private _manager!          : VoerkaI18nManager                                  // 引用全局VoerkaI18nManager配置，注册后自动引用
    private _t                 : VoerkaI18nTranslate
    protected _defaultLanguage : string ='en'                                       // 默认语言名称
    protected _activeLanguage  : string ='en'                                       // 默认语言名称
    protected _flexVars?         : FlexVars<VoerkaI18nScopeFormatterContext>          // 变量插值处理器,使用flexvars
    /**
     * 
     * @param options 
     * @param callback  当前作用域初始化完成后的回调函数 
     */
	constructor(options:VoerkaI18nScopeOptions) {
        this._options = assignObject({
            id             : getId(),                       // 作用域唯一id
            library        : false,                         // 当使用在库中时应该置为true
            debug          : false,                         // 是否开启调试模式，开启后会输出调试信息
            languages      : [],                            // 当前作用域支持的语言列表
            fallback       : 'en',                          // 默认回退语言
            messages       : {},                            // 所有语言包={[language]:VoerkaI18nLanguageMessages}
            idMap          : {},                            // 消息id映射列表
            formatters     : {},                            // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
        },options) as Required<VoerkaI18nScopeOptions>      
        // 初始化
        this._init()           
        this._t = this.translate.bind(this)
	}	
    get options(){ return this._options}   
	get id() { return this._options.id;}                                        // 作用域唯一id	
    get logger(){ return this._manager.logger!}                                 // 日志记录器
    get debug() { return this._options.debug;}                                  // 是否开启调试模式
	get activeLanguage() { return this._activeLanguage }                        // 激活语言名称 
    get defaultLanguage() { return this._defaultLanguage }                      // 默认语言名称    
    get currentMessages() { return this._currentMessages;}                      // 当前语言包
    get defaultMessages() { return this.messages[this.defaultLanguage];}        // 默认语言包
	get messages() { return this._options.messages;	}                           // 所有语言包	
	get idMap() { return this._options.idMap;}                                  // 消息id映射列表	
	get languages() { return this._options.languages;}                          // 当前作用域支持的语言列表[{name,title,fallback}]	
	get manager() {	return this._manager;}                                      // 引用全局VoerkaI18n配置，注册后自动引用    
    get global() { return this._manager.scope}                                  // 全局作用域
	get interpolator(){ return this._flexVars! }                                // 变量插值处理器,使用flexvars
    get storage(){ return this._options!.storage}
    get t(){ return this._t}          
 
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

        this._currentMessages = this.messages[this._activeLanguage] as VoerkaI18nLanguageMessages

    }
    /**
     * 对输入的语言配置进行处理
     * - 将en配置为默认回退语言
     * - 确保提供了有效的默认语言和活动语言
     */
    private _init(){
        // 处理初始化参数
        this._initOptions()
        // 初始化格式化器
        this._initFormatters()
        // 初始化格式化器
        this._createInterpolators()        
        // 将当前实例注册到全局单例VoerkaI18nManager中
		this.registerToManager() 
        // 当全局VoerkaI18nManager初始化后，执行初始化操作,并刷新当前语言
        this._manager.once('init',this.refresh.bind(this))
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
        this._manager.register(this)
            .then(()=>{
                this.onRegisterSuccess.call(this)
            })
            .catch((e:any)=>{
                this.onRegisterFail.call(this,e)
            })   
        return this
    }

    /**
     * 注册当前作用域到全局作用域
     * @param callback 
     */
    private registerToManager(){
        const isLibrary = this._options.library
        // 当前作用域是应用时,如果不存全局VoerkaI18n实例，则创建一个
		if(!isLibrary && !globalThis.VoerkaI18n ) {
            globalThis.VoerkaI18n = new VoerkaI18nManager(this);
		}
        // 当前作用域是库时，如果Manager还没创建则先保存到了全局变量__VoerkaI18nScopes__中
        if(isLibrary && !globalThis.VoerkaI18n){
            if(!globalThis.__VoerkaI18nScopes__) globalThis.__VoerkaI18nScopes__ = []
            globalThis.__VoerkaI18nScopes__.push(this)
        }
        this.bind(globalThis.VoerkaI18n)
    } 
    /**
     * 当注册到Manager后，执行注册后的操作
     */
    private onRegisterSuccess(){
        if(typeof(this._options.ready)=='function'){
            this._options.ready.call(this)
        }
        this.change(this.activeLanguage) 
        // 1. 先从本地缓存中读取并合并补丁语言包
        this._restorePatchedMessages(this._currentMessages,this.activeLanguage);  
        // 2. 从远程延后执行补丁命令，该命令会向远程下载补丁包
        this._patch(this._currentMessages, this.activeLanguage);     
    }
    /**
     * 当注册到Manager失败时，执行注册失败后的操作
     */
    private onRegisterFail(e:any){
        if(typeof(this._options.ready)=='function'){
            this._options.ready.call(this,e)
        } 
    }

	/**
	 * 注册默认文本信息加载器
	 * @param {Function} 必须是异步函数或者是返回Promise
	 */
	registerDefaultLoader(fn:VoerkaI18nDefaultMessageLoader) {
		this.manager.registerDefaultLoader(fn);
	}
	 
	async change(language:string) {
        return await this._manager.change(language)
    } 
};

