const { isPlainObject } = require("./utils")

const DataTypes = ["String","Number","Boolean","Object","Array","Function","Null","Undefined","Symbol","Date","RegExp","Error"];

module.exports = class i18nScope {
    constructor(options={},callback){
        // 每个作用域都有一个唯一的id
        this._id              = options.id || (new Date().getTime().toString()+parseInt(Math.random()*1000))
        this._languages       = options.languages                              // 当前作用域的语言列表
        this._defaultLanguage = options.defaultLanguage || "zh"                 // 默认语言名称
        this._activeLanguage  = options.activeLanguage                          // 当前语言名称
        this._default         = options.default                                 // 默认语言包
        this._messages        = options.messages                                // 当前语言包
        this._idMap           = options.idMap                                   // 消息id映射列表
        this._formatters      = options.formatters                              // 当前作用域的格式化函数列表
        this._loaders         = options.loaders                                 // 异步加载语言文件的函数列表
        this._global          = null                                            // 引用全局VoerkaI18n配置，注册后自动引用     
        this._patchMessages = {}                                                // 语言包补丁信息 {<language>:{....},<language>:{....}}
        // 主要用来缓存格式化器的引用，当使用格式化器时可以直接引用，避免检索
        this.$cache={
            activeLanguage : null,
            typedFormatters: {},
            formatters     : {},
        }
        // 如果不存在全局VoerkaI18n实例，说明当前Scope是唯一或第一个加载的作用域，
        // 则使用当前作用域来初始化全局VoerkaI18n实例
        if(!globalThis.VoerkaI18n){
            const { I18nManager } = require("./")
            globalThis.VoerkaI18n = new I18nManager({
                defaultLanguage: this.defaultLanguage,
                activeLanguage : this.activeLanguage,
                languages: options.languages,
            })
        }        
        this._global = globalThis.VoerkaI18n 
        this._mergePatchedMessages()
        this._patch(this._messages,this.activeLanguage) 
        // 正在加载语言包标识
        this._refreshing=false
        // 在全局注册作用域
        this.register(callback)
    }
    // 作用域
    get id(){return this._id}
    // 默认语言名称
    get defaultLanguage(){return this._defaultLanguage}
    // 默认语言名称
    get activeLanguage(){return this._activeLanguage}
    // 默认语言包
    get default(){return this._default}
    // 当前语言包
    get messages(){return this._messages}
    // 消息id映射列表
    get idMap(){return this._idMap}
    // 当前作用域的格式化函数列表
    get formatters(){return this._formatters}
    // 当前作用域支持的语言列表[{name,title,fallback}]
    get languages(){return this._languages}
    // 异步加载语言文件的函数列表
    get loaders(){return this._loaders}
    // 引用全局VoerkaI18n配置，注册后自动引用
    get global(){return this._global}
    /**
     * 在全局注册作用域
     * @param {*} callback   注册成功后的回调
     */
    register(callback){
        if(!typeof(callback)==="function") callback = ()=>{} 
        this.global.register(this).then(callback).catch(callback)    
    }
   /**
     * 注册格式化器
     * 格式化器是一个简单的同步函数value=>{...}，用来对输入进行格式化后返回结果
     * 
     * registerFormatters(name,value=>{...})                                 // 适用于所有语言
     * registerFormatters(name,value=>{...},{langauge:"zh"})                 // 适用于cn语言
     * registerFormatters(name,value=>{...},{langauge:"en"})                 // 适用于en语言 
     
     * @param {*} formatters 
        language : 声明该格式化器适用语言
        isGlobal : 注册到全局
     */
    registerFormatter(name,formatter,{language="*",isGlobal}={}){
        if(!typeof(formatter)==="function" || typeof(name)!=="string"){
            throw new TypeError("Formatter must be a function")
        }        
        if(isGlobal){
            this.global.registerFormatter(name,formatter,{language})
        }else{
            if(DataTypes.includes(name)){
                this.formatters[language].$types[name] = formatter
            }else{
                this.formatters[language][name] = formatter
            }
        }        
    }
    /**
     * 注册默认文本信息加载器
     * @param {Function} 必须是异步函数或者是返回Promise
     */
    registerDefaultLoader(fn){
        this.global.registerDefaultLoader(fn)
    }
    _getLanguage(lang){
        let index = this._languages.findIndex(lng=>lng.name==lang)
        if(index!==-1) return this._languages[index]
    }
    /**
     * 回退到默认语言
     */
    _fallback(newLanguage){
        this._messages = this._default  
        this._activeLanguage = this.defaultLanguage
    }
    /**
     * 刷新当前语言包
     * @param {*} newLanguage 
     */
    async refresh(newLanguage){
        this._refreshing = true
        if(!newLanguage) newLanguage = this.activeLanguage
        // 默认语言，默认语言采用静态加载方式，只需要简单的替换即可
        if(newLanguage === this.defaultLanguage){
            this._messages = this._default
            await this._patch(this._messages,newLanguage)    // 异步补丁
            return 
        }
        // 非默认语言需要异步加载语言包文件,加载器是一个异步函数
        // 如果没有加载器，则无法加载语言包，因此回退到默认语言
        let loader = this.loaders[newLanguage]
        try{
            if(typeof(loader) === "function"){
                this._messages  = (await loader()).default
                this._activeLanguage = newLanguage 
                await this._patch(this._messages,newLanguage)                   
            }else if(typeof(this.global.defaultMessageLoader) === "function"){// 如果该语言没有指定加载器，则使用全局配置的默认加载器
                const loadedMessages  = await this.global.loadMessagesFromDefaultLoader(newLanguage,this)
                this._messages  = Object.assign({},this._default,loadedMessages)
                this._activeLanguage = newLanguage
            }else{
                this._fallback()
            }
        }catch(e){
            console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`)
            this._fallback()
        }finally{
            this._refreshing = false
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
    async _patch(messages,newLanguage){
        if(typeof(this.global.loadMessagesFromDefaultLoader) !== 'function') return
        try{
            let pachedMessages =  await this.global.loadMessagesFromDefaultLoader(newLanguage,this)
            if(isPlainObject(pachedMessages)){
                Object.assign(messages,pachedMessages)
                this._savePatchedMessages(pachedMessages,newLanguage)
            }
        }catch{}
    }
    /**
     * 从本地存储中读取语言包补丁合并到当前语言包中
     */
    _mergePatchedMessages(){        
        let patchedMessages= this._getPatchedMessages(this.activeLanguage)
        if(isPlainObject(patchedMessages)){
            Object.assign(this._messages,patchedMessages)
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
     * - 
     * 
     * @param {*} messages 
     */
    _savePatchedMessages(messages,language){
        try{
            if(globalThis.localStorage){
                globalThis.localStorage.setItem(`voerkai18n_${this.id}_${language}_patched_messages`, JSON.stringify(messages));
            }
        }catch(e){
            console.error("Error while save voerkai18n patched messages:",e.message)
        }
    }
    _getPatchedMessages(language){
        try{
            return JSON.parse(localStorage.getItem(`voerkai18n_${this.id}_${language}_patched_messages`))
        }catch(e){
            return {}
        }
    }
    // 以下方法引用全局VoerkaI18n实例的方法
    get on(){return this.global.on.bind(this.global)}
    get off(){return this.global.off.bind(this.global)}
    get offAll(){return this.global.offAll.bind(this.global)}
    get change(){
        return this.global.change.bind(this.global)
    }
}