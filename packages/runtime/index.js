const { getDataTypeName,isNumber,isPlainObject,deepMerge } = require("./utils")
const EventEmitter = require("./eventemitter")
const i18nScope = require("./scope.js")
let  inlineFormatters = require("./formatters")         // 内置格式化器



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
const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"]
 

/**
   通过正则表达式对原始文本内容进行解析匹配后得到的
   formatters="| aaa(1,1) | bbb "

   需要统一解析为

   [
       [aaa,[1,1]],         // [formatter'name,[args,...]]
       [bbb,[]],
   ]

   formatters="| aaa(1,1,"dddd") | bbb "

   目前对参数采用简单的split(",")来解析，因此如果参数中包括了,则无法正确解析，例如aaa(1,1,"dd,,dd")形式的参数
   在此场景下基本够用了，如果需要支持更复杂的参数解析，可以后续考虑使用正则表达式来解析
   
   @returns  [[<formatterName>,[<arg>,<arg>,...]]]
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
 *     // [
    //   {  
        name:<变量名称>,formatters:[{name:<格式化器名称>,args:[<参数>,<参数>,....]]｝],<匹配字符串>],
    //   ....
    // 
 * @param {*} str 
 * @param {*} isFull   =true 保留所有插值变量 =false 进行去重
 * @returns {Array} 
 * [
 *  {
 *      name:"<变量名称>",
 *      formatters:[
 *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
 *          {name:"<格式化器名称>",args:[<参数>,<参数>,....]},
 *      ],
 *      match:"<匹配字符串>"
 *  },
 *  ...
 * ]
 */
function getInterpolatedVars(str){
    let vars = []
    forEachInterpolatedVars(str,(varName,formatters,match)=>{
        let varItem = {
            name:varName,
            formatters:formatters.map(([formatter,args])=>{
                return {
                    name:formatter,
                    args:args
                }
            }),
            match:match
        }
        if(vars.findIndex(varDef=>((varDef.name===varItem.name) && (varItem.formatters.toString() == varDef.formatters.toString())))===-1){
            vars.push(varItem) 
        }
        return ""
    }) 
    return vars
}
/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str 
 * @param {Function(<变量名称>,[formatters],match[0])} callback 
 * @returns  返回替换后的字符串
 */
