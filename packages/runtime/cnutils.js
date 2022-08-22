/**
 * 
 * 处理中文数字和货币相关
 * 
 */
const { isNumber } = require('./utils')

const CN_DATETIME_UNITS =  ["年","季度","月","周","日","小时","分钟","秒","毫秒","微秒"]
const CN_WEEK_DAYS = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
const CN_SHORT_WEEK_DAYS  =["周日","周一","周二","周三","周四","周五","周六"]
const CN_MONTH_NAMES=  ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
const CN_SHORT_MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]

 const CN_NUMBER_DIGITS     = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
 const CN_NUMBER_UNITS      = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆', '十', '百', '千', '京', '十', '百', '千', '垓']
 const CN_NUMBER_BIG_DIGITS = ["零", '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
 const CN_NUMBER_BIG_UNITS  = ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億', '拾', '佰', '仟', '兆', '拾', '佰', '仟', '京', '拾', '佰', '仟', '垓']
 

 /**
 * 
  * 将数字转换为中文数字
  * 
  * 注意会忽略掉小数点后面的数字
  * 
  * @param {*} value  数字
  * @param {*} isBig 是否大写数字 
  * @returns 
  */
function toChineseNumber(value,isBig) {   
     if(!isNumber(value)) return value;
     let [wholeValue,decimalValue] = String(value).split(".") // 处理小数点     
     const DIGITS = isBig ? CN_NUMBER_BIG_DIGITS : CN_NUMBER_DIGITS
     const UNITS = isBig ? CN_NUMBER_BIG_UNITS : CN_NUMBER_UNITS 
     let result = ''
     if(wholeValue.length==1) return DIGITS[parseInt(wholeValue)]
     for(let i=wholeValue.length-1; i>=0; i--){
         let bit = parseInt(wholeValue[i])
         let digit = DIGITS[bit]
         let unit = UNITS[wholeValue.length-i-1]
         if(bit==0){
             let preBit =i< wholeValue.length ? parseInt(wholeValue[i+1]) : null// 上一位
             let isKeyBits = ((wholeValue.length-i-1) % 4)==0
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
     return result    // 中文数字忽略小数部分
 } 
  
 function toChineseBigNumber(value) {
    return toChineseNumber(value,true)
 }
 /**
  * 转换为中文大写货币
  * @param {*} value 
  * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
  * @param {*} prefix      前缀 
  * @param {*} suffix      后缀
  * @param {*} precision   小数点精确到几位
  */
function toChineseCurrency(value,{big=false,prefix="",unit="元",suffix=""}={}){
    let [wholeValue,decimalValue] = String(value).split(".")
    let result 
    if(big){
        result = toChineseBigNumber(wholeValue)+unit
    }else{
        result = toChineseNumber(wholeValue)+unit
    }    
    if(decimalValue){
        if(decimalValue[0]) result =result+  CN_NUMBER_DIGITS[parseInt(decimalValue[0])]+"角"
        if(decimalValue[1]) result =result+  CN_NUMBER_DIGITS[parseInt(decimalValue[1])]+"分"        
    }
    return prefix+result+suffix
}

 module.exports ={ 
    toChineseCurrency,
    toChineseNumber,
    toChineseBigNumber,
    CN_DATETIME_UNITS,
    CN_WEEK_DAYS,
    CN_SHORT_WEEK_DAYS,
    CN_MONTH_NAMES,
    CN_SHORT_MONTH_NAMES,
    CN_NUMBER_DIGITS,
    CN_NUMBER_UNITS,
    CN_NUMBER_BIG_DIGITS,
    CN_NUMBER_BIG_UNITS
}  