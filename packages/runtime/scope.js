const { isPlainObject, isFunction, getByPath, deepMixin,deepClone } = require("./utils");

const DataTypes = [
	"String",
	"Number",
	"Boolean",
	"Object",
	"Array",
	"Function",
	"Null",
	"Undefined",
	"Symbol",
	"Date",
	"RegExp",
	"Error",
];

module.exports = class i18nScope {
	constructor(options = {}, callback) {
		this._id              = options.id || Date.now().toString() + parseInt(Math.random() * 1000);
		this._debug           = options.debug == undefined ? process && process.env && process.env.NODE_ENV === "development" : options.debug; 		// 当出错时是否在控制台台输出错误信息
		this._languages       = options.languages;                          // 当前作用域支持的语言列表
		this._defaultLanguage = options.defaultLanguage || "zh";            // 默认语言名称
		this._activeLanguage  = options.activeLanguage;                     // 当前语言名称
		this._default         = options.default;                            // 默认语言包
		this._messages        = options.messages;                           // 当前语言包
		this._idMap           = options.idMap;                              // 消息id映射列表
		this._formatters      = options.formatters;                         // 当前作用域的格式化函数列表{<lang>: {$types,$config,[格式化器名称]: () => {},[格式化器名称]: () => {}}}
		this._loaders         = options.loaders;                            // 异步加载语言文件的函数列表
		this._global          = null;                                       // 引用全局VoerkaI18n配置，注册后自动引用
		this._patchMessages   = {};                                         // 语言包补丁信息{<language>: {....},<language>:{....}}
		this._refreshing      = false;		                                // 正在加载语言包标识
        // 用来缓存格式化器的引用，当使用格式化器时可以直接引用，减少检索遍历
		this.$cache = {
			activeLanguage : null,
			typedFormatters: {},
			formatters     : {},
		};
		// 如果不存在全局VoerkaI18n实例，说明当前Scope是唯一或第一个加载的作用域，则自动创建全局VoerkaI18n实例
		if (!globalThis.VoerkaI18n) {
			const { I18nManager } = require("./");
			globalThis.VoerkaI18n = new I18nManager({
				debug          : this._debug,
				defaultLanguage: this._defaultLanguage,
				activeLanguage : this._activeLanguage,
				languages      : options.languages,
			});
		}
		this._global = globalThis.VoerkaI18n;        
        this._initFormatters(this.activeLanguage)                       // 初始化活动的格式化器        
		this._mergePatchedMessages();                                   // 从本地缓存中读取并合并补丁语言包
		this._patch(this._messages, this.activeLanguage);               // 延后执行补丁命令，该命令会向远程下载补丁包
		this.register(callback);		                                // 在全局注册作用域
	}	
	get id() {return this._id;}                                         // 作用域唯一id	
	get debug() {return this._debug;}                                   // 调试开关	
    get defaultLanguage() {return this._defaultLanguage;}               // 默认语言名称	
	get activeLanguage() {return this._global.activeLanguage;}                 // 默认语言名称	
	get default() {return this._default;}                               // 默认语言包	
	get messages() {return this._messages;	}                           // 当前语言包	
	get idMap() {return this._idMap;}                                   // 消息id映射列表	
	get languages() {return this._languages;}                           // 当前作用域支持的语言列表[{name,title,fallback}]	
	get loaders() {	return this._loaders;}                              // 异步加载语言文件的函数列表	
	get global() {	return this._global;}                               // 引用全局VoerkaI18n配置，注册后自动引用    
	get formatters() {	return this._formatters;}                       // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
	get activeFormatters() {return this._activeFormatters}              // 当前作用域激活的格式化器定义 {$types,$config,[格式化器名称]: ()                       = >{},[格式化器名称]: ()          = >{}}   
    get activeFormatterConfig(){return this._activeFormatterConfig}     // 当前格式化器合并后的配置参数，参数已经合并了全局格式化器中的参数

	/**
	 * 在全局注册作用域当前作用域
	 * @param {*} callback   注册成功后的回调
	 */
	register(callback) {
		if (!isFunction(callback)) callback = () => {};
		this.global.register(this).then(callback).catch(callback);
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
	registerFormatter(name, formatter, { language = "*", global : asGlobal } = {}) {
		if (!isFunction(formatter) || typeof name !== "string") {
			throw new TypeError("Formatter must be a function");
		}
		language = Array.isArray(language)
			? language
			: language
			? language.split(",")
			: [];
		if (asGlobal) {
			this.global.registerFormatter(name, formatter, { language });
		} else {
			language.forEach((lng) => {
				if (DataTypes.includes(name)) {
					this._formatters[lng].$types[name] = formatter;
				} else {
					this._formatters[lng][name] = formatter;
				}
			});
		}
	}
    /**
     * 注册多种格式化器
     * registerFormatters(={"*",zh:{...},en:{...}})
     *  registerFormatters(={"*",zh:{...},en:{...}},true) 在全局注册
     * @param {*} formatters ={"*",zh:{...},en:{...}}
     * @returns 
     */
    registerFormatters(formatters,asGlobal=false) {
        Object.entries(formatters).forEach(([language,fns])=>{
            Object.entries(fns).forEach(([name,formatter])=>{
                this.registerFormatter(name,formatter,{language,global:asGlobal})
            })            
        }) 
    }
	/**
	 * 注册默认文本信息加载器
	 * @param {Function} 必须是异步函数或者是返回Promise
	 */
	registerDefaultLoader(fn) {
		this.global.registerDefaultLoader(fn);
	}
	/**
	 * 获取指定语言信息
	 * @param {*} language
	 * @returns
	 */
	getLanguage(language) {
		let index = this._languages.findIndex((lng) => lng.name == language);
		if (index !== -1) return this._languages[index];
	}
	/**
	 * 返回是否存在指定的语言
	 * @param {*} language 语言名称
	 * @returns
	 */
	hasLanguage(language) {
		return this._languages.indexOf((lang) => lang.name == language) !== -1;
	}
	/**
	 * 回退到默认语言
	 */
	_fallback() {
		this._messages = this._default;
		this._activeLanguage = this.defaultLanguage;
	}
    /**
     * 初始化格式化器
     * 激活和默认语言的格式化器采用静态导入的形式，而没有采用异步块的形式，这是为了确保首次加载时的能马上读取，而不能采用延迟加载方式
     * _activeFormatters={$config:{...},$types:{...},[格式化器名称]:()=>{...},[格式化器名称]:()=>{...},...}}
     */
    _initFormatters(newLanguage){
        this._activeFormatters = {}
		try {
			if (newLanguage in this._formatters) {
				this._activeFormatters = this._formatters[newLanguage];
			} else {
				if (this._debug) console.warn(`Not initialize <${newLanguage}> formatters.`);
			}
            this._generateFormatterConfig(newLanguage)
		} catch (e) {
			if (this._debug) console.error(`Error while initialize ${newLanguage} formatters: ${e.message}`);
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
	async _changeFormatters(newLanguage) {
		try {
			if (newLanguage in this._formatters) {
				let loader = this._formatters[newLanguage];
				if (isPlainObject(loader)) {
					this._activeFormatters = loader;
				} else if (isFunction(loader)) {
					this._activeFormatters = (await loader()).default;
				}
                // 合并生成格式化器的配置参数,当执行格式化器时该参数将被传递给格式化器
                this._generateFormatterConfig(newLanguage)
			} else {
				if (this._debug) console.warn(`Not configured <${newLanguage}> formatters.`);
			}
		} catch (e) {
			if (this._debug) console.error(`Error loading ${newLanguage} formatters: ${e.message}`);
		}
	}
    /**
     * 生成格式化器的配置参数，该参数由以下合并而成：
     *  - global.formatters[*].$config
     *  - global.formatters[language].$config
     *  - scope.activeFormatters.$config   当前优先
     */
    _generateFormatterConfig(language){
        let options 
        try{
            options = deepClone(getByPath(this._global.formatters,`*.$config`,{}))
            deepMixin(options,getByPath(this._global.formatters,`${language}.$config`,{}))
            deepMixin(options,getByPath(this._activeFormatters,"$config",{}))
        }catch(e){
            if(this.debug) console.error(`Error while generate <${language}> formatter options: `,e)
            if(!options) options = this._activeFormatters.$config || {}
        }        
        return this._activeFormatterConfig = options
    }
	/**
	 * 刷新当前语言包
	 * @param {*} newLanguage
	 */
	async refresh(newLanguage) {
		this._refreshing = true;
		if (!newLanguage) newLanguage = this.activeLanguage;
		// 默认语言：由于默认语言采用静态加载方式而不是异步块,因此只需要简单的替换即可
		if (newLanguage === this.defaultLanguage) {
			this._messages = this._default;
			await this._patch(this._messages, newLanguage); // 异步补丁
			await this._changeFormatters(newLanguage);
			return;
		}
		// 非默认语言需要异步加载语言包文件,加载器是一个异步函数
		// 如果没有加载器，则无法加载语言包，因此回退到默认语言
		let loader = this.loaders[newLanguage];
		try {
            let newMessages, useRemote =false;
			if (isPlainObject(loader)) {                // 静态语言包
				newMessages = loader;
			} else if (isFunction(loader)) {            // 语言包异步chunk
				newMessages = (await loader()).default;
			} else if (isFunction(this.global.defaultMessageLoader)) { // 从远程加载语言包:如果该语言没有指定加载器，则使用全局配置的默认加载器
				const loadedMessages = await this.global.loadMessagesFromDefaultLoader(newLanguage,this);                
                if(isPlainObject(loadedMessages)){
                    useRemote = true
                    // 需要保存动态语言包中的$config，合并到对应语言的格式化器配置
                    if(isPlainObject(loadedMessages.$config)){                        
                        this._formatters[newLanguage] = {
                            $config  : loadedMessages.$config
                        }
                        delete loadedMessages.$config
                    }
                    newMessages = Object.assign({},this._default,loadedMessages);
                }
			} 
            if(newMessages){
                this._messages = newMessages
                this._activeLanguage = newLanguage;       
                // 打语言包补丁, 如果是从远程加载语言包则不需要再打补丁了
                if(!useRemote) {
                    await this._patch(this._messages, newLanguage);                    
                }
                // 切换到对应语言的格式化器
			    await this._changeFormatters(newLanguage);        
            }else{
                this._fallback();
            }

		} catch (e) {
			if (this._debug) console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`);
			this._fallback();
		} finally {
			this._refreshing = false;
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
	async _patch(messages, newLanguage) {
		if (!isFunction(this.global.loadMessagesFromDefaultLoader)) return;
		try {
			let pachedMessages = await this.global.loadMessagesFromDefaultLoader(newLanguage,this);
			if (isPlainObject(pachedMessages)) {
				Object.assign(messages, pachedMessages);
				this._savePatchedMessages(pachedMessages, newLanguage);
			}
		} catch (e) {
			if (this._debug) console.error(`Error while loading <${newLanguage}> patch messages from remote:`,e);
		}
	}
	/**
	 * 从本地存储中读取语言包补丁合并到当前语言包中
	 */
	_mergePatchedMessages() {
		let patchedMessages = this._getPatchedMessages(this.activeLanguage);
		if (isPlainObject(patchedMessages)) {
			Object.assign(this._messages, patchedMessages);
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
	_savePatchedMessages(messages, language) {
		try {
			if (globalThis.localStorage) {
				globalThis.localStorage.setItem(`voerkai18n_${this.id}_${language}_patched_messages`,JSON.stringify(messages));
			}
		} catch (e) {
			if (this.$cache._debug)	console.error("Error while save voerkai18n patched messages:",e);
		}
	}
	/**
	 * 从本地缓存中读取补丁语言包
	 * @param {*} language
	 * @returns
	 */
	_getPatchedMessages(language) {
		try {
			return JSON.parse(localStorage.getItem(`voerkai18n_${this.id}_${language}_patched_messages`));
		} catch (e) {
			return {};
		}
	}
	// 以下方法引用全局VoerkaI18n实例的方法
	on() {return this._global.on(...arguments);	}
	off() {return this._global.off(...arguments); }
	offAll() {return this._global.offAll(...arguments);}
	async change(language) {
        await this._global.change(language);
    }
};