function forEachInterpolatedVars(str,callback,options={}){
    let result=str, match 
    let opts = Object.assign({
        replaceAll:true,                // 是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
    },options)
    varWithPipeRegexp.lastIndex=0
    while ((match = varWithPipeRegexp.exec(result)) !== null) {
        const varname = match.groups.varname || ""
        // 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
        const formatters = parseFormatters(match.groups.formatters)
        if(typeof(callback)==="function"){
            try{
                if(opts.replaceAll){
                    result=result.replaceAll(match[0],callback(varname,formatters,match[0]))
                }else{
                    result=result.replace(match[0],callback(varname,formatters,match[0]))
                }                
            }catch{// callback函数可能会抛出异常，如果抛出异常，则中断匹配过程
                break   
            }            
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
        if(Array.isArray(result) || isPlainObject(result)){
            result = JSON.stringify(result)
        }else{
            result = result.toString()
        }
    }
    return result
}

function resetScopeCache(scope,activeLanguage=null){
    scope.$cache = {activeLanguage,typedFormatters:{},formatters:{}}
}
/**
 *   取得指定数据类型的默认格式化器 
 *   
 *   可以为每一个数据类型指定一个默认的格式化器,当传入插值变量时，
 *   会自动调用该格式化器来对值进行格式化转换
 * 
 * 
 * 
 
    const formatters =  {   
        "*":{
            $types:{...}                                    // 在所有语言下只作用于特定数据类型的格式化器
        },                                                  // 在所有语言下生效的格式化器    
        zh:{            
            $types:{         
                [数据类型]:{
                    default:(value)=>{...}                  // 默认    
                },

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
    if(!scope.$cache) resetScopeCache(scope)
    if(scope.$cache.activeLanguage === activeLanguage) {
        if(dataType in scope.$cache.typedFormatters) return scope.$cache.typedFormatters[dataType]
    }else{// 当语言切换时清空缓存
        resetScopeCache(scope,activeLanguage)
    }
    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.formatters,scope.global.formatters]  
    for(const target of targets){
        if(!target) continue
         // 1. 在全局$types中查找
         if(("*" in target) && isPlainObject(target["*"].$types)){
            let formatters = target["*"].$types 
            if(dataType in formatters && typeof(formatters[dataType])==="function"){                
                return scope.$cache.typedFormatters[dataType] = formatters[dataType]
            }  
        } 
        // 2. 当前语言的$types中查找
        if((activeLanguage in target) && isPlainObject(target[activeLanguage].$types)){ 
            let formatters = target[activeLanguage].$types  
            if(dataType in formatters && typeof(formatters[dataType])==="function"){                
                return scope.$cache.typedFormatters[dataType] = formatters[dataType]
            }  
        }         
    }     
}

/**
 * 获取指定名称的格式化器函数
 * 
 * 查找逻辑
 *  - 在当前作用域中查找 
 *    
 *  - 在全局作用域中查找
 * 
 * 全局作用域的格式化器优先
 * 
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} name                  格式化器名称
 * @returns  {Function}             格式化函数  
 */ 
function getFormatter(scope,activeLanguage,name){
    // 缓存格式化器引用，避免重复检索
    if(!scope.$cache) resetScopeCache(scope)
    if(scope.$cache.activeLanguage === activeLanguage) {
        if(name in scope.$cache.formatters) return scope.$cache.formatters[name]
    }else{// 当语言切换时清空缓存
        resetScopeCache(scope,activeLanguage)
    }
    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.global.formatters,scope.formatters]  
    for(const target of targets){
        // 1. 优先在当前语言查找
        if(activeLanguage in target){  
            let formatters = target[activeLanguage] || {}   
            if((name in formatters) && typeof(formatters[name])==="function") return scope.$cache.formatters[name] = formatters[name]
        }
        // 2. 全局作用域中查找
        let formatters = target["*"] || {}   
        if((name in formatters) && typeof(formatters[name])==="function") return scope.$cache.formatters[name] = formatters[name]
    }     
}

/**
 * 执行格式化器并返回结果
 * @param {*} value 
 * @param {*} formatters  多个格式化器顺序执行，前一个输出作为下一个格式化器的输入
 */
function executeFormatter(value,formatters){
    if(formatters.length===0) return value
    let result = value
    try{
        for(let formatter of formatters){
            if(typeof(formatter) === "function") {
                result = formatter(result)
            }else{// 如果碰到无效的格式化器，则跳过过续的格式化器
                return result 
            }
        }
    }catch(e){
        console.error(`Error while execute i18n formatter for ${value}: ${e.message} ` )
    }    
    return result
}
/**
 * 
 * 
 * 
 * 将  [[格式化器名称,[参数,参数,...]]，[格式化器名称,[参数,参数,...]]]格式化器转化为
 *  格式化器的调用函数链
 * 
 * 
 * 
 *   
 * 
 * 
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} formatters 
 * @returns {Array}   [(v)=>{...},(v)=>{...},(v)=>{...}]
 * 
 * 
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
            }else{
                // 格式化器无效或者没有定义时，查看当前值是否具有同名的原型方法，如果有则执行调用
                // 比如padStart格式化器是String的原型方法，不需要配置就可以直接作为格式化器调用
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
 *  将value经过格式化器处理后返回
 * @param {*} scope 
 * @param {*} activeLanguage 
 * @param {*} formatters 
 * @param {*} value 
 * @returns 
 */
