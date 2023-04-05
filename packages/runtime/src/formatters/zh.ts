/**
 *   简体中文格式化器
 * 
 */

import { chineseNumberFormatter,rmbFormater } from "../datatypes/chinese"

import {CN_DATETIME_UNITS, CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES, CN_SHORT_WEEK_DAYS, CN_WEEK_DAYS } from "flex-tools/chinese/consts"


export default  {
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
            },
            relativeTime    : {
                units       : ["秒","分钟","小时","天","周","月","年"],
                now         : "现在",
                before      : "{value}{unit}前",
                after       : "{value}{unit}后"
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
        },
        rmb                 :{
            big             : false,
            prefix          : "",
            unit            : "元",
            suffix          : ""
        }        
    },
    $types: {
        Boolean  : (value:any) =>value ? "是":"否"
    },
    // 中文货币，big=true代表大写形式
    rmb     :   rmbFormater,
    // // 中文数字,如一千二百三十一，或大写数字
    chineseNumber  : chineseNumberFormatter
} 