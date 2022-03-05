var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

/**
 *    内置的格式化器
 * 
 */

/**
 *   字典格式化器
 *   根据输入data的值，返回后续参数匹配的结果
 *   dict(data,<value1>,<result1>,<value2>,<result1>,<value3>,<result1>,...)
 *   
 * 
 *   dict(1,1,"one",2,"two",3,"three"，4,"four") == "one"
 *   dict(2,1,"one",2,"two",3,"three"，4,"four") == "two"
 *   dict(3,1,"one",2,"two",3,"three"，4,"four") == "three"
 *   dict(4,1,"one",2,"two",3,"three"，4,"four") == "four"
 *   // 无匹配时返回原始值
 *   dict(5,1,"one",2,"two",3,"three"，4,"four") == 5  
 *   // 无匹配时并且后续参数个数是奇数，则返回最后一个参数
 *   dict(5,1,"one",2,"two",3,"three"，4,"four","more") == "more"  
 * 
 *   在翻译中使用
 *   I have { value | dict(1,"one",2,"two",3,"three",4,"four")} apples
 * 
 * @param {*} value 
 * @param  {...any} args 
 * @returns 
 */
function dict(value,...args){
    try{
        for(let i=0;i<args.length;i+=2){
            if(args[i]===value){
                return args[i+1]
            }
        }
        if(args.length >0 && (args.length % 2!==0)) return args[args.length-1]
    }catch{}
    return value
}


