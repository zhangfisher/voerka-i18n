import { DataTypes } from "./utils"
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isFunction } from "flex-tools/typecheck/isFunction"
import { deepClone } from "flex-tools/object/deepClone"
import { get as getByPath } from "flex-tools/object/get"
import { translate } from "./translate"
import { deepMerge } from "flex-tools/object/deepMerge"
import { assignObject } from "flex-tools/object/assignObject"
import type {VoerkaI18nManager } from "./manager"
import type { 
    VoerkaI18nFormatterConfigs,
    VoerkaI18nDefaultMessageLoader,
    VoerkaI18nFormatter,
    VoerkaI18nLanguageFormatters, 
    Voerkai18nIdMap, 
    VoerkaI18nLanguageDefine, 
    VoerkaI18nLanguageMessages, 
    VoerkaI18nLanguagePack, 
    VoerkaI18nScopeCache, 
    VoerkaI18nTranslate, 
    VoerkaI18nLoaders, 
    VoerkaI18nTypesFormatters,
    VoerkaI18nFormatters,
    VoerkaI18nDynamicLanguageMessages,
} from "./types" 
import { VoerkaI18nFormatterRegistry } from './formatterRegistry';
import { InvalidLanguageError } from "./errors"

export interface VoerkaI18nScopeOptions {
    id?: string
    debug?: boolean
    languages: VoerkaI18nLanguageDefine[]                              // 当前作用域支持的语言列表
    defaultLanguage: string                                      // 默认语言名称                         
    activeLanguage: string                                       // 当前语言名称
    default: VoerkaI18nLanguageMessages                          // 默认语言包
    messages: VoerkaI18nLanguageMessages                         // 当前语言包
    idMap: Voerkai18nIdMap                                       // 消息id映射列表
    formatters: VoerkaI18nLanguageFormatters           // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
    loaders: VoerkaI18nLoaders;                                  // 异步加载语言文件的函数列表
}