function getFormattedValue(scope,activeLanguage,formatters,value){
    // 1. 取得格式化器函数列表
    const formatterFuncs = buildFormatters(scope,activeLanguage,formatters) 
    // 2. 查找每种数据类型默认格式化器,并添加到formatters最前面，默认数据类型格式化器优先级最高
    const defaultFormatter =  getDataTypeDefaultFormatter(scope,activeLanguage,getDataTypeName(value)) 
    // 默认数据类型的格式化器仅在没有指定其他格式化器时生效    
    if(defaultFormatter && formatterFuncs.length==0){
        formatterFuncs.splice(0,0,defaultFormatter)
    }             
    // 3. 执行格式化器
    value = executeFormatter(value,formatterFuncs)     
    return value
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

    // 没有变量插值则的返回原字符串  
    if(args.length===0 || !hasInterpolation(template)) return template 

    // ****************************变量插值****************************
    if(args.length===1 && isPlainObject(args[0])){  
        // 读取模板字符串中的插值变量列表
        // [[var1,[formatter,formatter,...],match],[var2,[formatter,formatter,...],match],...}
        let varValues = args[0]
        return forEachInterpolatedVars(template,(varname,formatters)=>{
            let value =  (varname in varValues) ? varValues[varname] : ''
            return getFormattedValue(scope,activeLanguage,formatters,value)  
        })   
    }else{  
        // ****************************位置插值****************************
        // 如果只有一个Array参数，则认为是位置变量列表，进行展开
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args     
        if(params.length===0) return template    // 没有变量则不需要进行插值处理，返回原字符串  
        let i = 0
        return forEachInterpolatedVars(template,(varname,formatters)=>{
            if(params.length>i){ 
                return getFormattedValue(scope,activeLanguage,formatters,params[i++]) 
            }else{
                throw new Error()   // 抛出异常，停止插值处理
            }
        },{replaceAll:false})
         
    }
    return result
}    

// 默认语言配置
const defaultLanguageSettings = {  
    defaultLanguage: "zh",
    activeLanguage: "zh",
    languages:[
        {name:"zh",title:"中文",default:true},
        {name:"en",title:"英文"}
    ],
    formatters:inlineFormatters,
    datetime:{

    },
}

function isMessageId(content){
    return parseInt(content)>0
}
/**
 * 根据值的单数和复数形式，从messages中取得相应的消息
 * 
 * @param {*} messages  复数形式的文本内容 = [<=0时的内容>，<=1时的内容>，<=2时的内容>,...]
 * @param {*} value 
 */
function getPluraMessage(messages,value){
    try{
        if(Array.isArray(messages)){
            return messages.length > value ? messages[value] : messages[messages.length-1]
       }else{
           return messages
       }
    }catch{
        return Array.isArray(messages) ? messages[0] : messages
    }
}

/**
 * 翻译函数
 * 
* translate("要翻译的文本内容")                                 如果默认语言是中文，则不会进行翻译直接返回
* translate("I am {} {}","man") == I am man                    位置插值
* translate("I am {p}",{p:"man"})                              字典插值
* translate("total {$count} items", {$count:1})  //复数形式 
* translate("total {} {} {} items",a,b,c)  // 位置变量插值
 * 
 * this===scope  当前绑定的scope
 * 
 */
