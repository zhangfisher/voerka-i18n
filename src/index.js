import deepMerge from "deepmerge"


// 用来提取字符里面的插值变量参数
// let varRegexp = /\{\s*(?<var>\w*\.?\w*)\s*\}/g
let varRegexp = /\{\s*((?<varname>\w+)?(\s*\|\s*(?<formatter>\w*))?)?\s*\}/g
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
 * @returns {Array} 变量名称列表
 */
function getInterpolatedVars(str){
    let result = []
    let match 
    while ((match = varRegexp.exec(str)) !== null) {
        if (match.index === varRegexp.lastIndex) {
            varRegexp.lastIndex++;
        }          
        if(match.groups.varname) {
            result.push(match.groups.formatter ? match.groups.varname+"|"+match.groups.formatter : match.groups.varname)
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
   
  * @param {*} template 
  * @returns 
  */
function replaceInterpolateVars(template,...args) {
    let result=template
    if(!hasInterpolation(template)) return 
    if(args.length===1 && typeof(args[0]) === "object" && !Array.isArray(args[0])){  // 变量插值
        for(let name in args[0]){
            // 如果变量中包括|管道符,则需要进行转换以适配更宽松的写法，比如data|time能匹配"data |time","data | time"等
            let nameRegexp = name.includes("|") ? name.split("|").join("\\s*\\|\\s*") : name 
            result=result.replaceAll(new RegExp(varReplaceRegexp.replaceAll("{varname}",nameRegexp),"g"),transformVarValue(args[0][name]))
        }
    }else{ // 位置插值
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args         
        let i=0
        for(let match of result.match(varRegexp) || []){
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
* translate({count:1,plurals:'count'})  // 复数形式
* translate("total {} {} {} items",a,b,c)  // 位置变量插值
 * 
 */
export function translate() { 
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
    _triggerCallback(){
        this.callbacks.forEach(callback=>{
            if(typeof(callback)=="function"){
                callback.call(this,this.language)
            }
        })
    }  
    /**
     *  切换语言
     */
    async change(value){
        if(value in this.languages){
            // 
            let asyncMsgLoaders = this._scopes.map(scope=>scope[value]).filter(loader=>{
                loader!=null}
            )
            // 加载所有
            if(asyncMsgLoaders.length>0){
                await Promise.all(asyncMsgLoaders)
            }

            this._settings.activeLanguage = value
            this._triggerCallback()
        }else{
            throw new Error("Not supported language:"+value)
        }
    }
    /**
     * 
     * 注册一个新的作用域
     * 
     * 每一个库均对应一个作用域，每个作用域可以有多个语言包，且对应一个翻译函数
     * scope={
     *    "<默认语言>":{
     *      "<id>":"<text>",  
     *    },
     *    "<语言1>":()=>import(),
     *    "<语言2>":()=>import(), 
     * }
     * 
     * 除了默认语言外，其他语言采用动态加载的方式
     * 
     * @param {*} scope 
     */
    register(scope){
        this._scopes.push(scope) 
    }
}
 