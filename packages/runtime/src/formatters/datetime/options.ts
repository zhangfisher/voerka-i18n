import {CN_DATETIME_UNITS, CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES, CN_SHORT_WEEK_DAYS, CN_WEEK_DAYS } from "flex-tools/chinese/consts"

export default {
    en:{
        units           : ["Year","Quarter","Month","Week","Day","Hour","Minute","Second","Millisecond","Microsecond"],
        date            :{
            long        : 'YYYY/MM/DD HH:mm:ss', 
            short       : "YYYY/MM/DD",
            format      : "local"
        },
        quarter         : {
            long        : ["First Quarter","Second Quarter","Third Quarter","Fourth Quarter"],
            short       : ["Q1","Q2","Q3","Q4"],
            format      : "short"
        },
        month:{
            long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
            format      : "long"           // 0-长名称，1-短名称，2-数字
        },
        weekday:{
            long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            format      : "long",            // 0-长名称，1-短名称，2-数字   
        },       
        time            : {
            long        : "HH:mm:ss",
            short       : "HH:mm:ss",
            format      : 'local'
        },
        timeSlots       : {
            slots       : [12],
            lowerCases  : ["am","pm"],
            upperCases  : ["AM","PM"]
        }, 
        relativeTime    : {
            units       : ["seconds","minutes","hours","days","weeks","months","years"],
            now         : "Just now",
            before      : "{value} {unit} ago",
            after       : "after {value} {unit}"
        }
    },
    zh:{
        units         : CN_DATETIME_UNITS,
        date            :{
            long        : 'YYYY年M月D日 HH点mm分ss秒',       
            short       : "YYYY年M月D日",                          
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
            units       : ["秒","分钟","小时","天","周","个月","年"],
            now         : "刚刚",
            before      : "{value}{unit}前",
            after       : "{value}{unit}后"
        }
    }
}