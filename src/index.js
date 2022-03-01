import deepMerge from "deepmerge"


// 用来提取字符里面的插值变量参数 , 支持管道符 { var | formatter | formatter }
// let varRegexp = /\{\s*(?<var>\w*\.?\w*)\s*\}/g
let varWidthPipeRegexp = /\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w+\s*)*)\s*\}/g
// 插值变量字符串替换正则
//let varReplaceRegexp =String.raw`\{\s*(?<var>{name}\.?\w*)\s*\}`


let varReplaceRegexp =String.raw`\{\s*{varname}\s*\}`

/**
 * 考虑到通过正则表达式进行插件的替换可能较慢，因此提供一个简单方法来过滤掉那些
 * 不需要进行插值处理的字符串
 * 原理很简单，就是判断一下是否同时具有{和}字符，如果有则认为可能有插值变量，如果没有则一定没有插件变量，则就不需要进行正则匹配
 * 从而可以减少不要的正则匹配
 * 注意：该方法只能快速判断一个字符串不包括插值变量
 * @param {*} str 
 * @returns {boolean}  true=可能包含插值变量,
 */
function hasInterpolation(str){
    return str.includes("{") && str.includes("}")
}
/**
 * 获取指定变量类型名称
 * getDataTypeName(1) == Number
 * getDataTypeName("") == String
 * getDataTypeName(null) == Null
 * getDataTypeName(undefined) == Undefined
 * getDataTypeName(new Date()) == Date
 * getDataTypeName(new Error()) == Error
 * 
 * @param {*} v 
 * @returns 
 */
function getDataTypeName(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};

/**  
 * 提取字符串中的插值变量
 * @param {*} str 
 * @returns {Array} [[变量名称,[]],[变量名称,[formatter,formatter,...]],...]
 */
function getInterpolatedVars(str){
    let result = []
    let match 
    while ((match = varWidthPipeRegexp.exec(str)) !== null) {
        if (match.index === varWidthPipeRegexp.lastIndex) {
            varWidthPipeRegexp.lastIndex++;
        }          
        if(match.groups.varname) {
            result.push(match.groups.formatters ? [match.groups.varname,match.groups.formatters.trim().split("|")] : [match.groups.varname,[]])
        }
    }
    return result
}
/**
 * 将要翻译内容提供了一个非文本内容时进行默认的转换
 *  - 对函数则执行并取返回结果()
 *  - 对Array和Object使用JSON.stringify
 *  - 其他类型使用toString
 * 
 * @param {*} value 
 * @returns 
 */
function transformVarValue(value){
    let result  = value
    if(typeof(result)==="function") result = value()
    if(!(typeof(result)==="string")){
        if(Array.isArray(result) || typeof(result)==="object"){
            result = JSON.stringify(result)
        }else{
            result = result.toString()
        }
    }
    return result
}
 /**
  * 字符串可以进行变量插值替换，
  *    replaceInterpolateVars("<模板字符串>",{变量名称:变量值,变量名称:变量值,...})
  *    replaceInterpolateVars("<模板字符串>",[变量值,变量值,...])
  *    replaceInterpolateVars("<模板字符串>",变量值,变量值,...])
  * 
    - 当只有两个参数并且第2个参数是{}时，将第2个参数视为命名变量的字典
        replaceInterpolateVars("this is {a}+{b},{a:1,b:2}) --> this is 1+2
    - 当只有两个参数并且第2个参数是[]时，将第2个参数视为位置参数
       replaceInterpolateVars"this is {}+{}",[1,2]) --> this is 1+2
    - 普通位置参数替换
       replaceInterpolateVars("this is {a}+{b}",1,2) --> this is 1+2
    - 
    this == scope == { formatters: {}, ... }
  * @param {*} template 
  * @returns 
  */
function replaceInterpolateVars(template,...args) {
    const scope = this
    let result=template
    if(!hasInterpolation(template)) return template

    if(args.length===1 && typeof(args[0]) === "object" && !Array.isArray(args[0])){  // 变量插值
        // 取得里面的插值变量 
        let varNames =  getInterpolatedVars(template)
        let varValues = args[0]
        if(varNames.length===0) return template      
        for(let [name,formatters] of varNames){
            // 计算出变量值
            let value =  (name in varValues) ? varValues[name] : ''
            if(formatters.length  >0 ){
                formatters.reduce((v,formatter)=>{
                    if(formatter in scope.formatters){
                        return scope.formatters[formatter](v)
                    }else{
                        return v
                    } 
                },"")
            }               
            // 如果变量中包括|管道符,则需要进行转换以适配更宽松的写法，比如data|time能匹配"data |time","data | time"等
            let nameRegexp = name.includes("|") ? name.split("|").join("\\s*\\|\\s*") : name 
            result=result.replaceAll(new RegExp(varReplaceRegexp.replaceAll("{varname}",nameRegexp),"g"),transformVarValue(args[0][name]))
        }
    }else{ // 位置插值
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args         
        let i=0
        for(let match of result.match(varWidthPipeRegexp) || []){
            if(i<params.length){
                let param = transformVarValue(params[i])
                result=result.replace(match,param)
                i+=1
            }
        }
    }
    return result
}    

// 默认语言配置
export const defaultLanguageSettings = {  
    defaultLanguage: "cn",
    activeLanguage: "cn",
    languages:{
        cn:{name:"cn",title:"中文",default:true},
        en:{name:"en",title:"英文"},
    }
}

