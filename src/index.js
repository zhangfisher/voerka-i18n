const deepMerge = require("deepmerge")
const formatters = require("./formatters")


// 用来提取字符里面的插值变量参数 , 支持管道符 { var | formatter | formatter }
// 不支持参数： let varWithPipeRegexp = /\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*\s*)*)\s*\}/g

// 支持参数： { var | formatter(x,x,..) | formatter }
let varWithPipeRegexp = /\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*(\(.*\)){0,1}\s*)*)\s*\}/g



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
   通过正则表达式对原始文本内容进行解析匹配后得到的
   formatters="| aaa(1,1) | bbb "

   需要统一解析为

   [
       [aaa,[1,1]],         // [formatter'name,[args,...]]
       [bbb,[]],
   ]

   formatters="| aaa(1,1,"dddd") | bbb "

   目前对参数采用简单的split(",")来解析，因为无法正确解析aaa(1,1,"dd,,dd")形式的参数
   在此场景下基本够用了，如果需要支持更复杂的参数解析，可以后续考虑使用正则表达式来解析
   
   @returns  [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
 */
function parseFormatters(formatters){
    if(!formatters) return []
    // 1. 先解析为 ["aaa()","bbb"]形式
    let result = formatters.trim().substr(1).trim().split("|").map(r=>r.trim())  

    // 2. 解析格式化器参数
    return result.map(formatter=>{
        let firstIndex = formatter.indexOf("(")
        let lastIndex = formatter.lastIndexOf(")")
        if(firstIndex!==-1 && lastIndex!==-1){ // 带参数的格式化器
            const argsContent =  formatter.substr(firstIndex+1,lastIndex-firstIndex-1).trim()
            let args = argsContent=="" ? [] :  argsContent.split(",").map(arg=>{
                arg = arg.trim()
                if(!isNaN(parseInt(arg))){
                    return parseInt(arg)                  // 数字
                }else if((arg.startsWith('\"') && arg.endsWith('\"')) || (arg.startsWith('\'') && arg.endsWith('\'')) ){
                    return arg.substr(1,arg.length-2)       // 字符串
                }else if(arg.toLowerCase()==="true" || arg.toLowerCase()==="false"){
                    return arg.toLowerCase()==="true"     // 布尔值
                }else if((arg.startsWith('{') && arg.endsWith('}')) || (arg.startsWith('[') && arg.endsWith(']'))){      
                    try{
                        return JSON.parse(arg)
                    }catch(e){
                        return String(arg)
                    }
                }else{
                    return String(arg)
                }
            })
            return [formatter.substr(0,firstIndex),args]
        }else{// 不带参数的格式化器
            return [formatter,[]]
        }        
    }) 
}

/**  
 * 提取字符串中的插值变量
 * @param {*} str 
 * @param {*} isFull   =true 保留所有插值变量 =false 进行去重
 * @returns {Array} [[变量名称,[],match],[变量名称,[formatter,formatter,...],match],...]
 */
function getInterpolatedVars(str){
    let results = [], match 
    while ((match = varWithPipeRegexp.exec(str)) !== null) {
        if (match.index === varWithPipeRegexp.lastIndex) {
            varWithPipeRegexp.lastIndex++;
        }          
        const varname = match.groups.varname || ""
        // 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
        const formatters = parseFormatters(match.groups.formatters)
        const varInfo = [varname,formatters,match]
        results.push(varInfo)  
    }
    return results
}
/**
 * 遍历插值变量，并进行替换插值变量
 * @param {*} str 
 * @param {*} callback 
 * @returns 
 */
function forEachInterpolatedVars(str,callback){
    let result=str, match 
    varWithPipeRegexp.lastIndex=0
    while ((match = varWithPipeRegexp.exec(result)) !== null) {
        const varname = match.groups.varname || ""
        // 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
        const formatters = parseFormatters(match.groups.formatters)
        if(typeof(callback)==="function"){
            result=result.replaceAll(match[0],callback(varname,formatters))
        }
        varWithPipeRegexp.lastIndex=0
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
function transformToString(value){
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


// 缓存数据类型的格式化器，避免每次都调用getDataTypeDefaultFormatter
let datatypeFormattersCache ={
    $activeLanguage:null,
}
/**
 *   取得指定数据类型的默认格式化器 
 *   
 *   可以为每一个数据类型指定一个格式化器,当传入插值变量时，会自动调用该格式化器来对值进行格式化转换
 
    const formatters =  {   
        "*":{
            $types:{...}                                    // 在所有语言下只作用于特定数据类型的格式化器
        },                                      // 在所有语言下生效的格式化器    
        cn:{            
            $types:{         
                [数据类型]:(value)=>{...},
            }, 
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},
            [格式化器名称]:(value)=>{...},
        },
    }
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} dataType    数字类型
 * @returns {Function} 格式化函数  
 */
function getDataTypeDefaultFormatter(scope,activeLanguage,dataType){
    if(datatypeFormattersCache.$activeLanguage === activeLanguage) {
        if(dataType in datatypeFormattersCache) return datatypeFormattersCache[dataType]
    }else{// 清空缓存
        datatypeFormattersCache = {   $activeLanguage:activeLanguage  }
    }

    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.formatters,scope.global.formatters]  
    for(const target of targets){
        if(activeLanguage in target){ 
            // 在当前语言的$types中查找
            let formatters = target[activeLanguage].$types || {}   
            for(let [name,formatter] of Object.entries(formatters)){
                if(name === dataType && typeof(formatter)==="function") {
                    datatypeFormattersCache[dataType] = formatter
                    return formatter
                }
            } 
        }
        // 在所有语言的$types中查找
        let formatters = target["*"].$types || {}   
        for(let [name,formatter] of Object.entries(formatters)){
            if(name === dataType && typeof(formatter)==="function") {
                datatypeFormattersCache[dataType] = formatter
                return formatter
            }
        }         
    }     
}

/**
 * 获取指定名称的格式化器函数
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} name  格式化器名称
 * @returns  {Function} 格式化函数  
 */
let formattersCache = { $activeLanguage:null}
function getFormatter(scope,activeLanguage,name){
    if(formattersCache.$activeLanguage === activeLanguage) {
        if(name in formattersCache) return formattersCache[name]
    }else{ // 当切换语言时需要清空缓存
        formattersCache = {   $activeLanguage:activeLanguage  }
    }
    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.formatters,scope.global.formatters]  
    for(const target of targets){
        // 优先在当前语言查找
        if(activeLanguage in target){  
            let formatters = target[activeLanguage] || {}   
            if((name in formatters) && typeof(formatters[name])==="function") return formattersCache[name] = formatters[name]
        }
        // 在所有语言的$types中查找
        let formatters = target["*"] || {}   
        if((name in formatters) && typeof(formatters[name])==="function") return formattersCache[name] = formatters[name]
    }     
}

/**
 * 执行格式化器并返回结果
 * @param {*} value 
 * @param {*} formatters 
 */
function executeFormatter(value,formatters){
    if(formatters.length===0) return value
    let result = value
    try{
        for(let formatter of formatters){
            if(typeof(formatter) === "function") {
                result = formatter(result)
            }else{
                return result
            }
        }
    }catch(e){
        console.error(`Error while execute i18n formatter for ${value}: ${e.message} ` )
    }    
    return result
}
/**
 * 将  [[格式化器名称,[参数,参数,...]]，[格式化器名称,[参数,参数,...]]]格式化器转化为
 *   
 * 
 * 
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} formatters 
 */
function buildFormatters(scope,activeLanguage,formatters){
    let results = [] 
    for(let formatter of formatters){
        if(formatter[0]){
            const func = getFormatter(scope,activeLanguage,formatter[0])
            if(typeof(func)==="function"){
                results.push((v)=>{
                    return func(v,...formatter[1])
                })
            }else{// 格式化器无效或者没有定义时，查看当前值是否具有同名的方法，如果有则执行调用
                results.push((v)=>{
                    if(typeof(v[formatter[0]])==="function"){
                        return v[formatter[0]].call(v,...formatter[1])
                    }else{
                        return v
                    }        
                })  
            }              
        }
    }
    return results
} 
/**
 * 字符串可以进行变量插值替换，
 *    replaceInterpolatedVars("<模板字符串>",{变量名称:变量值,变量名称:变量值,...})
 *    replaceInterpolatedVars("<模板字符串>",[变量值,变量值,...])
 *    replaceInterpolatedVars("<模板字符串>",变量值,变量值,...])
 * 
- 当只有两个参数并且第2个参数是{}时，将第2个参数视为命名变量的字典
    replaceInterpolatedVars("this is {a}+{b},{a:1,b:2}) --> this is 1+2
- 当只有两个参数并且第2个参数是[]时，将第2个参数视为位置参数
    replaceInterpolatedVars"this is {}+{}",[1,2]) --> this is 1+2
- 普通位置参数替换
    replaceInterpolatedVars("this is {a}+{b}",1,2) --> this is 1+2
- 
this == scope == { formatters: {}, ... }
* @param {*} template 
* @returns 
*/
function replaceInterpolatedVars(template,...args) {
    const scope = this
    // 当前激活语言
    const activeLanguage = scope.global.activeLanguage 
    let result=template
    if(!hasInterpolation(template)) return template
    // ****************************变量插值****************************
    if(args.length===1 && typeof(args[0]) === "object" && !Array.isArray(args[0])){  
        // 读取模板字符串中的插值变量列表
        // [[var1,[formatter,formatter,...],match],[var2,[formatter,formatter,...],match],...}
        let varValues = args[0]
        return forEachInterpolatedVars(template,(varname,formatters)=>{
            // 1. 取得格式化器函数列表
            const formatterFuncs = buildFormatters(scope,activeLanguage,formatters)
            // 2. 取变量值
            let value =  (varname in varValues) ? varValues[varname] : ''
            // 3. 查找每种数据类型默认格式化器,并添加到formatters最前面，默认数据类型格式化器优先级最高
            const defaultFormatter =  getDataTypeDefaultFormatter(scope,activeLanguage,getDataTypeName(value)) 
            if(defaultFormatter){
                formatterFuncs.splice(0,0,defaultFormatter)
            }             
            // 4. 执行格式化器
            value = executeFormatter(value,formatterFuncs)     
            return value
        })   
    }else{  
        // ****************************位置插值****************************
        // 如果只有一个Array参数，则认为是位置变量列表，进行展开
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args     
        
        // 取得模板字符串中的插值变量列表 , 包含命令变量和位置变量
        let interpVars =  getInterpolatedVars(template,true) 
        if(interpVars.length===0) return template    // 没有变量插值则的返回原字符串  

        let i=0
        for(let match of result.match(varWithPipeRegexp) || []){
            if(i<params.length){
                let value = params[i]
                const formatterFuncs = buildFormatters(scope,activeLanguage,interpVars[i][1])  
                // 执行默认的数据类型格式化器
                const defaultFormatter =  getDataTypeDefaultFormatter(scope,activeLanguage,getDataTypeName(value)) 
                if(defaultFormatter){
                    formatterFuncs.splice(0,0,defaultFormatter)
                }  
                value = executeFormatter(value,formatterFuncs)
                result = result.replace(match,transformToString(value))
                i+=1
            }else{
                break
            }
        }
    }
    return result
}    

// 默认语言配置
const defaultLanguageSettings = {  
    defaultLanguage: "cn",
    activeLanguage: "cn",
    languages:{
        cn:{name:"cn",title:"中文",default:true},
        en:{name:"en",title:"英文"},
    },
    formatters
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
function translate(message) { 
    const scope = this
    const activeLanguage = scope.settings.activeLanguage 
    let vars={}                 // 插值变量
    let pluralVars=[]           // 复数变量
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && typeof(arguments[1])=='object'){
            Object.assign(vars,arguments[1])
            Object.entries(vars).forEach(([name,value])=>{
                if(typeof(value)==="function"){
                    try{
                        vars[name] = value()
                    }catch(e){
                        vars[name] = value
                    }
                } 
                // 复数变量
                if(name.startsWith("$")) pluralVars.push(name) 
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
            return replaceInterpolatedVars.call(scope,message,vars)
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
 class I18n{
    static instance    = null;                                  // 单例引用
    callbacks          =  []                                    //  当切换语言时的回调事件
    constructor(settings={}){
        if(i18n.instance==null){
            this.reset()
            i18n.instance = this;
        }
        this._settings = deepMerge(defaultLanguageSettings,settings)
        this._scopes=[]  
        return i18n.instance;
    }
    get settings(){ return this._settings }
    get scopes(){ return this._scopes }
    // 当前激活语言
    get activeLanguage(){ return this._settings.activeLanguage}
    // 默认语言
    get defaultLanguage(){ return this.this._settings.defaultLanguage}
    // 支持的语言列表
    get languages(){ return this._settings.languages}
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
        scope.global = this._settings
        this._scopes.push(scope) 
    }
}
 

module.exports ={
    getInterpolatedVars,
    replaceInterpolatedVars,
    I18n,
    translate,
    defaultLanguageSettings
}