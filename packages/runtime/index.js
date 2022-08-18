const {createFormatter,Formatter,getDataTypeName,isNumber,isPlainObject,isFunction,isNothing,deepMerge,deepMixin} = require("./utils")
const {getInterpolatedVars,replaceInterpolatedVars} = require("./interpolate")
const EventEmitter = require("./eventemitter")
const inlineFormatters = require("./formatters")         
const i18nScope = require("./scope")
const { translate } = require("./translate")


const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"]
 
// 默认语言配置
const defaultLanguageSettings = {  
    debug          : true,
    defaultLanguage: "zh",
    activeLanguage : "zh",
    formatters     : inlineFormatters,
    languages      : [
        {name:"zh",title:"中文",default:true},
        {name:"en",title:"英文"}
    ]
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
 class I18nManager extends EventEmitter{
    constructor(settings={}){
        super()
        if(I18nManager.instance!=null){
            return I18nManager.instance;
        }
        I18nManager.instance = this;
        this._settings = deepMerge(defaultLanguageSettings,settings)
        this._scopes=[]                     // 保存i18nScope实例
        this._defaultMessageLoader = null   // 默认语言包加载器
    }
    get settings(){ return this._settings }                         // 配置参数
    get scopes(){ return this._scopes }                             // 注册的报有i18nScope实例q   
    get activeLanguage(){ return this._settings.activeLanguage}     // 当前激活语言    名称
    get defaultLanguage(){ return this._settings.defaultLanguage}   // 默认语言名称    
    get languages(){ return this._settings.languages}               // 支持的语言列表    
    get formatters(){ return this._settings.formatters }            // 内置格式化器{*:{$config,$types,...},zh:{$config,$types,...},en:{$config,$types,...}}
    get defaultMessageLoader(){ return this._defaultMessageLoader}  // 默认语言包加载器

    // 通过默认加载器加载文件
    async loadMessagesFromDefaultLoader(newLanguage,scope){
        if(!isFunction(this._defaultMessageLoader))  return //throw new Error("No default message loader specified")
        return  await this._defaultMessageLoader.call(scope,newLanguage,scope)        
    }
    /**
     *  切换语言
     */
    async change(language){
        if(this.languages.findIndex(lang=>lang.name === language)!==-1 || isFunction(this._defaultMessageLoader)){
            await this._refreshScopes(language)                        // 通知所有作用域刷新到对应的语言包
            this._settings.activeLanguage = language            
            await this.emit(language)                                  // 触发语言切换事件
        }else{
            throw new Error("Not supported language:"+language)
        }
    }
    /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
    async _refreshScopes(newLanguage){ 
        try{
            const scopeRefreshers = this._scopes.map(scope=>{
                return scope.refresh(newLanguage)
            })
            if(Promise.allSettled){
               await Promise.allSettled(scopeRefreshers)
            }else{
                await Promise.all(scopeRefreshers)
            } 
        }catch(e){
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
    async register(scope){
        if(!(scope instanceof i18nScope)){
            throw new TypeError("Scope must be an instance of I18nScope")
        }
        this._scopes.push(scope) 
        await scope.refresh(this.activeLanguage) 
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
        isGlobal : 注册到全局
     */
    registerFormatter(name,formatter,{language="*"}={}){
        if(!isFunction(formatter) || typeof(name)!=="string"){
            throw new TypeError("Formatter must be a function")
        }                
        language = Array.isArray(language) ? language : (language ? language.split(",") : [])
        language.forEach(lng=>{
            if(DataTypes.includes(name)){
                this.formatters[lng].$types[name] = formatter
            }else{
                this.formatters[lng][name] = formatter
            }  
        })
    }
    /**
    * 注册默认文本信息加载器
    */
    registerDefaultLoader(fn){
        if(!isFunction(fn)) throw new Error("The default loader must be a async function or promise returned")
        this._defaultMessageLoader = fn
        this.refresh()
    } 
    async refresh(){
        try{
            let requests = this._scopes.map(scope=>scope.refresh())
            if(Promise.allSettled){
                await Promise.allSettled(requests)
            }else{
                await Promise.all(requests)
            }
        }catch(e){
            if(this._debug) console.error(`Error while refresh voerkai18n scopes:${e.message}`) 
        }
    }

}

module.exports ={
    getInterpolatedVars,
    replaceInterpolatedVars,
    I18nManager,
    translate,
    i18nScope,
    createFormatter,
    Formatter,
    getDataTypeName,
    isNumber,
    isNothing,
    isPlainObject,
    isFunction,
    deepMerge,
    deepMixin
}