function isMessageId(content){
    return parseInt(content)>0
}
/**
 * 翻译函数
 * 
* translate("要翻译的文本内容")                                 如果默认语言是中文，则不会进行翻译直接返回
* translate("I am {} {}","man") == I am man                    位置插值
* translate("I am {p}",{p:"man"})                              字典插值
* translate("I am {p}",{p:"man",ns:""})                        指定名称空间
* translate("I am {p}",{p:"man",namespace:""})
* translate("I am {p}",{p:"man",namespace:""})
* translate("total {count} items", {count:1})  //复数形式 
* translate("total {} {} {} items",a,b,c)  // 位置变量插值
 * 
 * this===scope  当前绑定的scope
 * 
 */
export function translate(message) { 
    const scope = this
    const activeLanguage = scope.settings.activeLanguage 
    let vars={}           // 插值变量
    let pluralVars=[]
    try{
        if(arguments.length === 2 && typeof(arguments[1])=='object'){
            Object.assign(vars,arguments[1])
            Object.entries(vars).forEach(([key,value])=>{
                if(typeof(value)==="function"){
                    vars[key] =try{value()}catch(e){value}
                } 
                if(key.startsWith("$")) pluralVars.push(key) // 复数变量
            })
        }else if(arguments.length >= 2){
            vars = [...arguments].splice(1).map(arg=>typeof(arg)==="function" ? arg() : arg)
        } 

        // 默认语言，不需要查询加载，只需要做插值变换即可
        if(activeLanguage === scope.defaultLanguage){
            // 当源文件运用了babel插件后会将原始文本内容转换为msgId
            if(isMessageId(message)){
                message = scope.default[message] || message
            }
            return replaceInterpolateVars.call(scope,message,vars)
        }else{ 
            // 1. 获取翻译后的文本内容
            // 如果没有启用babel插件时，需要先将文本内容转换为msgId
            let msgId = isMessageId(message) ? message :  scope.idMap[message]  
            message = scope.messages[msgId] || msgId

            // 处理复数
            if(Array.isArray(message)){

            }else{ // 普通

            }

        }
    }catch(e){
        return message
    } 
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
export class I18n{
    static instance    = null;                                 // 单例引用
    callbacks          =  []                                 //  当切换语言时的回调事件
    constructor(settings={}){
        if(i18n.instance==null){
            this.reset()
            i18n.instance = this;
        }
        this._settings = deepMerge(defaultLanguageSettings,settings)
        this._scopes=[]  // [{cn:{...},en:Promise,de:Promise},{...},{...}]
        return i18n.instance;
    }
    // 当前激活语言
    get language(){return this._settings.activeLanguage}
    // 默认语言
    get defaultLanguage(){return this.this._settings.defaultLanguage}
    // 支持的语言列表
    get languages(){return this._settings.languages}
    // 订阅语言切换事件
    on(callback){ 
        this.callbacks.push(callback)
    }
    off(callback){
        for(let i=0;i<this.callbacks.length;i++){
            if(this.callbacks[i]===callback ){
                this.callbacks.splice(i,1)
                return
            }
        }
    }
    offAll(){
        this.callbacks=[]
    }
    /**
     * 切换语言时触发语言切换事件回调
     */
    async _triggerChangeEvents(newLanguage){        
        try{
            await this._updateScopes(newLanguage) 
            await (Promise.allSettled  || Promise.all)(this.callbacks.map(async cb=>await cb(newLanguage)))
        }catch(e){
            console.warn("Error while executing language change events",e.message)
        }
    }  
    /**
     *  切换语言
     */
    async change(value){
        if(value in this.languages){
            await this._triggerChangeEvents(value) 
            this._settings.activeLanguage = value
        }else{
            throw new Error("Not supported language:"+value)
        }
    }
    /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
    async _updateScopes(newLanguage){ 
        // 并发执行所有作用域语言包的加载
        try{
            await (Promise.allSettled  || Promise.all)(this._scopes.map(scope=>{
                return async ()=>{
                    // 默认语言，所有均默认语言均采用静态加载方式，只需要简单的替换即可
                    if(newLanguage === scope.defaultLanguage){
                        scope.messages = scope.default
                        return 
                    }
                    // 异步加载语言文件
                    const loader = scope.loaders[newLanguage]
                    if(typeof(loader) === "function"){
                        try{
                            scope.messages = await loader()
                        }catch(e){
                            console.warn(`Error loading language ${newLanguage} : ${e.message}`)
                            scope.messages = defaultMessages  // 出错时回退到默认语言
                        }       
                    }else{
                        scope.messages = defaultMessages
                    }
                }
            }))
        }catch(e){
            console.warn("Error while refreshing scope:",e.message)
        }         
    }
    /**
     * 
     * 注册一个新的作用域
     * 
     * 每一个库均对应一个作用域，每个作用域可以有多个语言包，且对应一个翻译函数
     * scope={ 
     *      defaultLanguage:"cn",
            default:   defaultMessages,                 // 转换文本信息
            messages : defaultMessages,                 // 当前语言的消息
            idMap:messageIds,
            formatters:{
                ...formatters,
                ...i18nSettings.formatters || {}
            },
            loaders:{},      // 异步加载语言文件的函数列表
            settings:{}      // 引用全局VoerkaI18n实例的配置
     * }
     * 
     * 除了默认语言外，其他语言采用动态加载的方式
     * 
     * @param {*} scope 
     */
    register(scope){
        scope.i18nSettings = this.settings
        this._scopes.push(scope) 
    }
}
 