const { toNumber,isFunction } = require("../utils")


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
  *  为什么不使用 {value | dict({1:"one",2:"two",3:"three",4:"four"})}的形式更加自然？
  * 
  *  因为我们是采用正则表达式来对格式化器的语法进行解释的，目前无法支持复杂的数据类型，只能支持简单的形式
  * 
  * 
  * @param {*} value 
  * @param  {...any} args 
  * @returns 
  */
 function dict(value, ...args) {
     for (let i = 0; i < args.length; i += 2) {
         if (args[i] === value) {
             return args[i + 1]
         }
     }
     if (args.length > 0 && (args.length % 2 !== 0)) return args[args.length - 1]
     return value
 }
 
/**
 * 
 * 空值： null,undefined
 * 
 * 当输入空值时的处理逻辑
 * 
 * { value | empty }  ==  转换显示为''，并且忽略
 * { value | empty('无') }  == 无
 * { value | unit('KB') | empty('0') } ==  0KB     
 * 
 * 有时在处理其他类型时，可能希望将0或者''也视为空值 
 * { value | empty('没钱了') } == 
 * 
 * 
 * @param {*} value 
 * @param {String} escapeValue
 * @paran {String} next 下一步行为，取值true/false,break,skip,默认是break
 * @param {*} config 
 */
 function empty(value,escapeValue,next,config) {
    if(next===false) next = 'break'
    if(next===true) next = 'skip'
    let opts = Object.assign({escape:"",next:'break',values:[]},config.empty || {})             
    if(escapeValue!=undefined) opts.escape = escapeValue
    let emptyValues = [undefined,null]
    if(Array.isArray(opts.values)) emptyValues.push(...opts.values)    
    if(emptyValues.includes(value)){                  
        return {value:opts.escape,next: opts.next}
    }else{
        return value
    }
}
empty.paramCount = 2 

/**
* 当执行格式化器出错时的显示内容.

{ value | error }                       ==  默认
{ value | error('') }                   == 显示空字符串
{ value | error('ERROR') }              == 显示ERROR字样
{ value | error('ERROR:{ message}') }   == 显示error.message
{ value | error('ERROR:{ error}') }     == 显示error.constructor.name
{ value | error('ERROR:{ error}',) }     == 显示error.constructor.name


 * @param {*} value 
 * @param {*} escapeValue 
 * @param {*} next   下一步的行为，取值，break,ignore
 * @param {*} config 格式化器的全局配置参数
 * @returns 
 */
function error(value,escapeValue,next,config) {    
    if(value instanceof Error){     
        if(scope.debug) console.error(`Error while execute formatter<${value.formatter}>:`,e)
        const scope = this
        try{
            let opts = Object.assign({escape:null,next:'break'},config.error || {})
            if(escapeValue!=undefined) opts.escape = escapeValue
            if(next!=undefined) opts.next = next
            return {
                value : opts.escape ? String(opts.escape).replace(/\{\s*message\s*\}/g,value.message).replace(/\{\s*error\s*\}/g,value.constructor.name) : null,
                next  : opts.next
            }
        }catch(e){
            if(scope.debug) console.error(`Error while execute formatter:`,e.message)
        } 
        return value
    }else{
        return value
    }
}
error.paramCount = 2            // 声明该格式化器支持两个参数 

/**
 * 添加前缀
 * @param {*} value 
 * @param {*} prefix 
 * @returns 
 */
function prefix(value,prefix="") {
    return prefix ?  `${prefix}${value}` : value
}
/**
 * 添加后缀
 * @param {*} value 
 * @param {*} suffix 
 * @returns 
 */
function suffix(value,suffix="") {
    return suffix ?  `${value}${suffix}` : value
}

 const FILE_SIZE_SECTIONS = [
    0,
    1024,
    1048576,
    1073741824,
    1099511627776,
    1125899906842624,
    1152921504606847000,
    1.1805916207174113e+21,
    1.2089258196146292e+24,
    1.2379400392853803e+27,
    1.2676506002282294e+30
  ]
const FILE_SIZE_BRIEF_UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"] 
const FILE_SIZE_WHOLE_UNITS = ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"]

/**
 * 输出文件大小
 *
 * { value | fileSize }  
 * { value | fileSize('KB') }  
 * { value | fileSize('MB') }  
 * 
 * @param {*} value 
 * @param {*} unit   单位，未指定时采用自动方式，即<1024用字节，1024<v<1024*1024显示KB,...
 * @param {*} brief 
 * @param {*} options 
 */
function filesize(value,unit,brief=true,options={}){
    let opts = Object.assign({
        precision: 2,
        brief    : FILE_SIZE_BRIEF_UNITS,
        whole    : FILE_SIZE_WHOLE_UNITS
    },options.fileSize || {})
    let v = toNumber(value)
    let unitIndex
    if(unit==undefined || unit=="auto"){
        unitIndex = FILE_SIZE_SECTIONS.findIndex(x=>v<x) - 1
    }else{
        unit = unit.toUpperCase()
        unitIndex =["B","BYTE","BYTES"].includes(unit) ? 0 : FILE_SIZE_BRIEF_UNITS.indexOf(unit)
    }
    if(unitIndex<0 || unitIndex>=FILE_SIZE_BRIEF_UNITS.length) unitIndex= 0
    let result = (unitIndex == 0 ? v : v / FILE_SIZE_SECTIONS[unitIndex]).toFixed(opts.precision)
    if( unitIndex>0 && (v % FILE_SIZE_SECTIONS[unitIndex])!==0) result = result+"+" 
    // 去除尾部的0
    while(["0","."].includes(result[result.length-1])){
        result = result.substring(0, result.length-2) 
    } 
    return  brief ? `${result} ${opts.brief[unitIndex]}` : `${result} ${opts.brief[whole]}`
}
filesize.paramCount = 2 




module.exports = {
    dict,
    prefix,
    suffix,
    filesize,
    error,
    empty
}

