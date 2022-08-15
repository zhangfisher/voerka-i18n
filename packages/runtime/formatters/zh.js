/**
 *   简体中文格式化器
 * 
 */

 const { toChineseCurrency,toChineseNumber,CN_DATETIME_UNITS,CN_WEEK_DAYS,CN_SHORT_WEEK_DAYS, CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES} = require("../cnutils") 
 const { toDate, toCurrency } = require("../utils")
 
module.exports = {
    // 配置参数: 格式化器函数的最后一个参数就是该配置参数
    $config:{
        datetime          : {
            units         : CN_DATETIME_UNITS,
            date            :{
                long        : 'YYYY年MM月DD日 HH点mm分ss秒',       
                short       : "MM/DD",                          
                format      : 'YYYY年MM月DD日 HH点mm分ss秒'
            },
            quarter         : {
                names  : ["一季度","二季度","三季度","四季度"],
                shortNames  : ["Q1","Q2","Q3","Q4"],
                format      : 0           // 0-短格式,1-长格式
            },
            month:{
                names       : CN_MONTH_NAMES,
                shortNames  : CN_SHORT_MONTH_NAMES,
                format      : 0,           // 0-长名称，1-短名称，2-数字
            },
            weekday:{
                names       : CN_WEEK_DAYS,
                shortNames  : CN_SHORT_WEEK_DAYS,
                format      : 0,            // 0-长名称，1-短名称，2-数字   
            },
            time:{
                long        : "HH点mm分ss秒",
                short       : "HH:mm:ss",
            }
        },

        currency          : {
            symbol        : "￥",
            prefix        : "",
            suffix        : "元",
            division      : 4,
            precision     : 2
        },
        number            : {
            division      : 3,
            precision     : 2
        }
    },
    $types: {
        Date: value => {const d = toDate(value);return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}点${d.getMinutes()}分${d.getSeconds()}秒`},
        Boolean  : value =>value ? "是":"否"                

    },
      // 中文货币，big=true代表大写形式
    capitalizeCurrency:(value,big,unit="元",prefix,suffix)=>toChineseCurrency(value,{big,prefix,suffix,unit}),
    // 中文数字,如一千二百三十一
    number:(value,isBig)=>toChineseNumber(value,isBig)
} 