import deepMerge from "deepmerge"


let ParamRegExp=/\{\w*\}/g
//添加一个params参数，使字符串可以进行变量插值替换，
// "this is {a}+{b}".params({a:1,b:2}) --> this is 1+2
// "this is {a}+{b}".params(1,2) --> this is 1+2
// "this is {}+{}".params([1,2]) --> this is 1+2
if(!String.prototype.hasOwnProperty("params")){

    String.prototype.params=function (params) {
        let result=this.valueOf()
        if(typeof params === "object"){
            for(let name in params){
                result=result.replace("{"+ name +"}",params[name])
            }
        }else{
            let i=0
            for(let match of result.match(ParamRegExp) || []){
                if(i<arguments.length){
                    result=result.replace(match,arguments[i])
                    i+=1
                }
            }
        }
        return result
    }    
}


class i18n{
    static instance    = null;                                 // 单例引用
    _language          = "cn"                                  // 当前语言
    defaultLanguage    = "cn"
    supportedLanguages = ["cn","en"]                            // 支持的语言
    builtInLanguages   = ["cn","en"]                            // 内置语言
    messages           = {}
    callbacks          = []                                     //  当切换语言时的回调事件
    constructor(){
        if(i18n.instance==null){
            this.reset()
            i18n.instance = this;
        }
        return i18n.instance;
    }
    addListener(callback){
        this.callbacks.push(callback)
    }
    removeListener(callback){
        for(let i=0;i<this.callbacks.length;i++){
            if(this.callbacks[i]===callback ){
                this.callbacks.splice(i,1)
                return
            }
        }
    }
    removeAllListeners(){
        this.callbacks=[]
    }
    _triggerCallback(){
        this.callbacks.forEach(callback=>{
            if(typeof(callback)=="function"){
                callback.call(this,this.language)
            }
        })
    }
    get language(){
        return this._language
    }
    set language(value){
        if(value in this.supportedLanguages){
            this._language = value
            this._triggerCallback()
        }
    }
    /**
     * 当配置更新时调用此方法
     */
    reset(){

        let settings            = {
            current:"cn",
            default:"cn",
            supportedLanguages:["en","cn"]
        }
        if(VoerkaSettings!==undefined)  Object.assign(settings,VoerkaSettings.get("i18n") )

        this._language          = settings.current
        this.defaultLanguage    = settings.default
        this.supportedLanguages = settings.supportedLanguages
        globalThis.t            = this.translate.bind(this)
        globalThis.i18n         = this
    }
    merge(messages){
        this.messages = deepMerge(this.messages,messages)
    }

    // 变量插值
    _replaceVars(source,params){
        if(Array.isArray(params)){
            return source.params(...params)
        }else{
            return source.params(params)
        }
    }
    /**
     *
     * translate("要翻译的文本内容")                                 如果默认语言是中文，则不会进行翻译直接返回
     * translate("I am {} {}","man") == I am man                    位置插值
     * translate("I am {p}",{p:"man"})                              字典插值
     * translate("I am {p}",{p:"man",ns:""})                        指定名称空间
     * translate("I am {p}",{p:"man",namespace:""})
     * translate("I am {p}",{p:"man",namespace:""})
     * translate("total {count} items", {count:1})  //复数形式
     * translate({count:1,plurals:'count'})  // 复数形式
     * translate("total {} {} {} items",a,b,c)  // 位置变量插值
     *
     */
    translate(){
        let content = arguments[0],options={}
        try{
            if(arguments.length === 2 && typeof(arguments[1])=='object'){
                Object.assign(options,arguments[1])
            }else if(arguments.length >= 2){
                options=[...arguments].splice(1)
            }
            // 默认语言是中文，不需要查询加载，只需要做插值变换即可
            if(this.language === this.defaultLanguage){
                return this._replaceVars(content,options)
            }else{
                let result = this.messages[this.language][content]
                if(content in this.messages[this.language]){
                    // 复数形式,需要通过plurals来指定内容中包括的复数插值
                    if(Array.isArray(result)){
                        let plurals = options.plurals
                        if(typeof(plurals) == 'string' && (plurals in options)){
                            return options[plurals]>1 ? result[1].params(options) : result[0].params(options)
                        }else{
                            return this._replaceVars(result[0],options)
                        }
                    }else{
                        return this._replaceVars(result,options);
                    }
                }else{
                    return this._replaceVars(result,options)
                }
            }
        }catch(e){
            return content
        }
    }
}


const i18nInstance = new i18n()

export default i18nInstance
