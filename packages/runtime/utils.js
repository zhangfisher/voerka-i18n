
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
                    if(options.array === 0){//替换
                        results[key] = value
                    }else if(options.array === 1){//合并
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){//去重合并
                        results[key] = [...new Set([...results[key],...value])]
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
 * 格式化日期
 * 将值转换为Date类型
 * @param {*} value  
 */
function toDate(value) {
    try {
        return value instanceof Date ? value : new Date(value)
    } catch {
        return value
    }
}
/**
 * 转换为数字类型
 */
function toNumber(value,defualt=0) {
    try {
        if (isNumber(value)) {
            return parseFloat(value)
        } else {
            return defualt
        }
    } catch {
        return value 
    }
} 
/**
 * 转换为货币格式
 * 
 * @param {*} value      可以是数字也可以是字符串
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} prefix      前缀
 * @param {*} suffix      后缀
 * @param {*} precision   小数点精确到几位，0-自动
 * @returns 
 */
 function toCurrency(value,{symbol="",division=3,prefix="",precision=0,suffix=""}={}){
    let [wholeValue,decimalValue] = String(value).split(".")
    let result = []
    for(let i=0;i<wholeValue.length;i++){
        if(((wholeValue.length - i) % division)==0 && i>0) result.push(",")
        result.push(wholeValue[i])
    }
    if(decimalValue){
        if(precision>0){
            decimalValue = String(parseFloat(`0.${decimalValue}`).toFixed(precision)).split(".")[1]
        }
        result.push(`.${decimalValue}`)
    }
    return `${prefix}${symbol}${result.join("")}${suffix}`
}

/**
 * 根据路径获取指定值
 * 
 * getByPath({a:{b:1}},"a.b") == 1
 * getByPath({a:{b:1}},"a.c",2) == 2
 * 
 * @param {*} obj 
 * @param {*} path          使用.分割的路径
 * @param {*} defaultValue  默认值
 * @returns 
 */
function getByPath(obj,path,defaultValue){
    if(typeof(obj)!="object") return defaultValue
    let paths = path.split(".")
    let cur = obj
    for(let key of paths){
        if(typeof(cur)=="object" && key in cur ){
            cur = cur[key]
        }else{
            return defaultValue
        }
    }
    return cur
}


// YY	18	年，两位数
// YYYY	2018	年，四位数
// M	1-12	月，从1开始
// MM	01-12	月，两位数字
// MMM	Jan-Dec	月，英文缩写
// D	1-31	日
// DD	01-31	日，两位数
// H	0-23	24小时
// HH	00-23	24小时，两位数
// h	1-12	12小时
// hh	01-12	12小时，两位数
// m	0-59	分钟
// mm	00-59	分钟，两位数
// s	0-59	秒
// ss	00-59	秒，两位数
// S	0-9	毫秒（百），一位数
// SS	00-99	毫秒（十），两位数
// SSS	000-999	毫秒，三位数
// Z	-05:00	UTC偏移
// ZZ	-0500	UTC偏移，两位数
// A	AM / PM	上/下午，大写
// a	am / pm	上/下午，小写
// Do	1st... 31st	月份的日期与序号

function formatDatetime(value,templ="YYYY/MM/DD HH:mm:ss"){
    const v = toDate(value)
    const year =String(v.getFullYear()),month = String(v.getMonth()+1),weekday=String(v.getDay()),day=String(v.getDate())
    const hourNum = v.getHours()
    const hour = String(hourNum).minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds())
    const timezone = v.getTimezoneOffset()
    const vars = [
        ["YYYY", year],                                                 // 2018	年，四位数
        ["YY", year.substring(year.length - 2, year.length)],           // 18	年，两位数        
        ["MMM", ""],                                                    // Jan-Dec	月，英文缩写
        ["MM", month.padStart(2, "0")],                                 // 01-12	月，两位数字
        ["M", month],                                                   // 1-12	月，从1开始
        ["DD", day.padStart(2, "0")],                                   // 01-31	日，两位数
        ["D", day],                                                     // 1-31	日
        ["HH", hour.padStart(2, "0")],                          // 00-23	24小时，两位数
        ["H", hour],                                            // 0-23	24小时
        ["hh", String(hourNum > 12 ? hourNum - 12 : hourNum).padStart(2, "0")],  // 01-12	12小时，两位数
        ["h", String(hourNum > 12 ? hourNum - 12 : hourNum)],                            // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["SS", millisecond.substring(year.length - 2, year.length)],    // 00-99	毫秒（十），两位数
        ["S",millisecond[millisecond.length - 1]],                      // 0-9	毫秒（百），一位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"],                                 // am / pm	上/下午，小写
    ]
    vars.forEach(([key,value])=>result = replaceAll(result,key,value))
    return result
}