var formatters$1 = {     
    "*":{
        $types:{
            Date:(value)=>value.toLocaleString()
        },
        time:(value)=>  value.toLocaleTimeString(),  
        date: (value)=> value.toLocaleDateString(),     
        dict,   //字典格式化器
    },   
    cn:{ 
        $types:{
            Date:(value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日 ${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`
        },
        time:(value)=>`${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`,     
        date: (value)=> `${value.getFullYear()}年${value.getMonth()+1}月${value.getDate()}日`,
        currency:(value)=>`${value}元`,
    },
    en:{
        currency:(value)=>`$${value}`,       
    }
};

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
function getDataTypeName$1(v){
	if (v === null)  return 'Null' 
	if (v === undefined) return 'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
}function isPlainObject$1(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}
function isNumber$1(value){
    return !isNaN(parseInt(value))
}
  
var utils = {
    getDataTypeName: getDataTypeName$1,
    isNumber: isNumber$1,
    isPlainObject: isPlainObject$1 
};

const deepMerge = cjs;
const formatters = formatters$1;
const {isPlainObject ,isNumber , getDataTypeName} = utils;

// 用来提取字符里面的插值变量参数 , 支持管道符 { var | formatter | formatter }
// 不支持参数： let varWithPipeRegexp = /\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*\s*)*)\s*\}/g

// 支持参数： { var | formatter(x,x,..) | formatter }
let varWithPipeRegexp = /\{\s*(?<varname>\w+)?(?<formatters>(\s*\|\s*\w*(\(.*\)){0,1}\s*)*)\s*\}/g;

// 有效的语言名称列表
const languages = ["af","am","ar-dz","ar-iq","ar-kw","ar-ly","ar-ma","ar-sa","ar-tn","ar","az","be","bg","bi","bm","bn","bo","br","bs","ca","cs","cv","cy","da","de-at","de-ch","de","dv","el","en-au","en-ca","en-gb","en-ie","en-il","en-in","en-nz","en-sg","en-tt","en","eo","es-do","es-mx","es-pr","es-us","es","et","eu","fa","fi","fo","fr-ca","fr-ch","fr","fy","ga","gd","gl","gom-latn","gu","he","hi","hr","ht","hu","hy-am","id","is","it-ch","it","ja","jv","ka","kk","km","kn","ko","ku","ky","lb","lo","lt","lv","me","mi","mk","ml","mn","mr","ms-my","ms","mt","my","nb","ne","nl-be","nl","nn","oc-lnc","pa-in","pl","pt-br","pt","ro","ru","rw","sd","se","si","sk","sl","sq","sr-cyrl","sr","ss","sv-fi","sv","sw","ta","te","tet","tg","th","tk","tl-ph","tlh","tr","tzl","tzm-latn","tzm","ug-cn","uk","ur","uz-latn","uz","vi","x-pseudo","yo","zh-cn","zh-hk","zh-tw","zh"];

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
   
   @returns  [[<formatterName>,[<arg>,<arg>,...]]]
 */
function parseFormatters(formatters){
    if(!formatters) return []
    // 1. 先解析为 ["aaa()","bbb"]形式
    let result = formatters.trim().substr(1).trim().split("|").map(r=>r.trim());  

    // 2. 解析格式化器参数
    return result.map(formatter=>{
        let firstIndex = formatter.indexOf("(");
        let lastIndex = formatter.lastIndexOf(")");
        if(firstIndex!==-1 && lastIndex!==-1){ // 带参数的格式化器
            const argsContent =  formatter.substr(firstIndex+1,lastIndex-firstIndex-1).trim();
            let args = argsContent=="" ? [] :  argsContent.split(",").map(arg=>{
                arg = arg.trim();
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
                }else {
                    return String(arg)
                }
            });
            return [formatter.substr(0,firstIndex),args]
        }else {// 不带参数的格式化器
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
    let vars = [];
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
        };
        if(vars.findIndex(varDef=>((varDef.name===varItem.name) && (varItem.formatters.toString() == varDef.formatters.toString())))===-1){
            vars.push(varItem); 
        }
        return ""
    }); 
    return vars
}
/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str 
 * @param {Function(<变量名称>,[formatters],match[0])} callback 
 * @returns  返回替换后的字符串
 */
function forEachInterpolatedVars(str,callback,options={}){
    let result=str, match; 
    let opts = Object.assign({
        replaceAll:true,                // 是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
    },options);
    varWithPipeRegexp.lastIndex=0;
    while ((match = varWithPipeRegexp.exec(result)) !== null) {
        const varname = match.groups.varname || "";
        // 解析格式化器和参数 = [<formatterName>,[<formatterName>,[<arg>,<arg>,...]]]
        const formatters = parseFormatters(match.groups.formatters);
        if(typeof(callback)==="function"){
            try{
                if(opts.replaceAll){
                    result=result.replaceAll(match[0],callback(varname,formatters,match[0]));
                }else {
                    result=result.replace(match[0],callback(varname,formatters,match[0]));
                }                
            }catch{// callback函数可能会抛出异常，如果抛出异常，则中断匹配过程
                break   
            }            
        }
        varWithPipeRegexp.lastIndex=0;
    }
    return result
}


// 缓存数据类型的格式化器，避免每次都调用getDataTypeDefaultFormatter
let datatypeFormattersCache ={
    $activeLanguage:null,
};
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
    }else {// 清空缓存
        datatypeFormattersCache = {   $activeLanguage:activeLanguage  };
    }

    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.formatters,scope.global.formatters];  
    for(const target of targets){
        if(activeLanguage in target){ 
            // 在当前语言的$types中查找
            let formatters = target[activeLanguage].$types || {};   
            for(let [name,formatter] of Object.entries(formatters)){
                if(name === dataType && typeof(formatter)==="function") {
                    datatypeFormattersCache[dataType] = formatter;
                    return formatter
                }
            } 
        }
        // 在所有语言的$types中查找
        let formatters = target["*"].$types || {};   
        for(let [name,formatter] of Object.entries(formatters)){
            if(name === dataType && typeof(formatter)==="function") {
                datatypeFormattersCache[dataType] = formatter;
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
let formattersCache = { $activeLanguage:null};
function getFormatter(scope,activeLanguage,name){
    if(formattersCache.$activeLanguage === activeLanguage) {
        if(name in formattersCache) return formattersCache[name]
    }else { // 当切换语言时需要清空缓存
        formattersCache = {   $activeLanguage:activeLanguage  };
    }
    // 先在当前作用域中查找，再在全局查找
    const targets = [scope.formatters,scope.global.formatters];  
    for(const target of targets){
        // 优先在当前语言查找
        if(activeLanguage in target){  
            let formatters = target[activeLanguage] || {};   
            if((name in formatters) && typeof(formatters[name])==="function") return formattersCache[name] = formatters[name]
        }
        // 在所有语言的$types中查找
        let formatters = target["*"] || {};   
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
    let result = value;
    try{
        for(let formatter of formatters){
            if(typeof(formatter) === "function") {
                result = formatter(result);
            }else {
                return result
            }
        }
    }catch(e){
        console.error(`Error while execute i18n formatter for ${value}: ${e.message} ` );
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
    let results = []; 
    for(let formatter of formatters){
        if(formatter[0]){
            const func = getFormatter(scope,activeLanguage,formatter[0]);
            if(typeof(func)==="function"){
                results.push((v)=>{
                    return func(v,...formatter[1])
                });
            }else {// 格式化器无效或者没有定义时，查看当前值是否具有同名的方法，如果有则执行调用
                results.push((v)=>{
                    if(typeof(v[formatter[0]])==="function"){
                        return v[formatter[0]].call(v,...formatter[1])
                    }else {
                        return v
                    }        
                });  
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
    const formatterFuncs = buildFormatters(scope,activeLanguage,formatters); 
    // 3. 查找每种数据类型默认格式化器,并添加到formatters最前面，默认数据类型格式化器优先级最高
    const defaultFormatter =  getDataTypeDefaultFormatter(scope,activeLanguage,getDataTypeName(value)); 
    if(defaultFormatter){
        formatterFuncs.splice(0,0,defaultFormatter);
    }             
    // 3. 执行格式化器
    value = executeFormatter(value,formatterFuncs);     
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
    const scope = this;
    // 当前激活语言
    const activeLanguage = scope.global.activeLanguage; 

    // 没有变量插值则的返回原字符串  
    if(args.length===0 || !hasInterpolation(template)) return template 

    // ****************************变量插值****************************
    if(args.length===1 && isPlainObject(args[0])){  
        // 读取模板字符串中的插值变量列表
        // [[var1,[formatter,formatter,...],match],[var2,[formatter,formatter,...],match],...}
        let varValues = args[0];
        return forEachInterpolatedVars(template,(varname,formatters)=>{
            let value =  (varname in varValues) ? varValues[varname] : '';
            return getFormattedValue(scope,activeLanguage,formatters,value)  
        })   
    }else {  
        // ****************************位置插值****************************
        // 如果只有一个Array参数，则认为是位置变量列表，进行展开
        const params=(args.length===1 && Array.isArray(args[0])) ?  [...args[0]] : args;     
        if(params.length===0) return template    // 没有变量则不需要进行插值处理，返回原字符串  
        let i = 0;
        return forEachInterpolatedVars(template,(varname,formatters)=>{
            if(params.length>i){ 
                return getFormattedValue(scope,activeLanguage,formatters,params[i++]) 
            }else {
                throw new Error()   // 抛出异常，停止插值处理
            }
        },{replaceAll:false})
         
    }
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
};

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
       }else {
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
    const scope = this;
    const activeLanguage = scope.global.activeLanguage; 
    let content = message;
    let vars=[];                 // 插值变量列表
    let pluralVars= [];          // 复数变量
    let pluraValue = null;       // 复数值
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && isPlainObject(arguments[1])){
            Object.entries(arguments[1]).forEach(([name,value])=>{
                if(typeof(value)==="function"){
                    try{
                        vars[name] = value();
                    }catch(e){
                        vars[name] = value;
                    }
                } 
                // 以$开头的视为复数变量
                if(name.startsWith("$")) pluralVars.push(name);
            });
            vars = [arguments[1]];
        }else if(arguments.length >= 2){
            vars = [...arguments].splice(1).map((arg,index)=>{
                try{
                    arg = typeof(arg)==="function" ? arg() : arg;                    
                    // 位置参数中以第一个数值变量为复数变量
                    if(isNumber(arg)) pluraValue = parseInt(arg);    
                }catch(e){ }
                return arg   
            });
            
        }  
        
        // 2. 取得翻译文本模板字符串
        if(activeLanguage === scope.defaultLanguage){
            // 2.1 从默认语言中取得翻译文本模板字符串
            // 如果当前语言就是默认语言，不需要查询加载，只需要做插值变换即可
            // 当源文件运用了babel插件后会将原始文本内容转换为msgId
            // 如果是msgId则从scope.default中读取,scope.default=默认语言包={<id>:<message>}
            if(isMessageId(content)){
                content = scope.default[content] || message;
            }
        }else { 
            // 2.2 从当前语言包中取得翻译文本模板字符串
            // 如果没有启用babel插件将源文本转换为msgId，需要先将文本内容转换为msgId
            let msgId = isMessageId(content) ? content :  scope.idMap[content];  
            content = scope.messages[msgId] || content;
        }
        
        // 3. 处理复数
        // 经过上面的处理，content可能是字符串或者数组
        // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
        // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
        if(Array.isArray(content) && content.length>0){
            // 如果存在复数命名变量，只取第一个复数变量
            if(pluraValue!==null){  // 启用的是位置插值,pluraIndex=第一个数字变量的位置
                content = getPluraMessage(content,pluraValue);
            }else if(pluralVar.length>0){
                content = getPluraMessage(content,parseInt(vars(pluralVar[0])));
            }else { // 如果找不到复数变量，则使用第一个内容
                content = content[0];
            }
        } 
        // 进行插值处理
        if(vars.length==0){
            return content
        }else {
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
 class I18nManager{
    static instance    = null;                                  // 单例引用
    callbacks          =  []                                    //  当切换语言时的回调事件
    constructor(settings={}){
        if(I18nManager.instance!=null){
            return I18nManager.instance;
        }
        I18nManager.instance = this;
        this._settings = deepMerge(defaultLanguageSettings,settings);
        this._scopes=[];  
        return I18nManager.instance;
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
        this.callbacks.push(callback);
    }
    off(callback){
        for(let i=0;i<this.callbacks.length;i++){
            if(this.callbacks[i]===callback ){
                this.callbacks.splice(i,1);
                return
            }
        }
    }
    offAll(){
        this.callbacks=[];
    }
    /**
     * 切换语言时触发语言切换事件回调
     */
    async _triggerChangeEvents(newLanguage){        
        try{
            await this._updateScopes(newLanguage); 
            await (Promise.allSettled  || Promise.all)(this.callbacks.map(async cb=>await cb(newLanguage)));
        }catch(e){
            console.warn("Error while executing language change events",e.message);
        }
    }  
    /**
     *  切换语言
     */
    async change(value){
        if(value in this.languages){
            await this._triggerChangeEvents(value); 
            this._settings.activeLanguage = value;
        }else {
            throw new Error("Not supported language:"+value)
        }
    }
    /**
     * 获取指定作用域的下的语言包加载器
     * 
     * 同时会进行语言兼容性处理
     * 
     * 如scope里面定义了一个cn的语言包，当切换到zh-cn时，会自动加载cn语言包
     * 
     * 
     * @param {*} scope 
     * @param {*} lang 
     */
    _getScopeLoader(scope,lang){

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
                        scope.messages = scope.default;
                        return 
                    }
                    // 异步加载语言文件
                    const loader = scope.loaders[newLanguage];
                    if(typeof(loader) === "function"){
                        try{
                            scope.messages = await loader();
                        }catch(e){
                            console.warn(`Error loading language ${newLanguage} : ${e.message}`);
                            scope.messages = defaultMessages;  // 出错时回退到默认语言
                        }       
                    }else {
                        scope.messages = defaultMessages;
                    }
                }
            }));
        }catch(e){
            console.warn("Error while refreshing scope:",e.message);
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
        scope.global = this._settings;
        this._scopes.push(scope); 
    }
    /**
     * 注册全局格式化器
     * @param {*} formatters 
     */
    registerFormatters(formatters){

    }
}

var runtime ={
    getInterpolatedVars,
    replaceInterpolatedVars,
    I18nManager,
    translate,
    languages,
    defaultLanguageSettings
};

export { runtime as default };
