
/**
 * 判断是否是JSON对象
 * @param {*} obj 
 * @returns 
 */
 function isPlainObject(obj){
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return true;
    var baseProto = proto;

    while (Object.getPrototypeOf(baseProto) !== null) {
        baseProto = Object.getPrototypeOf(baseProto);
    }
    return proto === baseProto; 
}

/**
 * 判断值是否是一个数字
 * @param {*} value 
 * @returns 
 */
 function isNumber(value){
    if(value==undefined) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
    try{
        if(value.includes(".")){
            let v = parseFloat(value)
            if(value.endsWith(".")){                
                return !isNaN(v) && String(v).length===value.length-1
            }else{
                return !isNaN(v) && String(v).length===value.length
            }            
        }else{
            let v = parseInt(value)
            return !isNaN(v) && String(v).length===value.length
        }    
    }catch{
        return false
    }
}
function isFunction(fn){
    return typeof fn === "function"
}
/**
 * 当value= null || undefined || "" || [] || {} 时返回true
 * @param {*} value 
 * @returns 
 */
function isNothing(value){
    if(["boolean","function"].includes(typeof(value))) return false
    if(value=="") return true    
    if(value==undefined) return true    
    if(Array.isArray(value) && value.length==0) return true
    if(typeof(value)=="object" && Object.keys(value).length==0) return true
    return false
} 

/**
 * 深度合并对象
 * 
 * 注意：
 *  - 不会对数组成员进行再次遍历
 *  - 不能处理循环引入
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @param {*} options 
 *     array : 数组合并策略，0-替换，1-合并，2-去重合并
 *     mixin : 是否采用混入方式来，=false,  则会创建新对象并返回
 */
function deepMerge(toObj,formObj,options={}){
    let results = options.mixin ? toObj : Object.assign({},toObj)
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 1){//合并
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){//去重合并
                        results[key] = [...new Set([...results[key],...value])]
                    }else{                  //默认： 替换
                        results[key] = value
                    }
                }else{
                    results[key] = deepMerge(results[key],value,options)
                }
            }else{
                results[key] = value
            }
        }else{
            results[key] = value
        }
    })
    return results
}
 
function deepMixin(toObj,formObj,options={}){
    return deepMerge(toObj,formObj,{...options,mixin:true})
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
 * 根据路径获取指定值
 * 只支持简单的.分割路径
 * getByPath({a:{b:1}},"a.b") == 1
 * getByPath({a:{b:1}},"a.c",2) == 2
 * 
 * @param {*} obj 
 * @param {*} path          使用.分割的路径
 * @param {*} defaultValue  默认值
 * @returns 
 */
function getByPath(obj,path,defaultValue){
    if(typeof(obj)!="object" || typeof(path)!="string") return defaultValue
    let paths = path.split(".")
    let cur = obj
    for(let key of paths){
        if(typeof(cur)=="object" && (key in cur) ){
            cur = cur[key]
        }else{
            return defaultValue
        }
    }
    return cur
}
function deepClone(obj){
    if(obj==undefined) return obj
    if (['string',"number","boolean","function","undefined"].includes(typeof(obj))){
        return obj
    }else if(Array.isArray(obj)){
        return obj.map(item => deepClone(item))        
    }else if(typeof(obj)=="object"){
        let results = {}
        Object.entries(obj).forEach(([key,value])=>{
            results[key] = deepClone(value)         
        })
        return results
    }else{
        return obj
    }    
}


/**
 * 替换所有字符串
 * 低版本ES未提供replaceAll,此函数用来替代
 * @param {*} str 
 * @param {*} findValue 
 * @param {*} replaceValue 
 */
function replaceAll(str,findValue,replaceValue){    
    if(typeof(str)!=="string" || findValue=="" || findValue==replaceValue) return str
    try{
        return str.replace(new RegExp(escapeRegexpStr(findValue),"g"),replaceValue)
    }catch{}
    return str
}
/**
 *   使用正则表达式解析非标JOSN
 * 
 */

 const bastardJsonKeyRegex = /(?<value>(?<=:\s*)(\'.*?\')+)|(?<key>(([\w\u4e00-\u9fa5])|(\'.*?\'))+(?=\s*\:))/g

 /**
  * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
  * 
  * 比如  str = "I am {username}"  
  * replace(new RegExp(str),"Tom") !===  I am Tom
  * 
  * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
  * 
  * replace(new RegExp(escapeRegexpStr(str)),"Tom")
  * 
  * 
  * @param {*} str 
  * @returns 
  */
 function escapeRegexpStr(str){
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
 } 
/**
 * 解析非标的JSON字符串为{}
 * 非标的JSON字符串指的是：
 *  - key没有使用使用""包裹
 *  - 字符串value没有使用""包裹
 *  
 * @param {*} str 
 * @returns 
 */
function safeParseJson(str){
    let matched; 
    while ((matched = bastardJsonKeyRegex.exec(str)) !== null) {
        if (matched.index === bastardJsonKeyRegex.lastIndex) {
            bastardJsonKeyRegex.lastIndex++;
        }                
        let item = matched[0]
        if(item.startsWith("'") && item.endsWith("'")){
            item = item.substring(1,item.length-1)
        }
        const findValue =  matched.groups.key ? new RegExp( escapeRegexpStr(matched[0]) + "\s*:") : new RegExp(":\s*" +  escapeRegexpStr(matched[0]))
        const replaceTo = matched.groups.key ? `"${item}":` : `: "${item}"`
        str = str.replace(findValue,replaceTo)
    }
    return JSON.parse(str)
}
const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"]

module.exports ={
    DataTypes,
    isPlainObject,
    isFunction,
    isNumber,
    isNothing,
    deepClone,
    deepMerge,
    deepMixin,
    replaceAll,
    getByPath,
    getDataTypeName, 
    escapeRegexpStr,
    safeParseJson
}