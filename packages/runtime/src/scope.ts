import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isFunction } from "flex-tools/typecheck/isFunction" 
import { translate } from "./translate"
import { assignObject } from "flex-tools/object/assignObject"
import {VoerkaI18nManager } from "./manager"
import type { 
    VoerkaI18nDefaultMessageLoader,
    VoerkaI18nFormatter,
    VoerkaI18nLanguageFormatters, 
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages, 
    VoerkaI18nLanguagePack, 
    VoerkaI18nTranslate,  
    VoerkaI18nDynamicLanguageMessages,
    VoerkaI18nLanguageMessagePack,
    VoerkaI18nMessageLoader,
} from "./types" 
import { VoerkaI18nFormatterRegistry } from './formatterRegistry';
import { randomId } from "./utils"
import { DefaultLanguageSettings, DefaultFallbackLanguage } from './consts';

export interface VoerkaI18nScopeOptions {
    id?: string
    debug?: boolean
    languages: VoerkaI18nLanguageDefine[]                       // 当前作用域支持的语言列表
    defaultLanguage?: string                                    // 默认语言名称                         
    activeLanguage?: string                                     // 当前语言名称
    messages: VoerkaI18nLanguageMessagePack                     // 当前语言包
    idMap?: Voerkai18nIdMap                                      // 消息id映射列表
    formatters: VoerkaI18nLanguageFormatters                    // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
    ready?:(e?:Error)=>void                                     // 当注册到全局管理器并切换到语言后的回调函数
}