function translate(message) { 
    const scope = this
    const activeLanguage = scope.global.activeLanguage 
    let content = message
    let vars=[]                 // 插值变量列表
    let pluralVars= []          // 复数变量
    let pluraValue = null       // 复数值
    if(!typeof(message)==="string") return message
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && isPlainObject(arguments[1])){
            Object.entries(arguments[1]).forEach(([name,value])=>{
                if(typeof(value)==="function"){
                    try{
                        vars[name] = value()
                    }catch(e){
                        vars[name] = value
                    }
                } 
                // 以$开头的视为复数变量
                if(name.startsWith("$") && typeof(vars[name])==="number")  pluralVars.push(name)
            })
            vars = [arguments[1]]
        }else if(arguments.length >= 2){
            vars = [...arguments].splice(1).map((arg,index)=>{
                try{
                    arg = typeof(arg)==="function" ? arg() : arg                    
                    // 位置参数中以第一个数值变量为复数变量
                    if(isNumber(arg)) pluraValue = parseInt(arg)    
                }catch(e){ }
                return arg   
            })
            
        }
        
        
       

        // 3. 取得翻译文本模板字符串
        if(activeLanguage === scope.defaultLanguage){
            // 2.1 从默认语言中取得翻译文本模板字符串
            // 如果当前语言就是默认语言，不需要查询加载，只需要做插值变换即可
            // 当源文件运用了babel插件后会将原始文本内容转换为msgId
            // 如果是msgId则从scope.default中读取,scope.default=默认语言包={<id>:<message>}
            if(isMessageId(content)){
                content = scope.default[content] || message
            }
        }else{ 
            // 2.2 从当前语言包中取得翻译文本模板字符串
            // 如果没有启用babel插件将源文本转换为msgId，需要先将文本内容转换为msgId
            let msgId = isMessageId(content) ? content :  scope.idMap[content]  
            content = scope.messages[msgId] || content
        }
         // 2. 处理复数
        // 经过上面的处理，content可能是字符串或者数组
        // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
        // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
        if(Array.isArray(content) && content.length>0){
            // 如果存在复数命名变量，只取第一个复数变量
            if(pluraValue!==null){  // 启用的是位置插值,pluraIndex=第一个数字变量的位置
                content = getPluraMessage(content,pluraValue)
            }else if(pluralVar.length>0){
                content = getPluraMessage(content,parseInt(vars(pluralVar[0])))
            }else{ // 如果找不到复数变量，则使用第一个内容
                content = content[0]
            }
        }         
        // 进行插值处理
        if(vars.length==0){
            return content
        }else{
            return replaceInterpolatedVars.call(scope,content,...vars)
        }        
    }catch(e){
        return content       // 出错则返回原始文本
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
 class I18nManager extends EventEmitter{
    constructor(settings={}){
        super()
        if(I18nManager.instance!=null){
            return I18nManager.instance;
        }
        I18nManager.instance = this;
        this._settings = deepMerge(defaultLanguageSettings,settings)
        this._scopes=[]  
        this._defaultMessageLoader = null  // 默认文本加载器
        return I18nManager.instance;
    }
    get settings(){ return this._settings }
    get scopes(){ return this._scopes }
    // 当前激活语言
    get activeLanguage(){ return this._settings.activeLanguage}
    // 默认语言
    get defaultLanguage(){ return this._settings.defaultLanguage}
    // 支持的语言列表
    get languages(){ return this._settings.languages}
    // 内置格式化器
    get formatters(){ return inlineFormatters }
    get defaultMessageLoader(){ return this._defaultMessageLoader}
    // 通过默认加载器加载文件
    async loadMessagesFromDefaultLoader(newLanguage,scope){
        if(typeof(this._defaultMessageLoader) != "function")  return //throw new Error("No default message loader specified")
        return  await this._defaultMessageLoader.call(scope,newLanguage,scope)        
    }
    /**
     *  切换语言
     */
    async change(value){
        value=value.trim()
        if(this.languages.findIndex(lang=>lang.name === value)!==-1 || typeof(this._defaultMessageLoader)==="function"){
            // 通知所有作用域刷新到对应的语言包
            await this._refreshScopes(value)
            this._settings.activeLanguage = value            
            await this.emit(value)            /// 触发语言切换事件
        }else{
            throw new Error("Not supported language:"+value)
        }
    }
    /**
     * 当切换语言时调用此方法来加载更新语言包
     * @param {*} newLanguage 
     */
    async _refreshScopes(newLanguage){ 
        // 并发执行所有作用域语言包的加载
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
        if(DataTypes.includes(name)){
            this.formatters[language].$types[name] = formatter
        }else{
            this.formatters[language][name] = formatter
        }    
    }
    /**
    * 注册默认文本信息加载器
    */
    registerDefaultLoader(fn){
        if(typeof(fn) !== 'function') throw new Error("The default loader must be a async function or promise returned")
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
        }catch{}
    }

}
/**
 * 创建格式化器
 * @param {*} fn 
 * @param {*} options  = {
 *     erorr:(e)=>{...}    //执行出错时返回值
 *     empty:()=>{...}     // 当空值时的返回值 * 
 * }
 * 
 */
function createFormatter(fn,options){
    if(isPlainObject(options)) fn._options = options
    return fn.bind(fn._options)
}
  
/**
 * 扩展格式化器
 * @param {*} fn 
 */
function extendFormatter(fn){

}

module.exports ={
    getInterpolatedVars,
    replaceInterpolatedVars,
    I18nManager,
    translate,
    i18nScope,
    defaultLanguageSettings,
    getDataTypeName,
    isNumber,
    isPlainObject 
}