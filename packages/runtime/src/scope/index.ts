import type { 
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages,   
    VoerkaI18nLanguageMessagePack,
    IVoerkaI18nStorage,  
    VoerkaI18nLanguagePack,
    VoerkaI18nLanguageLoader,
    VoerkaI18nTranslate,
    VoerkaI18nTranslateVars,
    VoerkaI18nTranslateOptions,
    VoerkaI18nTranslatedComponent
} from "@/types" 
import { DefaultLanguageSettings } from '../consts';
import { Mixin } from "ts-mixer"
import { EventEmitterMixin } from "./mixins/eventEmitter"
import { PatchMessageMixin } from "./mixins/patch"
import { ChangeLanguageMixin } from "./mixins/change"
import { VoerkaI18nLogger, VoerkaI18nLoggerOutput } from "../logger";
import { VoerkaI18nFormatters } from "../formatter/types"
import { getId } from "@/utils/getId"  
import { createLogger } from "@/logger";
import { VoerkaI18nFormatterManager } from "../formatter/manager"; 
import { isI18nManger } from "@/utils/isI18nManger"
import { LanguageMixin } from "./mixins/language"
import { TranslateMixin } from "./mixins/translate"
import { RestoreMixin } from "./mixins/restore";
import { InterpolatorMixin } from "./mixins/interpolator";
import { VoerkaI18nOnlyOneAppScopeError } from "@/errors";
import { isFunction } from "flex-tools/typecheck/isFunction" 
import { assignObject } from "flex-tools/object/assignObject"
import { VoerkaI18nManager } from "../manager"
import { LocalStorage } from "@/storage";
import { isBrowser } from "@/utils/isBrowser";



export interface VoerkaI18nScopeOptions {
    id?            : string                                                  // 作用域唯一id，一般可以使用package.json中的name字段
    debug?         : boolean                                                 // 是否开启调试模式，开启后会输出调试信息
    library?       : boolean                                                 // 当使用在库中时应该置为true
    languages      : VoerkaI18nLanguageDefine[]                              // 当前作用域支持的语言列表
    fallback?      : string                                                  // 默认回退语言
    messages       : VoerkaI18nLanguageMessagePack                           // 当前语言包
    idMap?         : Voerkai18nIdMap                                         // 消息id映射列表
    storage?       : IVoerkaI18nStorage                                      // 语言包存储器
    formatters?    : VoerkaI18nFormatters                                    // 当前作用域的格式化
    log?           : VoerkaI18nLoggerOutput                                  // 日志记录器
    attached?      : boolean                                                 // 是否挂接到appScope
    sorageKey?     : string                                                  // 保存到Storeage时的Key
    loader?        : VoerkaI18nLanguageLoader                                // 从远程加载语言包 
    cachePatch?    : boolean                                                 // 是否缓存补丁语言包    
    namespaces?    : Record<string,string>                                   // 命名空间
    patterns?      : string[]                                                // 源文件匹配清单，使用fast-glob匹配文件
    /**
     * 自定义翻译组件
     */
    component? : ( props: {
            message : string | ((language:string)=>any), 
            vars?   : VoerkaI18nTranslateVars, 
            options?: VoerkaI18nTranslateOptions 
        }) => any            
    translate? : ( props: {
            message  : string, 
            vars?    : VoerkaI18nTranslateVars, 
            options? : VoerkaI18nTranslateOptions 
        }) => any    
} 