function formatTime(value,templ="HH:mm:ss"){
    const v = toDate(value)
    const hourNum = v.getHours()
    const hour = String(hourNum).minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds())
    let result = templ
    const vars = [
        ["HH", hour.padStart(2, "0")],                          // 00-23	24小时，两位数
        ["H", hour],                                            // 0-23	24小时
        ["hh", String(hour > 12 ? hour - 12 : hour).padStart(2, "0")],  // 01-12	12小时，两位数
        ["h", String(hour > 12 ? hour - 12 : hour)],                            // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["SS", millisecond.substring(year.length - 2, year.length)],    // 00-99	毫秒（十），两位数
        ["S",millisecond[millisecond.length - 1]],                      // 0-9	毫秒（百），一位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"]                                  // am / pm	上/下午，小写
    ]
    vars.forEach(([key,value])=>result = replaceAll(result,key,value))
    return result
}
/**
 * 替换所有字符串
 * 低版本ES未提供replaceAll,此函数用来替代
 * 
 * 
 * @param {*} str 
 * @param {*} findValue 
 * @param {*} replaceValue 
 */
function replaceAll(str,findValue,replaceValue){    
    if(typeof(str)!=="string" || findValue=="" || findValue==replaceValue) return str
    let result = str
    try{
        while(result.search(findValue)!=-1){
            result = result.replace(findValue,replaceValue)
        }        
    }catch{}
    return result
}


/**
 * 创建格式化器
 * 
 * 格式化器是一个普通的函数，具有以下特点：
 * 
 * - 函数第一个参数是上一上格式化器的输出
 * - 支持0-N个简单类型的入参
 * - 格式化器可以在格式化器的$config参数指定一个键值来配置不同语言时的参数
 *  
 *   "currency":createFormatter((value,prefix,suffix, division ,precision,options)=>{
 *     // 无论在格式化入参数是多少个，经过处理后在此得到prefix,suffix, division ,precision参数已经是经过处理后的参数
 *     依次读取格式化器的参数合并：
 *       - 从当前激活格式化器的$config中读取配置参数
 *       - 在t函数后传入参数
  *     比如currency格式化器支持4参数，其入参顺序是prefix,suffix, division ,precision
  *     那么在t函数中可以使用以下五种入参数方式
  *      {value | currency }                                    //prefix=undefined,suffix=undefined, division=undefined ,precision=undefined
  *      {value | currency(prefix) }
  *      {value | currency(prefix,suffix) }
  *      {value | currency(prefix,suffix,division)  }
  *      {value | currency(prefix,suffix,division,precision)}
  *    
  * 经过createFormatter处理后，会从当前激活格式化器的$config中读取prefix,suffix, division ,precision参数作为默认参数
  * 然后t函数中的参数会覆盖默认参数，优先级更高
 *      },
 *      {
 *          unit:"$",
 *          prefix,
 *          suffix,
 *          division,
 *          precision
 *      },
 *      {
 *          normalize:value=>{...},
 *          params:["prefix","suffix", "division" ,"precision"]     // 声明参数顺序
 *          configKey:"currency"                                    // 声明特定语言下的配置在$config.currency
 *      }
 *   )
 * 
 * @param {*} fn 
 * @param {*} defaultParams         默认参数
 * @param {*} meta 
 * @returns 
 */
 function createFormatter(fn,defaultParams={},meta={}){
    let opts = Object.assign({
        normalize    : null,         // 对输入值进行规范化处理，如进行时间格式化时，为了提高更好的兼容性，支持数字时间戳/字符串/Date等，需要对输入值进行处理，如强制类型转换等
        params       : [],           // 声明参数顺序
        configKey    : null          // 声明该格式化器在$config中的路径，支持简单的使用.的路径语法
    })     

    // 最后一个参数是传入activeFormatterConfig参数
    const wrappedFn =  function(value,...args){
        let finalValue = value
        // 1. 输入值规范处理，主要是进行类型转换，确保输入的数据类型及相关格式的正确性，提高数据容错性
        if(isFunction(opts.normalize)){
            try{
                finalValue = opts.normalize(finalValue)
            }catch{}
        }
        // 2. 读取activeFormatterConfig
        let activeFormatterConfigs = args.length>0 ? args[args.length-1] : {}
        if(!isPlainObject( activeFormatterConfigs))  activeFormatterConfigs ={}   
        // 3. 从当前语言的激活语言中读取配置参数
        const formatterConfig =Object.assign({},defaultParams,getByPath(activeFormatterConfigs,opts.configKey,{}))
        let finalArgs = opts.params.map(param=>getByPath(formatterConfig,param,undefined))   
        // 4. 将翻译函数执行格式化器时传入的参数覆盖默认参数     
        for(let i =0; i<finalArgs.length-1;i++){
            if(i>=args.length-1) break // 最后一参数是配置
            if(args[i]!==undefined) finalArgs[i] = args[i]
        }
        return fn(finalValue,...finalArgs,activeFormatterConfigs)
    }
    wrappedFn.configurable = true       //  当函数是可配置时才在最后一个参数中传入$config
    return wrappedFn
}

const Formatter = createFormatter

module.exports ={
    isPlainObject,
    isFunction,
    isNumber,
    isNothing,
    deepMerge,
    deepMixin,
    Formatter,
    createFormatter,
    replaceAll,
    getByPath,
    getDataTypeName,
    formatDatetime,
    formatTime,
    toDate,
    toNumber,
    toCurrency,
    createFormatter
}