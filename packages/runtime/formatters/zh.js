/**
 *   简体中文格式化器
 * 
 */

const { toChineseCurrency,toChineseNumber,CN_DATETIME_UNITS,CN_WEEK_DAYS,CN_SHORT_WEEK_DAYS, CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES} = require("../cnutils") 

module.exports = {
    // 配置参数: 格式化器函数的最后一个参数就是该配置参数
    $config:{
        datetime          : {
            units         : CN_DATETIME_UNITS,
            date            :{
                long        : 'YYYY年MM月DD日 HH点mm分ss秒',       
                short       : "YYYY/MM/DD",                          
                format      : 'local'
            },
            quarter         : {
                long        : ["一季度","二季度","三季度","四季度"],
                short       : ["Q1","Q2","Q3","Q4"],
                format      : "short"          // 0-短格式,1-长格式,2-数字
            },
            month:{
                long        : CN_MONTH_NAMES,
                short       : CN_SHORT_MONTH_NAMES,
                format      : "long",           // 0-长名称，1-短名称，2-数字
            },
            weekday:{
                long        : CN_WEEK_DAYS,
                short       : CN_SHORT_WEEK_DAYS,
                format      : "long",            // 0-长名称，1-短名称，2-数字   
            },
            time:{
                long        : "HH点mm分ss秒",
                short       : "HH:mm:ss",
                format      : 'local'
            },
            timeSlots       : {
                slots       : [6,9,11,13,18],
                lowerCases  : ["凌晨","早上","上午","中午","下午","晚上"],
                upperCases  : ["凌晨","早上","上午","中午","下午","晚上"]
            }
        },
        currency          : {
            units         : ["","万","亿","万亿","万万亿"],
            radix         : 4,                       // 进制，即三位一进制，中文是是4位一进
            symbol        : "￥",
            prefix        : "RMB",
            suffix        : "元",
            division      : 4,
            precision     : 2            
        },
        number            : {
            division      : 4,
            precision     : 0
        }
    },
    $types: {
        Boolean  : value =>value ? "是":"否"
    },
    // 中文货币，big=true代表大写形式
    rmb     :   (value,big,unit="元",prefix,suffix)=>toChineseCurrency(value,{big,prefix,suffix,unit}),
    // // 中文数字,如一千二百三十一
    chineseNumber  :(value,isBig)=>toChineseNumber(value,isBig)
} 