export class VoerkaI18nScope extends Mixin(
        EventEmitterMixin,
        PatchMessageMixin,
        ChangeLanguageMixin,
        LanguageMixin,
        TranslateMixin,
        InterpolatorMixin,
        RestoreMixin
    ){
    __VoerkaI18nScope__ = true
    private _options          : Required<VoerkaI18nScopeOptions>
    private _manager!         : VoerkaI18nManager                                   // 引用全局VoerkaI18nManager配置，注册后自动引用
    private _formatterManager : VoerkaI18nFormatterManager | null = null
    private _logger!          : VoerkaI18nLogger    
    protected _defaultLanguage: string ='zh-CN'                                     // 默认语言名称
    protected _activeLanguage : string ='zh-CN'                                     // 默认语言名称    
    protected _activeMessages : VoerkaI18nLanguageMessages = {}                     // 当前语言包
    protected _patchedMessages: VoerkaI18nLanguagePack = {}                         // 补丁语言包
    
    /**
     * 
     * @param options  
     */
	constructor(options:VoerkaI18nScopeOptions) {
        super()
        this._options = assignObject({
            id             : getId(),                       // 作用域唯一id
            library        : false,                         // 当使用在库中时应该置为true
            debug          : false,                         // 是否开启调试模式，开启后会输出调试信息
            languages      : [],                            // 当前作用域支持的语言列表
            messages       : {},                            // 所有语言包={[language]:VoerkaI18nLanguageMessages}
            idMap          : {},                            // 消息id映射列表
            formatters     : [],                            // 是否挂接到appScope
            attached       : true,                          // 是否挂接到appScope
            sorageKey      : 'language',                    // 保存语言配置到Storage时的Key
            cachePatch     : true                           // 是否缓存补丁语言包
        },options) as Required<VoerkaI18nScopeOptions>
        this._init()
	}
    get id() { return this._options.id;}                                        // 作用域唯一id	    
    get options(){ return this._options}                                        // 
	get attached() { return this._options.attached}                             // 作用域唯一id	    
    get debug(){return this._options.debug }                                    // 是否开启调试模式
    get library(){return this._options.library }                                // 是否是库
    get formatters() {	return this._formatterManager! }                        // 格式化器管理器
    get activeMessages() { return this._activeMessages;}                        // 当前语言包
    get defaultLanguage() { return this._defaultLanguage }                      // 默认语言名称    
    get defaultMessages() { return this.messages[this.defaultLanguage];}        // 默认语言包    
	get messages() { return this._options.messages;	}                           // 所有语言包	
	get idMap() { return this._options.idMap;}                                  // 消息id映射列表	
	get languages() { return this._options.languages;}                          // 当前作用域支持的语言列表[{name,title,fallback}]	
	get manager() {	return this._manager;}                                      // 引用全局VoerkaI18n配置，注册后自动引用    
    get appScope() { return this._manager.scope}                                // 全局作用域
	get interpolator(){ return this._flexVars! }                                // 变量插值处理器,使用flexvars    
    get logger(){ return this._logger!}                                         // 日志记录器
    get t():VoerkaI18nTranslate{ return this.translate.bind(this) as VoerkaI18nTranslate}
    get Translate(){ return this._Translate.bind(this) as VoerkaI18nTranslatedComponent }
    
    /**
     * 激活语言名称： 以appScope为准    
     */
	get activeLanguage():string { 
        return this._activeLanguage
        // return  this._options.attached ? ((this.library ? this._manager.activeLanguage : this._activeLanguage)) : this._activeLanguage as string 
    }  
    // 
    get storage(){ return this.getScopeOption<IVoerkaI18nStorage>('storage')}    
    get loader(){ return this.getScopeOption<VoerkaI18nLanguageLoader>('loader') }
    /**
     * 有些配置项是以appScope为准
     * @param name 
     * @returns 
     */
    private getScopeOption<T>(name:string):T | undefined{
        const scopeOpts = this._options as any
        // @ts-ignore
        return (this.attached ? scopeOpts[name] || (this.library ? this._manager[name] : undefined) : scopeOpts[name]) as T | undefined
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
            if (language.default) defaultLang = language.name
            if (language.active) activeLang = language.name
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

        if(!this._options.library && !this._options.storage){
            this._options.storage = LocalStorage
        }        
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
        this._logger = createLogger(this._options.log)
        // 处理初始化参数
        this._initOptions()

        // appScope需要从应用中恢复保存的
        if(!this.library) this.restoreLanguage()
        // 初始化格式化器
        this._initInterpolators()        
        // 初始化格式化器
        this._formatterManager = new VoerkaI18nFormatterManager(this)       
        // 将当前实例注册到全局单例VoerkaI18nManager中
		this.registerToManager()       
    } 
    /**
     * 
     * 当scope上在全局应用scope创建之后时，会调用此方法
     * 本方法在注册到全局VoerkaI18nManager时由Manager调用，
     * 
     * 注意：本方法仅当
     * scope是在全局应用scope创建之前时才会调用
     * 
     * 如果scope是在全局应用scope创建之后时创建的，则不会调用此方法
     * 因为此时scope会直接注册到全局VoerkaI18nManager中，不会保存到全局变量__VoerkaI18nScopes__中
     * 
     * @param manager 
     * @returns 
     */
    bind(manager:VoerkaI18nManager){
        this._manager = manager               
        this._manager.once('init',this._initRefresh.bind(this))        
    }
    /**
     * 第一次初始化时刷新语言
     */
    private _initRefresh(getInitLanguage?:()=>string){
        if(this.library){
            this.refresh(getInitLanguage && getInitLanguage())
        }else{ // app
            this._applyLangAttrToHTML()    
            const tasks:any[]=[]
            if(this._defaultLanguage !== this._activeLanguage || isFunction(this.activeMessages)){
                tasks.push(this.refresh(undefined,{ patch:false }))                
            }    
            tasks.push(this.patch())
            Promise.all(tasks).then(()=>{
                this.emit('ready',this.activeLanguage,true)
            })
        }        
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
                throw new VoerkaI18nOnlyOneAppScopeError("应用只能有一个library=false的i18nScope")
            }
            this._manager = new VoerkaI18nManager(this)            
        }
        // 当前作用域是库时，如果此时Manager和应用Scope还没创建就先保存到了全局变量__VoerkaI18nScopes__中
        // 当应用Scope创建后，会再调用registerToManager方法注册到全局VoerkaI18nManager中
        const manager = globalThis.VoerkaI18n as VoerkaI18nManager
        if(manager && isI18nManger(manager)){
            if(isAppScope){
                this._initRefresh()
            }else{
                manager.register(this)  
            } 
        }else{
            if(!globalThis.__VoerkaI18nScopes__) globalThis.__VoerkaI18nScopes__ = []
            globalThis.__VoerkaI18nScopes__.push(this)
        }
    }
	async change(language:string) {
        let finalLang:string = this.activeLanguage
        if(this.attached){
            finalLang = await this._manager.change(language)
        }else{
            finalLang = await this.refresh(language)
        }   
        this._applyLangAttrToHTML()     
        return finalLang 
    }  
    /**
     * 检查当前环境是是否是在浏览器环境中，如果是，则在body上添加language=<activeLanguage>属性
     */
    private _applyLangAttrToHTML(){        
        if(this.library) return
        if(!isBrowser()) return
        try{
            document.body.setAttribute("language",this.activeLanguage)
        }catch{}
    }
}