export class VoerkaI18nScope {
    #options:Required<VoerkaI18nScopeOptions>
    #global:VoerkaI18nManager                           // 引用全局VoerkaI18nManager配置，注册后自动引用
    #refreshing:boolean = false
    #t:VoerkaI18nTranslate
    #formatterRegistry?:VoerkaI18nFormatterRegistry 
    #defaultLanguage:string ='zh'
    #activeLanguage:string='zh'         
    #currentMessages:VoerkaI18nLanguageMessages = {}                   // 当前语言包
    #patchedMessages:VoerkaI18nLanguagePack = {}                       // 补丁语言包
    /**
     * 
     * @param options 
     * @param callback  当前作用域初始化完成后的回调函数 
     */
	constructor(options:VoerkaI18nScopeOptions) {
        this.#options = assignObject({
            id             : randomId(),                   // 作用域唯一id
            debug          : false,
            languages      : {},                          // 当前作用域支持的语言列表
            messages       : {},                          // 所有语言包={[language]:VoerkaI18nLanguageMessages}
            idMap          : {},                          // 消息id映射列表
            formatters     : {},                          // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
        },options) as Required<VoerkaI18nScopeOptions>      
        // 初始化
        this.init()   
        // 将当前实例注册到全局单例VoerkaI18nManager中
		this.#global = this.registerToManager() 
        this.#t = translate.bind(this)
	}	
	get id() {return this.#options.id;}                                     // 作用域唯一id	
	get debug() {return this.#options.debug;}                               // 调试开关	
    get defaultLanguage() {return this.#global.defaultLanguage;}            // 默认语言名称	
	get activeLanguage() {return this.#global.activeLanguage;}              // 默认语言名称	
    // 默认语言包，只能静态语言包，不能是动态语言包
	get default() {return this.#options.messages[this.#defaultLanguage] as VoerkaI18nLanguageMessages;}     
    get current() {return this.#currentMessages;}                           // 当前语言包   	
	get messages() {return this.#options.messages;	}                       // 所有语言包	
	get idMap() {return this.#options.idMap;}                               // 消息id映射列表	
	get languages() {return this.#options.languages;}                       // 当前作用域支持的语言列表[{name,title,fallback}]	
	get global() {	return this.#global;}                                   // 引用全局VoerkaI18n配置，注册后自动引用    
	get formatters() {	return this.#formatterRegistry!;}                   // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
	get activeFormatters() {return this.#formatterRegistry!.formatters}     // 当前作用域激活的格式化器定义 {$types,$config,[格式化器名称]: ()                       = >{},[格式化器名称]: ()          = >{}}   
    get t(){return this.#t}      
    /**
     * 对输入的语言配置进行处理
     * - 将en配置为默认回退语言
     * - 确保提供了有效的默认语言和活动语言
     */
    private init(){
        // 1. 检测语言配置列表是否有效
        if(!Array.isArray(this.languages)){
            console.warn("[VoerkaI18n] invalid languages config,use default languages config instead.")
            this.#options.languages =Object.assign([],DefaultLanguageSettings)
        }else{
            if(this.languages.length==0){
                throw new Error("[VoerkaI18n] invalid languages config, languages must not be empty.")
            }
        }        
        // 2.为语言配置默认回退语言，并且提取默认语言和活动语言
        this.languages.forEach(language=>{
            if(!language.fallback) language.fallback = DefaultFallbackLanguage
            if(language.default) this.#defaultLanguage = language.name
            if(language.active) this.#activeLanguage = language.name
        })
        // 3. 确保提供了有效的默认语言和活动语言
        const lanMessages = this.#options.messages
        if(!(this.#defaultLanguage in lanMessages)) this.#defaultLanguage = Object.keys(lanMessages)[0]
        if(!(this.#activeLanguage in lanMessages)) this.#activeLanguage = this.#defaultLanguage 
        if(!(this.#defaultLanguage in lanMessages)){
            throw new Error("[VoerkaI18n] invalid <defaultLanguage> config, messages not specified.")
        }
        // 初始化时，默认和激活的语言包只能是静态语言包，不能是动态语言包
        // 因为初始化时激活语言需要马上显示，如果是异步语言包，会导致显示延迟
        if(isFunction(this.messages[this.#defaultLanguage])){
            throw new Error("[VoerkaI18n] invalid <defaultLanguage> config, messages must be static.")
        }
        this.#currentMessages = this.messages[this.#activeLanguage] as VoerkaI18nLanguageMessages
        
        // 初始化格式化器
        this.loadInitialFormatters()
    }
    /**
     * 注册当前作用域到全局作用域
     * @param callback 
     */
    private registerToManager(callback?:(e?:Error)=>void){
		// 如果不存在全局VoerkaI18n实例，说明当前Scope是唯一或第一个加载的作用域，则自动创建全局VoerkaI18n实例
		if (!globalThis.VoerkaI18n) {
			globalThis.VoerkaI18n = new VoerkaI18nManager({
				debug          : this.debug,
				defaultLanguage: this.#defaultLanguage,
				activeLanguage : this.#activeLanguage,
				languages      : this.#options.languages,
			});
		}     
        this.#global = globalThis.VoerkaI18n as unknown as VoerkaI18nManager;
        if (!isFunction(callback)) callback = () => {};
        this.#global.register(this)
            .then(this.onRegisterSuccess.bind(this))
            .catch(this.onRegisterFail.bind(this))
        return this.#global
    } 
    /**
     * 当注册到Manager后，执行注册后的操作
     */
    private onRegisterSuccess(){
        if(typeof(this.#options.ready)=='function'){
            this.#options.ready.call(this)
        }
        // 从本地缓存中读取并合并补丁语言包
        this._mergePatchedMessages();  
        // 延后执行补丁命令，该命令会向远程下载补丁包
        this._patch(this.#currentMessages, this.activeLanguage);        
    }
    /**
     * 当注册到Manager失败时，执行注册失败后的操作
     */
    private onRegisterFail(e:any){
        if(typeof(this.#options.ready)=='function'){
            this.#options.ready.call(this,e)
        }
    }
	/**
     * 注册格式化器
     * 
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatter(name,value=>{...})                                 // 注册到所有语言
     * registerFormatter(name,value=>{...},{langauge:"zh"})                 // 注册到zh语言
     * registerFormatter(name,value=>{...},{langauge:"en"})                 // 注册到en语言 
       registerFormatter("Date",value=>{...},{langauge:"en"})               // 注册到en语言的默认数据类型格式化器
       registerFormatter(name,value=>{...},{langauge:["zh","cht"]})         // 注册到zh和cht语言
       registerFormatter(name,value=>{...},{langauge:"zh,cht"})
     * @param {*} formatter            格式化器
        language : 字符串或数组，声明该格式化器适用语言
           *代表适用于所有语言
           语言名称，语言名称数组，或者使用,分割的语言名称字符串
        asGlobal : 注册到全局
     */
	registerFormatter(name:string, formatter:VoerkaI18nFormatter, options?:{ language?:  string | string[] | "*", asGlobal?:boolean } ) {
        const {language = "*", asGlobal= true} = options || {} 
		if(asGlobal){
            this.global.registerFormatter(name, formatter, {language});
        }else{
            this.formatters!.register(name, formatter, {language});
        }
	}
    // /**
    //  * 注册多种语言的格式化器
    //  *  '*': 代表适用于所有语言
    //  * registerFormatters({"*":{...},zh:{...},en:VoerkaI18nFormatters})
    //  *  registerFormatters({"*":{...},zh:{...},en:{...}},true) 在全局注册
    //  * @param {*} langformatters ={"*":{...},zh:{...},en:{...}}
    //  * @returns 
    //  */
    // registerFormatters(langformatters:VoerkaI18nLanguageFormatters,asGlobal=false) {
    //     Object.entries(langformatters).forEach(([langName,formatters])=>{
    //         if(isPlainObject(formatters)){
    //             this.#options.formatters[langName] = formatters
    //         }           
    //     }) 
    // }
    /**
     * 初始化格式化器
     * 激活和默认语言的格式化器采用静态导入的形式，而没有采用异步块的形式，这是为了确保首次加载时的能马上读取，而不能采用延迟加载方式
     * #activeFormatters={
     *      global:{...} // 或true代表注册到全局
     *      $config:{...},
     *      $types:{...},
     *      [格式化器名称]:()=>{...},
     *      [格式化器名称]:()=>{...},
     *      ...
     * }
     */
    private loadInitialFormatters(){          
        this.#formatterRegistry= new VoerkaI18nFormatterRegistry(this)
        // 初始化格式化器
        this.formatters.loadInitials(this.#options.formatters)
        // 保存到Registry中，就可以从options中删除了
        delete (this.#options as any).formatters
    }
	/**
	 * 注册默认文本信息加载器
	 * @param {Function} 必须是异步函数或者是返回Promise
	 */
	registerDefaultLoader(fn:VoerkaI18nDefaultMessageLoader) {
		this.global.registerDefaultLoader(fn);
	}
	/**
	 * 获取指定语言信息
	 * @param {*} language
	 * @returns
	 */
	getLanguage(language:string):VoerkaI18nLanguageDefine | undefined{
		let index = this.languages.findIndex((lng) => lng.name == language);
		if (index !== -1) return this.languages[index];
	}
	/**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(language:string) {
		return this.languages.indexOf((lang:VoerkaI18nLanguageDefine) => lang.name == language) !== -1;
	}
	/**
	 * 回退到默认语言
	 */
	private fallbackToDefault() {
		this.#currentMessages = this.default;
		this.#activeLanguage = this.#defaultLanguage;
	}
    /**
     * 
     * 加载指定语言的语言包
     * 
     *   - 简单的对象{}
     *   - 或者是一个返回Promise<VoerkaI18nLanguageMessages>的异步函数
     *   - 或者是全局的默认加载器 
     * 
     * @param language 语言名称
     * @returns 
     */
    private async loadLanguageMessages(language:string):Promise<VoerkaI18nLanguageMessages>{
        // if(!this.hasLanguage(language)) throw new InvalidLanguageError(`Not found language <${language}>`)
        // 非默认语言可以是：语言包对象，也可以是一个异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		let loader = this.messages[language];
        let messages:VoerkaI18nLanguageMessages = {}
        if (isPlainObject(loader)) {                // 静态语言包
            messages = loader as unknown as VoerkaI18nLanguageMessages;
        } else if (isFunction(loader)) {            // 语言包异步chunk
            messages = (await (loader as VoerkaI18nMessageLoader))().default;
        } else if (isFunction(this.global.defaultMessageLoader)) { 
            // 从远程加载语言包:如果该语言没有指定加载器，则使用全局配置的默认加载器
            const loadedMessages = (await this.global.loadMessagesFromDefaultLoader(language,this)) as unknown as VoerkaI18nDynamicLanguageMessages;
            if(isPlainObject(loadedMessages)){
                // 需要保存动态语言包中的$config，合并到对应语言的格式化器配置
                if(isPlainObject(loadedMessages.$config)){           
                    this.formatters.updateConfig(language,loadedMessages.$config!) 
                    delete loadedMessages.$config
                }
                messages = Object.assign({
                    $remote : true          // 添加一个标识，表示该语言包是从远程加载的
                },this.default,loadedMessages); // 合并默认语言包和动态语言包,这样就可以局部覆盖默认语言包
            }
        }else{
            throw new Error(`Not found loader for language <${language}>`)
        }
        return messages
    }
	/**
	 * 刷新当前语言包
	 * @param {*} newLanguage
	 */
	async refresh(newLanguage?:string) {
		this.#refreshing = true;
		if (!newLanguage) newLanguage = this.activeLanguage;
		// 默认语言：由于默认语言采用静态加载方式而不是异步块,因此只需要简单的替换即可
		if (newLanguage === this.defaultLanguage) {
			this.#currentMessages = this.default;
			await this._patch(this.#currentMessages, newLanguage); // 异步补丁
			await this.formatters.change(newLanguage);
            this.#refreshing = false
			return;
		}else{ // 非默认语言可以是静态语言包也可以是异步加载语言包
            try{
                let messages = await this.loadLanguageMessages(newLanguage)
                if(messages){
                    this.#currentMessages = messages
                    this.#activeLanguage = newLanguage;       
                    // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了
                    // 因为远程加载的语言包已经是补丁过的了
                    if(!messages.$remote) {
                        await this._patch(this.#currentMessages, newLanguage);                    
                    }
                    // 切换到对应语言的格式化器
                    await this.formatters.change(newLanguage);        
                }else{
                    this.fallbackToDefault();
                }
            }catch(e:any){
                if (this.debug) console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`);
                this.fallbackToDefault();
            } finally {
                this.#refreshing = false;
            }  
        } 
	}
	/**
	 * 当指定了默认语言包加载器后，会从服务加载语言补丁包来更新本地的语言包
	 *
	 * 补丁包会自动存储到本地的LocalStorage中
	 *
	 * @param {*} messages
	 * @param {*} newLanguage
	 * @returns
	 */
	private async _patch(messages:VoerkaI18nLanguageMessages, newLanguage:string) {
		if (!isFunction(this.global.loadMessagesFromDefaultLoader)) return;
		try {
			let pachedMessages = (await this.global.loadMessagesFromDefaultLoader(newLanguage,this)) as unknown as VoerkaI18nLanguageMessages;
			if (isPlainObject(pachedMessages)) {
				Object.assign(messages, pachedMessages);
				this._savePatchedMessages(pachedMessages, newLanguage);
			}
		} catch (e:any) {
			if (this.debug) console.error(`Error while loading <${newLanguage}> patch messages from remote:`,e.message);
		}
	}
	/**
	 * 从本地存储中读取语言包补丁合并到当前语言包中
	 */
	private _mergePatchedMessages() {
		let patchedMessages = this._getPatchedMessages(this.activeLanguage);
		if (isPlainObject(patchedMessages)) {
			Object.assign(this.#options.messages, patchedMessages);
		}
	}
	/**
	 * 将读取的补丁包保存到本地的LocalStorage中
	 *
	 * 为什么要保存到本地的LocalStorage中？
	 *
	 * 因为默认语言是静态嵌入到源码中的，而加载语言包补丁是延后异步的，
	 * 当应用启动第一次就会渲染出来的是没有打过补丁的内容。
	 *
	 * - 如果还需要等待从服务器加载语言补丁合并后再渲染会影响速度
	 * - 如果不等待从服务器加载语言补丁就渲染，则会先显示未打补丁的内容，然后在打完补丁后再对应用进行重新渲染生效
	 *   这明显不是个好的方式
	 *
	 * 因此，采用的方式是：
	 * - 加载语言包补丁后，将之保存到到本地的LocalStorage中
	 * - 当应用加载时会查询是否存在补丁，如果存在就会合并渲染
	 *
	 * @param {*} messages
	 */
	private _savePatchedMessages(messages:VoerkaI18nLanguageMessages, language:string) {
		try {
			if (globalThis.localStorage) {
				globalThis.localStorage.setItem(`voerkai18n_${this.id}_${language}_patched_messages`,JSON.stringify(messages));
			}
		} catch (e:any) {
			if (this.debug)	console.error("Error while save voerkai18n patched messages:",e);
		}
	}
	/**
	 * 从本地缓存中读取补丁语言包
	 * @param {*} language
	 * @returns
	 */
	private _getPatchedMessages(language:string) {
		try {
			return JSON.parse((localStorage as any).getItem(`voerkai18n_${this.id}_${language}_patched_messages`));
		} catch (e) {
			return {};
		}
	}
	// 以下方法引用全局VoerkaI18n实例的方法
	on(callback:Function) {return this.#global.on(callback);	}
    once(callback:Function) {return this.#global.once(callback);	}
	off(callback:Function) {return this.#global.off(callback); }
	offAll() {return this.#global.offAll();}

	async change(language:string) {
        await this.#global.change(language);
    }
};
