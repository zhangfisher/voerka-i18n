/**
 *   日期时间格式化器
 * 
 */
 

import { dateFormatter,quarterFormatter,monthFormatter,weekdayFormatter,timeFormatter,relativeTimeFormatter } from "../datatypes/datetime"
import { numberFormartter } from "../datatypes/numeric"
import { currencyFormatter } from "../datatypes/currency"



// 货币格式化器, CNY $13,456.00 
/**
 * { value | currency }
 * { value | currency('long') }
 * { value | currency('long',1) }  万元
 * { value | currency('long',2) }  亿元
 * { value | currency({symbol,unit,prefix,precision,suffix}) }
 */
// const currencyFormatter = Formatter((value,...args) =>{
//     // 1. 最后一个参数是格式化器的参数,不同语言不一样
//     let $config = args[args.length-1]
//     // 2. 从语言配置中读取默认参数
//     let params = {  
//         unit          : 0,         
//         radix         : $config.radix,                          // 进制，取值,0-4,
//         symbol        : $config.symbol,                         // 符号,即三位一进制，中文是是4位一进
//         prefix        : $config.prefix,                         // 前缀
//         suffix        : $config.suffix,                         // 后缀
//         division      : $config.division,                       // ,分割位
//         precision     : $config.precision,                      // 精度     
//         format        : $config.format,                         // 模板字符串
//     }   
//     // 3. 从格式化器中传入的参数具有最高优先级，覆盖默认参数
//     if(args.length==1) {   // 无参调用
//         Object.assign(params,{format:'default'})
//     }else if(args.length==2 && isPlainObject(args[0])){       // 一个参数且是{}
//         Object.assign(params,{format:$config.custom},args[0])
//     }else if(args.length==2){            
//         // 一个字符串参数，只能是default,long,short, 或者是一个模板字符串，如"{symbol}{value}{unit}"
//         Object.assign(params,{format:args[0]})            
//     }else if(args.length==3){// 2个参数，分别是format,unit
//         Object.assign(params,{format:args[0],unit:args[1]})
//     }else if(args.length==4){// 3个参数，分别是format,unit,precision
//         Object.assign(params,{format:args[0],unit:args[1],precision:args[2]})
//     }   
//     // 4. 检查参数正确性
//     params.unit = parseInt(params.unit) || 0
//     if(params.unit>4) params.unit = 4
//     if(params.unit<0) params.unit = 0
//     // 当指定unit大于0时取消小数点精度控制
//     // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
//     // 将params.precision=0取消精度限制就可以显示1234.567899万，从而保证完整的精度
//     // 除非显示将precision设置为>2的值
//     if(params.unit>0 && params.precision==2){
//         params.precision = 0
//     }

//     // 模板字符串
//     if(params.format in $config){
//         params.format = $config[params.format]
//     }     
//     params.unitName =(Array.isArray($config.units) && params.unit> 0 && params.unit<$config.units.length) ? $config.units[params.unit] : ""
//     return toCurrency(value,params)
// },{
//     normalize: toNumber, 
//     configKey: "currency"
// }) 


export default {
    // 配置参数
    $config:{
        datetime            : {
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
        currency          : {
            default       : "{symbol}{value}{unit}",
            long          : "{prefix} {symbol}{value}{unit}{suffix}", 
            short         : "{symbol}{value}{unit}",
            custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
            format        : "default",
            //--
            units         : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
            radix         : 3,                       // 进制，即三位一进，中文是4位一进
            symbol        : "$",                     // 符号
            prefix        : "USD",                   // 前缀
            suffix        : "",                      // 后缀
            division      : 3,                       // ,分割位
            precision     : 2,                       // 精度             
        },
        number            : {
            division      : 3,                      // , 分割位，3代表每3位添加一个, 
            precision     : -1                      // 精度，即保留小数点位置,-1代表保留所有小数位数 
        },
        fileSize:{
            brief    : ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
            whole    : ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
            precision: 2 // 小数精度
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Null     : (value: any) =>"",
        Undefined: (value: any) =>"",
        Error    : (value: any) => "ERROR",
        Boolean  : (value: any) =>value ? "True":"False",
    },
    // 以下是格式化定义
    // ******************* 日期 *******************
    date          : dateFormatter,
    quarter       : quarterFormatter,
    month         : monthFormatter,
    weekday       : weekdayFormatter,
    // ******************* 时间 *******************
    time          : timeFormatter,
    relativeTime  : relativeTimeFormatter,
    // ******************* 货币 ******************* 
    currency     : currencyFormatter,
    // ******************* 数字 ******************* 
    number       : numberFormartter
} 