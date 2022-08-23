/**
 *   日期时间格式化器
 * 
 */

const { isFunction,isPlainObject} = require("../utils")
const { toDate,formatDatetime,formatTime,createDateTimeFormatter } = require("../datatypes/datetime")
const { Formatter } = require("../formatter")

const { toCurrency } = require("../datatypes/currency")
const { toNumber,numberFormartter } = require("../datatypes/numeric")





/**
 * 日期格式化器
 *  - format取值：local,long,short,iso,gmt,utc,<模板字符串>
 *  - 默认值由$config.datetime.date.format指定
 */
const dateFormatter = createDateTimeFormatter({
    normalize: toDate,
    params   : ["format"],
    configKey: "datetime.date",
    presets  : {
        local: value=>value.toLocaleString(),
        iso  : value=>value.toISOString(),
        utc  : value=>value.toUTCString(),
        gmt  : value=>value.toGMTString()
    }
},formatDatetime)


/**
 *  季度格式化器
 *  - format: long,short,number
 *  - 默认值是 short
 */
const quarterFormatter = createDateTimeFormatter({
    normalize : value=>{
        const month = value.getMonth() + 1 
        return Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) ))
    },
    params   : ["format"],
    configKey: "datetime.quarter"
},(quarter,format)=>format[quarter-1]) 

/**
 *  月份格式化器
 *  - format: long,short,number
 *  - 默认值是 short
 */
const monthFormatter = createDateTimeFormatter({
    normalize: value=> value.getMonth() + 1, 
    params   : ["format"],
    configKey: "datetime.month"
},(month,format)=>format[month-1]) 

/**
 *  周格式化器
 *  - format: long,short,number
 *  - 默认值是 long
 */
const weekdayFormatter = createDateTimeFormatter({
    normalize: value=> value.getDay(), 
    params   : ["format"],
    configKey: "datetime.weekday"
},(day,format)=>format[day]) 

/**
 * 时间格式化器
 *  - format取值：local,long,short,timestamp,<模板字符串>
 *  - 默认值由$config.datetime.time.format指定
 */
 const timeFormatter = createDateTimeFormatter({
    normalize    : toDate,
    params       : ["format"],
    configKey    : "datetime.time",
    presets      : {
        local    : value=>value.toLocaleTimeString(), 
        timestamp: value=>value.getTime()
    }
},formatTime) 


// 货币格式化器, CNY $13,456.00 
/**
 * { value | currency }
 * { value | currency('long') }
 * { value | currency('long',1) }  万元
 * { value | currency('long',2) }  亿元
 * { value | currency({symbol,unit,prefix,precision,suffix}) }
 */
const currencyFormatter = Formatter((value,...args) =>{
    // 1. 最后一个参数是格式化器的参数,不同语言不一样
    let $config = args[args.length-1]
    // 2. 从语言配置中读取默认参数
    let params = {  
        unit          : 0,         
        radix         : $config.radix,                          // 进制，取值,0-4,
        symbol        : $config.symbol,                         // 符号,即三位一进制，中文是是4位一进
        prefix        : $config.prefix,                         // 前缀
        suffix        : $config.suffix,                         // 后缀
        division      : $config.division,                       // ,分割位
        precision     : $config.precision,                      // 精度     
        format        : $config.format,                         // 模板字符串
    }   
    // 3. 从格式化器中传入的参数具有最高优先级，覆盖默认参数
    if(args.length==1) {   // 无参调用
        Object.assign(params,{format:'default'})
    }else if(args.length==2 && isPlainObject(args[0])){       // 一个参数且是{}
        Object.assign(params,{format:$config.custom},args[0])
    }else if(args.length==2){            
        // 一个字符串参数，只能是default,long,short, 或者是一个模板字符串，如"{symbol}{value}{unit}"
        Object.assign(params,{format:args[0]})            
    }else if(args.length==3){// 2个参数，分别是format,unit
        Object.assign(params,{format:args[0],unit:args[1]})
    }else if(args.length==4){// 3个参数，分别是format,unit,precision
        Object.assign(params,{format:args[0],unit:args[1],precision:args[2]})
    }   
    // 4. 检查参数正确性
    params.unit = parseInt(params.unit) || 0
    if(params.unit>4) params.unit = 4
    if(params.unit<0) params.unit = 0
    // 当指定unit大于0时取消小数点精度控制
    // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
    // 将params.precision=0取消精度限制就可以显示1234.567899万，从而保证完整的精度
    // 除非显示将precision设置为>2的值
    if(params.unit>0 && params.precision==2){
        params.precision = 0
    }

    // 模板字符串
    if(params.format in $config){
        params.format = $config[params.format]
    }     
    params.unitName =(Array.isArray($config.units) && params.unit> 0 && params.unit<$config.units.length) ? $config.units[params.unit] : ""
    return toCurrency(value,params)
},{
    normalize: toNumber, 
    configKey: "currency"
}) 


module.exports =   {
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
                lowerCases   : ["am","pm"],
                upperCases   : ["AM","PM"]
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
            precision     : 0,                      // 精度，即保留小数点位置,0代表不限  
            default       : null,                   // 默认数字写法          
            regular       : null,                   // 正规数字，不同的语言可能理解不一样,在中文中对应一、二、三
            big           : null                    // 正则数字，在中文中对应的是大写壹、貳、參
        },
        empty:{
            //values        : [],                   // 可选，定义空值，如果想让0,''也为空值，可以指定values=[0,'']
            escape        : "",                     // 当空值时显示的备用值
            next          : 'break'                 // 当空值时下一步的行为: break=中止;skip=跳过
        },
        error             : {
            //当错误时显示的内容，支持的插值变量有message=错误信息,error=错误类名,也可以是一个返回上面内容的同步函数
            escape        : null,                   // 默认当错误时显示空内容
            next          : 'break'                 // 当出错时下一步的行为: break=中止;skip=忽略
        },
        fileSize:{
            brief: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
            whole:["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
            precision: 2 // 小数精度
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Date     : dateFormatter,
        Null     : value =>"",
        Undefined: value =>"",
        Error    : value => "ERROR",
        Boolean  : value =>value ? "True":"False"                
    },
    // 以下是格式化定义
    // ******************* 日期 *******************
    date          : dateFormatter,
    year          : value => toDate(value).getFullYear(),
    quarter       : quarterFormatter,
    month         : monthFormatter,
    weekday       : weekdayFormatter,
    // ******************* 时间 *******************
    time          : timeFormatter,
    // ******************* 货币 ******************* 
    currency     : currencyFormatter,
    // 数字,如，使用分割符
    number       : numberFormartter
} 