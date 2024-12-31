import { isFunction } from "flex-tools/typecheck/isFunction" 
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { assignObject } from "flex-tools/object/assignObject"
import { isNumber } from "flex-tools/typecheck/isNumber"
import { VoerkaI18nManager } from "../manager"
import type { 
    VoerkaI18nDefaultMessageLoader,
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages,  
    VoerkaI18nTranslate,   
    VoerkaI18nLanguageMessagePack,
    IVoerkaI18nStorage, 
    Dict,
    VoerkaI18nLanguagePack
} from "@/types" 
import { DefaultLanguageSettings, DefaultFallbackLanguage } from '../consts';
import {  FlexVars } from 'flexvars';
import { mix } from "ts-mixer"
import { EventEmitterMixin } from "./mixins/eventEmitter"
import { PatchMessageMixin } from "./mixins/patch"
import { MessageLoaderMixin } from "./mixins/loader"
import { VoerkaI18nLogger } from "../logger";
import { VoerkaI18nFormatters } from "../formatter/types"

import { getId } from "@/utils/getId"  
import { createLogger } from "@/logger";
import { VoerkaI18nFormatterManager } from "../formatter/manager";
import { isMessageId } from "@/utils/isMessageId";


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
}


export type VoerkaI18nScopeFormatterContext = {
    getFormatterConfig: <T=Dict>(configKey?:string )=>T
}


export interface VoerkaI18nScope extends 
    EventEmitterMixin,
    PatchMessageMixin,
    MessageLoaderMixin
    {}

@mix(
    EventEmitterMixin,
    PatchMessageMixin,
    MessageLoaderMixin
)
export class VoerkaI18nScope<T extends VoerkaI18nScopeOptions = VoerkaI18nScopeOptions>{
    __VOERKAI18N_SCOPE__ = true
    private _options          : Required<VoerkaI18nScopeOptions>
    private _manager!         : VoerkaI18nManager                                  // 引用全局VoerkaI18nManager配置，注册后自动引用
    private _t!               : VoerkaI18nTranslate
    private _formatterManager : VoerkaI18nFormatterManager | null = null
    private _flexVars?        : FlexVars<VoerkaI18nScopeFormatterContext>          // 变量插值处理器,使用flexvars
    private _logger!          : VoerkaI18nLogger    
    protected _defaultLanguage: string ='en'                                       // 默认语言名称
    protected _activeLanguage : string ='en'                                       // 默认语言名称    
    protected _refreshing     : boolean = false                                    // 是否正在刷新语言包
    protected _activeMessages : VoerkaI18nLanguageMessages = {}                    // 当前语言包
    protected _patchedMessages: VoerkaI18nLanguagePack = {}                        // 补丁语言包
    /**
     * 
     * @param options 
     * @param callback  当前作用域初始化完成后的回调函数 
     */
	constructor(options:T) {
        this._options = assignObject({
            id             : getId(),                       // 作用域唯一id
            library        : false,                         // 当使用在库中时应该置为true
            debug          : false,                         // 是否开启调试模式，开启后会输出调试信息
            languages      : [],                            // 当前作用域支持的语言列表
            fallback       : 'en',                          // 默认回退语言
            messages       : {},                            // 所有语言包={[language]:VoerkaI18nLanguageMessages}
            idMap          : {},                            // 消息id映射列表
            formatters     : {},                            // 当前作用域的格式化器
        },options) as Required<VoerkaI18nScopeOptions>      
        this._init()           
	}	

    get options(){ return this._options}   
	get id() { return this._options.id;}                                        // 作用域唯一id	    
    get debug(){return this._options.debug }                                    // 是否开启调试模式
    get formatters() {	return this._formatterManager! }                        // 格式化器管理器
	get activeLanguage() { return this._activeLanguage }                        // 激活语言名称     
    get activeMessages() { return this._activeMessages;}                      // 当前语言包
    get defaultLanguage() { return this._defaultLanguage }                      // 默认语言名称    
    get defaultMessages() { return this.messages[this.defaultLanguage];}        // 默认语言包    
	get messages() { return this._options.messages;	}                           // 所有语言包	
	get idMap() { return this._options.idMap;}                                  // 消息id映射列表	
	get languages() { return this._options.languages;}                          // 当前作用域支持的语言列表[{name,title,fallback}]	
	get manager() {	return this._manager;}                                      // 引用全局VoerkaI18n配置，注册后自动引用    
    get global() { return this._manager.scope}                                  // 全局作用域
	get interpolator(){ return this._flexVars! }                                // 变量插值处理器,使用flexvars
    get storage(){ return this._options!.storage}    
    get logger(){ return this._logger!}                                 // 日志记录器
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

