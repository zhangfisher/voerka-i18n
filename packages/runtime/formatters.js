/**
 *    内置的格式化器
 * 
 */

const { isNumber } = require("./utils")

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
 * 格式化货币
 * formatCurrency("123456789") == "123,456,789"
 * formatCurrency("123456789",4) == "1,2345,6789" 
 * @param {*} value 
 * @param {*} bit 逗号分割位置
 */
function formatCurrency(value, bit = 3) {
    if (!isNumber(value)) return value

}


/**
 * 格式化日期
 * 将值转换为Date类型
 * @param {*} value  
 */
function toDate(value) {
    try {
        return value instanceof Date ? value : new Date(value)
    } catch {
        return value == undefined ? "" : value
    }
}

function toNumber(value,defualt=0) {
    try {
        if (isNumber(value)) {
            return parseInt(value)
        } else {
            return defualt
        }
    } catch {
        return value == undefined ? "" : value
    }
}

const CHINESE_DIGITS     = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
const CHINESE_UNITS      = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千', '京', '十', '百', '千', '垓']
const CHINESE_BIG_DIGITS = ["零", '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
const CHINESE_BIG_UNITS  = ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億', '拾', '佰', '仟', '兆', '拾', '佰', '仟', '京', '拾', '佰', '仟', '垓']

function toChineseNumber(value,isBig=false) {   
    if(typeof(value)!=="number") return value;

    let [wholeValue,decimalValue] = String(value).split(".") // 处理小数点     
    const DIGITS = isBig ? CHINESE_BIG_DIGITS : CHINESE_DIGITS
    const UNITS = isBig ? CHINESE_BIG_UNITS : CHINESE_UNITS 
    // 整数部份
    let result = ''
    for(let i=wholeValue.length-1; i>=0; i--){
        let bit = parseInt(wholeValue[i])
        let digit = DIGITS[bit]
        let unit = UNITS[wholeValue.length-i-1]
        if(bit==0){
            let preBit =i< wholeValue.length ? parseInt(wholeValue[i+1]) : null// 上一位
            let isKeyBits = ((wholeValue.length-i-1) % 4)==0
            //if(preBit && preBit!=0) result =  "零" + result
            if(preBit && preBit!=0 && !isKeyBits) result =  "零" + result
            if(isKeyBits) result = UNITS[wholeValue.length-i-1] + result
        }else{
            result=`${digit}${unit}` + result
        }        
    } 
    if(isBig){
        result = result.replace("垓京","垓")
                    .replace("京兆","京")
                    .replace("兆億","兆")
                    .replace("億萬","億")
                    .replace("萬仟","萬") 
    }else{
        result = result.replace("垓京","垓")
                    .replace("京兆","京")
                    .replace("兆亿","兆")
                    .replace("亿万","亿")
                    .replace("万千","万") 
        if(result.startsWith("一十")) result=result.substring(1)
    }    
    // 中文数字忽略小数部分
    return result
}
function toChineseBigNumber(value) {
    return toChineseNumber(value,true)
}


/**
 * 转换为货币
 * @param {*} value 
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} unit        货币单位
 * @param {*} precision   小数点精确到几位
 * @returns 
 */
function toCurrency(value,{division=3,unit="",precision=2}={}){
    let [wholeValue,decimalValue] = String(value).split(".")
    let result = [unit]
    for(let i=0;i<wholeValue.length;i++){
        if(((wholeValue.length - i) % division)==0 && i>0) result.push(",")
        result.push(wholeValue[i])
    }
    if(decimalValue){
        result.push(`.${decimalValue}`)
    }
    return result.join("") 
}

/**
 * 转换为中文大写货币
 * @param {*} value 
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} unit        货币单位
 * @param {*} precision   小数点精确到几位
 */
function toChineseCurrency(value,division=3,unit="￥"){
    let result = []
    let v = String(value)
    for(let i=0;i<v.length;i++){
        if(((v.length - i) % division)==0 && i<v.length-1) result.push(",")
        result.push(v[i])
    }
    return unit+result.join("")
}


module.exports = {
    "*": {
        $types: {
            Date: value => {value=toDate(value);return `${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`}
        },
        // 日期
        date         : value => {value=toDate(value);return `${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()}`},
        shortdate    : value => {value=toDate(value);return `${value.getFullYear()}/${value.getMonth() + 1}/${value.getDate()}`},
        time         : value => {value=toDate(value);return `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`},
        shorttime    : value => {value=toDate(value);return `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`},
        year         : value => toDate(value).getFullYear(),
        month        : value => toDate(value).getMonth() + 1,
        day          : value => toDate(value).getDate(),
        weekdayValue : value => toDate(value).getDay(),
        weekday      : value => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][toDate(value).getDay()],
        shortWeekday : value => ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"][toDate(value).getDay()],
        monthName    : value => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][toDate(value).getMonth()]
        shorMonthName: value => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][toDate(value).getMonth()]
        // 时间
        hour         : value => toDate(value).getHours(),
        hour12       : value => toDate(value).getHours()>12 : toDate(value).getHours()-12 : toDate(value).getHours(),
        minute       : value => toDate(value).getMinutes(),
        second       : value => toDate(value).getSeconds(),
        millisecond  : value => toDate(value).getMilliseconds(),
        timestamp    : value => toDate(value).getTime(),
        // 数字 
        number : (value) => toNumber(value),
        error  : (value, tips = 'ERROR') => value instanceof Error ? tips : value,                           
        empty  : (value) => value, 
        capital: value=>value,
        dict,         
    },
    zh: {
        $types: {
            Date: value => `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日 ${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`
        },
        // 日期
        date         : value => `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`,
        weekday      : value => ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][value.getDay()],
        shortWeekDay : value => ["日","一","二","三","四","五","六"][value.getDay()]
        monthName    : value => ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"][value.getMonth()]
        shorMonthName: value => ["一","二","三","四","五","六","七","八","九","十","十一","十二"][value.getMonth()]
        // 时间
        time         : value => `${value.getHours()}点${value.getMinutes()}分${value.getSeconds()}秒`
        // 数字
        number       : (value) => toNumber(value),

        // 货币
        currency: (value) => `￥${value}元`,
    },
en: {
    currency: (value) => {
        return `$${value}`
    }
}
}