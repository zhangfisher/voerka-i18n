
module.exports = class i18nScope {
    constructor(options={},callback){
        // 每个作用域都有一个唯一的id
        this._id              = options.id || (new Date().getTime().toString()+parseInt(Math.random()*1000))
        this._languages       = options.languages                               // 当前作用域的语言列表
        this._defaultLanguage = options.defaultLanguage || "cn"                 // 默认语言名称
        this._activeLanguage  = options.activeLanguage                        // 当前语言名称
        this._default         = options.default                                 // 默认语言包
        this._messages        = options.messages                                // 当前语言包
        this._idMap           = options.idMap                                   // 消息id映射列表
        this._formatters      = options.formatters                              // 当前作用域的格式化函数列表
        this._loaders         = options.loaders                                 // 异步加载语言文件的函数列表
        this._global          = null                                            // 引用全局VoerkaI18n配置，注册后自动引用     
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
        this.global = globalThis.VoerkaI18n 
        // 正在加载语言包标识
        this._loading=false
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
    // 异步加载语言文件的函数列表
    get loaders(){return this._loaders}
    // 引用全局VoerkaI18n配置，注册后自动引用
    get global(){return this._global}
    set global(value){this._global = value}
    /**
     * 在全局注册作用域
     * @param {*} callback   当注册
     */
    register(callback){
        if(!typeof(callback)==="function") callback = ()=>{} 
        this.global.register(this).then(callback).catch(callback)    
    }
    registerFormatter(name,formatter,{language="*"}={}){
        if(!typeof(formatter)==="function" || typeof(name)!=="string"){
            throw new TypeError("Formatter must be a function")
        }        
        if(DataTypes.includes(name)){
            this.formatters[language].$types[name] = formatter
        }else{
            this.formatters[language][name] = formatter
        }
    }
    /**
     * 回退到默认语言
     */
    _fallback(){
        this._messages = this._default  
        this._activeLanguage = this.defaultLanguage
    }
    /**
     * 刷新当前语言包
     * @param {*} newLanguage 
     */
    async refresh(newLanguage){
        this._loading = Promise.resolve()
        if(!newLanguage) newLanguage = this.activeLanguage
        // 默认语言，默认语言采用静态加载方式，只需要简单的替换即可
        if(newLanguage === this.defaultLanguage){
            this._messages = this._default
            return 
        }
        // 非默认语言需要异步加载语言包文件,加载器是一个异步函数
        // 如果没有加载器，则无法加载语言包，因此回退到默认语言
        const loader = this.loaders[newLanguage]
        if(typeof(loader) === "function"){
            try{
                this._messages = (await loader()).default
                this._activeLanguage = newLanguage
            }catch(e){
                console.warn(`Error while loading language <${newLanguage}> on i18nScope(${this.id}): ${e.message}`)
                this._fallback()
            }       
        }else{
            this._fallback()
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