        this._activeMessages = this.messages[this._activeLanguage] as VoerkaI18nLanguageMessages
    } 
    private _initInterpolators(){
        this._flexVars = new FlexVars<VoerkaI18nScopeFormatterContext>({
            filterContext:{
                getFormatterConfig:(configKey?:string)=>{
                    if(!configKey) return {}                    
                    const configs = (this.activeMessages['$config'] || {}) as any
                    return configs[configKey as any] || {}
                }
            }
        })
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
        const isLibrary = this._options.library
        // 当前作用域是库时，如果此时Manager和应用Scope还没创建就先保存到了全局变量__VoerkaI18nScopes__中
        // 当应用Scope创建后，会再调用registerToManager方法注册到全局VoerkaI18nManager中
        if(isLibrary && !globalThis.VoerkaI18n){
            if(!globalThis.__VoerkaI18nScopes__) globalThis.__VoerkaI18nScopes__ = []
            globalThis.__VoerkaI18nScopes__.push(this)
        }
        // 应用Scope
        if(!isLibrary){
            this.manager.register(this)
            this._manager.once('init',this.refresh.bind(this))  
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
 
	/**
	 * 获取指定语言信息
	 * @param {*} language
	 * @returns
	 */
	getLanguage(this:VoerkaI18nScope,language:string):VoerkaI18nLanguageDefine | undefined{
		let index = this.languages.findIndex((lng) => lng.name == language);
		if (index !== -1) return this.languages[index];
    }

    /**
     * 获取指定语言的备用语言。如果指定的语言存在备用语言选项，则返回该备用语言；否则返回默认语言。
     * @param this - VoerkaI18nScope 实例
     * @param language - 需要获取备用语言的目标语言代码
     * @returns 返回备用语言代码或默认语言代码
     */
    getFallbackLanguage(this: VoerkaI18nScope, language: string): string {
        const lngOptions = this.getLanguage(language)
        if(lngOptions && lngOptions.fallback){
            return lngOptions.fallback
        }else{
            return this._defaultLanguage
        }
    }
	/**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(this:VoerkaI18nScope,language:string) {
		return this.languages.findIndex((lang:VoerkaI18nLanguageDefine) => lang.name == language) != -1;
	} 

    /**
     * 根据值的单数和复数形式，从messages中取得相应的消息
     * 
     * @param {*} messages  复数形式的文本内容 = [<=0时的内容>，<=1时的内容>，<=2时的内容>,...,<>=N的内容>]
     * @param {*} value 
     */
    private _getPluraMessage(messages:string | string[],value:number){
        try{
            if(Array.isArray(messages)){
                return messages.length > value ? messages[value] : messages[messages.length-1]
            }else{
                return messages
            }
        }catch{
            return Array.isArray(messages) ? messages[0] : messages
        }
    }

    translate(this:VoerkaI18nScope,message:string,...args:any[]):string { 
        // 如果内容是复数，则其值是一个数组，数组中的每个元素是从1-N数量形式的文本内容
        let result:string | string[] = message
        let vars=[]                             // 插值变量列表
        let pluraValue = null                   // 复数值        
        if(!(typeof(message)==="string")) return message
        try{
            // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
            if(arguments.length === 2 && isPlainObject(arguments[1])){// 字典插值
                const dictVars:Record<string,any>=arguments[1]
                for(const [name,value] of Object.entries(dictVars)){
                    if(isFunction(value)){
                        try{
                            dictVars[name] = value()
                        }catch{
                            dictVars[name] = value
                        }
                    } 
                    // 以$开头的视为复数变量，记录下来
                    const isNum:boolean = typeof(dictVars[name])==="number"
                    if((pluraValue==null && isNum) || name.startsWith("$") && isNum){
                        pluraValue = dictVars[name]
                    }
                }            
                vars = [dictVars]
            }else if(arguments.length >= 2){ // 位置插值
                vars = [...arguments].splice(1).map((arg)=>{
                    try{
                        arg = isFunction(arg) ? arg() : arg         
                        // 约定：位置参数中以第一个数值变量作为指示复数变量
                        if(isNumber(arg)) pluraValue = parseInt(arg)     
                    }catch{
                        return String(arg)
                     }
                    return arg   
                })            
            }
            
            if(isMessageId(message)){ // 如果是数字id,
                result = (this.activeMessages as any)[message] || message
            }else{
                const msgId = this.idMap[message]  
                // 语言包可能是使用idMap映射过的，则需要转换
                result = (msgId ? (this.activeMessages as any)[msgId]  : (this.activeMessages as any)[message]) ?? message
            }
    
             // 2. 处理复数
            // 经过上面的处理，content可能是字符串或者数组
            // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
            // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
            if(Array.isArray(result) && result.length>0){
                // 如果存在复数命名变量，只取第一个复数变量
                if(pluraValue!==null){  // 启用的是位置插值 
                    result = this._getPluraMessage(result,pluraValue)
                }else{ // 如果找不到复数变量，则使用第一个内容
                    result = result[0]
                }
            }         
            // 如果没有传入插值变量，则直接返回
            if(args.length===0) return result as string
            // 进行插值处理
            return this.interpolator.replace(result as string,...vars)
        }catch{
            return result as any      // 出错则返回原始文本
        } 

    }
};