export class VoerkaI18nScope {
    #options:Required<VoerkaI18nScopeOptions>
    #global:VoerkaI18nManager                   // 引用全局VoerkaI18nManager配置，注册后自动引用
    #refreshing:boolean = false
    #patchMessages:VoerkaI18nLanguagePack = {}
    #t:VoerkaI18nTranslate
    #activeFormatters:VoerkaI18nFormatters = {}
    #activeFormatterConfig: VoerkaI18nFormatterConfigs={}
    #cache:VoerkaI18nScopeCache  
    #messages:VoerkaI18nLanguageMessages = {}
    #formatterRegistry:VoerkaI18nFormatterRegistry
	constructor(options:VoerkaI18nScopeOptions, callback:(e?:Error)=>void) {
        this.#options = assignObject({
            id             : Date.now().toString() + parseInt(String(Math.random() * 1000)),
            debug          : false,
            languages      : {},                          // 当前作用域支持的语言列表
            defaultLanguage: "zh",            // 默认语言名称
            activeLanguage : "zh",                     // 当前语言名称
            default        : {},                            // 默认语言包
            messages       : {},                          // 当前语言包
            idMap          : {},                              // 消息id映射列表
            formatters     : {},                         // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
            loaders        : {}                            // 异步加载语言文件的函数列表
        },options) as Required<VoerkaI18nScopeOptions>
		
		this.#patchMessages   = {};                                         // 语言包补丁信息{<language>: {....},<language>:{....}}
		this.#refreshing      = false;		                                // 正在加载语言包标识
        // 用来缓存格式化器的引用，当使用格式化器时可以直接引用，减少检索遍历
		this.#cache = {
			activeLanguage : this.#options.activeLanguage,
			typedFormatters: {},
			formatters     : {},
		};
        this._initiLanguages()
		// 如果不存在全局VoerkaI18n实例，说明当前Scope是唯一或第一个加载的作用域，则自动创建全局VoerkaI18n实例
		if (!globalThis.VoerkaI18n) {
			const { VoerkaI18nManager } = require("./");
			globalThis.VoerkaI18n = new VoerkaI18nManager({
				debug          : this.debug,
				defaultLanguage: this.defaultLanguage,
				activeLanguage : this.activeLanguage,
				languages      : options.languages,
			});
		}
        this.#t = translate.bind(this)
		this.#global = globalThis.VoerkaI18n as unknown as VoerkaI18nManager;      
        this.#formatterRegistry = new VoerkaI18nFormatterRegistry()  
        this.loadFormatters(this.activeLanguage)                       // 初始化活动的格式化器        
		this._mergePatchedMessages();                                   // 从本地缓存中读取并合并补丁语言包
		this._patch(this.messages, this.activeLanguage);                // 延后执行补丁命令，该命令会向远程下载补丁包
		this.register(callback);		                                // 在全局注册作用域
	}	
	get id() {return this.#options.id;}                                 // 作用域唯一id	
	get debug() {return this.#options.debug;}                           // 调试开关	
    get defaultLanguage() {return this.#options.defaultLanguage;}       // 默认语言名称	
	get activeLanguage() {return this.#global.activeLanguage;}          // 默认语言名称	
	get default() {return this.#options.default;}                       // 默认语言包	
	get messages() {return this.#options.messages;	}                   // 当前语言包	
	get idMap() {return this.#options.idMap;}                           // 消息id映射列表	
	get languages() {return this.#options.languages;}                   // 当前作用域支持的语言列表[{name,title,fallback}]	
	get loaders() {	return this.#options.loaders;}                      // 异步加载语言文件的函数列表	
	get global() {	return this.#global;}                               // 引用全局VoerkaI18n配置，注册后自动引用    
	get formatters() {	return this.#formatterRegistry;}               // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
	get activeFormatters() {return this.#formatterRegistry.formatters}     // 当前作用域激活的格式化器定义 {$types,$config,[格式化器名称]: ()                       = >{},[格式化器名称]: ()          = >{}}   
    get activeFormatterConfig(){return this.#activeFormatterConfig}     // 当前格式化器合并后的配置参数，参数已经合并了全局格式化器中的参数
    get cache(){return this.#cache }
    set cache(value:VoerkaI18nScopeCache){ this.#cache=value }
    get translate(){return this.#t}  
    get t(){return this.#t}  

    /**
     * 对输入的语言配置进行处理
     * - 将en配置为默认回退语言
     */
    _initiLanguages(){
        if(!Array.isArray(this.languages)){
            console.warn("[VoerkaI18n] invalid languages config,use default languages config instead.")
            this.#options.languages = [
                {name: "zh",title: "中文"},
                {name: "en",title: "英文"}
            ]
        }        
        // 将en配置为默认回退语言
        this.languages.forEach(language=>{
            if(!language.fallback) language.fallback = "en"
        })
    }

	/**
	 * 在全局注册作用域当前作用域
	 * @param {*} callback   注册成功后的回调
	 */
	register(callback:(e?:Error)=>void) {
		if (!isFunction(callback)) callback = () => {};
		this.global.register(this).then(()=>callback()).catch((e)=>callback(e));
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
	registerFormatter(name:string, formatter:VoerkaI18nFormatter, {language = "*", asGlobal= true}:{ language:  string | string[] | "*", asGlobal :boolean } ) {
		if(asGlobal){
            this.global.registerFormatter(name, formatter, {language});
        }else{
            this.#formatterRegistry.register(name, formatter, {language});
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
     private loadFormatters(newLanguage:string){
        this.#formatterRegistry.language = newLanguage        
        // 初始化格式化器
        this.formatters.loadInitials(this.#options.formatters)
        if(this.#options.formatters)
        // 将配置中的指定为全局的格式化器注册到全局
        Object.entries(this.#options.formatters).forEach(([langName,formatters])=>{
            if(typeof(formatters)=='function'){
                this.#formatterRegistry.registerLanguageFormatters(langName,formatters)
            }else if(isPlainObject(formatters.global)){
                if(formatters.global===true){                    
                    this.#formatterRegistry.registerLanguageFormatters(langName,formatters)
                }else if(isPlainObject(formatters.global)){
                    this.global.formatters.registerLanguageFormatters(langName,formatters.global as VoerkaI18nFormatters)                    
                }
                delete formatters.global
            }            
        })        
        // 保存到Registry中，就可以从options中删除了
        delete (this.#options as any).formatters
        // 初始化格式化器        
		try {
			if (this.formatters.hasLanguage(newLanguage)) {   
                
			} else {
				if (this.debug) console.warn(`Not initialize <${newLanguage}> formatters.`);
			}
            this._generateFormatterConfig(newLanguage)
		} catch (e:any) {
			if (this.debug) console.error(`Error while initialize ${newLanguage} formatters: ${e.message}`);
		}
    }

	/**
	 * 
     * 切换到对应语言的格式化器
     * 
     * 当切换语言时，格式化器应该切换到对应语言的格式化器
     * 
     * 重要需要处理：
     *   $config参数采用合并继承机制,从全局读取
     * 
     * 
	 * @param {*} language
	 */
	async _changeFormatters(newLanguage:string) {
		try {            
			if (this.formatters.hasLanguage(newLanguage)) {
				this.formatters.language = newLanguage
                // 如果该语言的格式化器集合是异步加载，需要等待加载完成
                await this.formatters.load()                
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this._generateFormatterConfig(newLanguage)
			} else {
				if (this.debug) console.warn(`Not configured <${newLanguage}> formatters.`);
			}
		} catch (e:any) {
			if (this.debug) console.error(`Error loading ${newLanguage} formatters: ${e.message}`);
		}
	}
    /**
     *   生成格式化器的配置参数，该参数由以下合并而成：
     * 
     *  - global.formatters[*].$config
     *  - global.formatters[fallbackLanguage].$config
     *  - global.formatters[language].$config
     *  - this.formatters[*].$config
     *  - this.formatters[fallbackLanguage].$config
     *  - this.formatters[language].$config
     */
    _generateFormatterConfig(language:string){
        try{
            const fallbackLanguage = this.getLanguage(language)?.fallback;
            let configSources = [         
                // 从全局读取
                this.#global.formatters.getConfig('*'),
                this.#global.formatters.getConfig(fallbackLanguage),
                this.#global.formatters.config,
                // 从当前Scope读取
                this.formatters.getConfig('*'),
                this.formatters.getConfig(fallbackLanguage),
                this.formatters.config
            ]
            return this.#activeFormatterConfig = configSources.reduce((finalConfig, curConfig)=>{
                if(isPlainObject(curConfig)) deepMerge(finalConfig,curConfig,{newObject:false,array:'replace'})
                return finalConfig
            },{})

        }catch(e){
            if(this.debug) console.error(`Error while generate <${language}> formatter options: `,e)
            return this.#activeFormatters.$config || {}
        }        
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
	private _fallback() {
		this.#options.messages = this.default;
		this.#options.activeLanguage = this.defaultLanguage;
	}
    /**
     *  语言信息包可以是:
     *   - 简单的对象{}
     *   - 或者是一个返回Promise<VoerkaI18nLanguageMessages>的异步函数
     *  
     * 
     * 
     * @param language 语言名称
     * @returns 
     */
    private async loadLanguageMessages(language:string):Promise<VoerkaI18nLanguageMessages>{
        if(!this.hasLanguage(language)) throw new InvalidLanguageError(`Not found language <${language}>`)
        // 非默认语言可以是：语言包对象，也可以是一个异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		let loader = this.loaders[language];
        let messages:VoerkaI18nLanguageMessages = {}
        if (isPlainObject(loader)) {                // 静态语言包
            messages = loader as unknown as VoerkaI18nLanguageMessages;
        } else if (isFunction(loader)) {            // 语言包异步chunk
            messages = (await loader()).default;
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
			this.#options.messages = this.default;
			await this._patch(this.#options.messages, newLanguage); // 异步补丁
			await this._changeFormatters(newLanguage);
            this.#refreshing = false
			return;
		}else{ // 非默认语言可以是静态语言包也可以是异步加载语言包
            try{
                let messages = await this.loadLanguageMessages(newLanguage)
                if(messages){
                    this.#options.messages = messages
                    this.#options.activeLanguage = newLanguage;       
                    // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了
                    // 因为远程加载的语言包已经是补丁过的了
                    if(!messages.$remote) {
                        await this._patch(this.#options.messages, newLanguage);                    
                    }
                    // 切换到对应语言的格式化器
                    await this._changeFormatters(newLanguage);        
                }else{
                    this._fallback();
                }
            }catch(e:any){
                if (this.debug) console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`);
                this._fallback();
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
	off(callback:Function) {return this.#global.off(callback); }
	offAll() {return this.#global.offAll();}
	async change(language:string) {
        await this.#global.change(language);
    }
};
