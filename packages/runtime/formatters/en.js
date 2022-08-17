/**
 *   日期时间格式化器
 * 
 */

 const { toDate,toCurrency,toNumber,formatDatetime,formatTime,Formatter } = require("../utils")



/**
 * 日期格式化器
 *  format取值：
 *  0-local,1-long,2-short,3-iso,4-gmt,5-UTC
 *  或者日期模板字符串
 *   默认值是local
 */
const dateFormatter = Formatter((value,format,$config)=>{
    const optionals = ["local","long","short","iso","gmt","utc"]
    // 处理参数：同时支持大小写名称和数字
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    })
    switch(optionIndex){
        case 0: // local
            return value.toLocaleString()
        case 1: // long
            return formatDatetime(value,$config.long) 
        case 2: // short
            return formatDatetime(value,$config.short) 
        case 3: // ISO
            return value.toISOString()
        case 4: // GMT
            return value.toGMTString()
        case 5: // UTC
            return value.toUTCString()
        default:
            return formatDatetime(value,format) 
    }  
},{  
    normalize: toDate,                       // 转换输入为Date类型
    params   : ['format'],
    configKey: "datetime.date"
})
// 季度格式化器 format= 0=短格式  1=长格式  
const quarterFormatter = Formatter((value,format,$config)=>{
    const month = value.getMonth() + 1 
    const quarter = Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) ))
    if(format<0 && format>1) format = 0
    return format==0 ? $config.shortNames[month] : (format==1 ? $config.shortNames[month] : month+1)
},{  
    normalize: toDate,                      
    params   : ['format'],
    configKey: "datetime.quarter"
})

// 月份格式化器 format可以取值0,1,2，也可以取字符串long,short,number
const monthFormatter = Formatter((value,format,$config)=>{
    const month = value.getMonth() 
    if(typeof(format)==='string'){ 
        format = ['long','short','number'].indexOf(format)        
    }
    if(format<0 && format>2) format = 0
    return format==0 ? $config.names[month] : (format==1 ? $config.shortNames[month] : month+1)
},{  
    normalize: toDate,                      
    params   : ['format'],
    configKey: "datetime.month"
})

// 星期x格式化器  format可以取值0,1,2，也可以取字符串long,short,number
const weekdayFormatter = Formatter((value,format,$config)=>{
    const day = value.getDay()
    if(typeof(format)==='string'){ 
        format = ['long','short','number'].indexOf(format)        
    }
    if(format<0 && format>2) format = 0
    return format==0 ? $config.names[day] : (format==1 ? $config.shortNames[day] : day)
},{  
    normalize: toDate,                       
    params   : ['format'],
    configKey: "datetime.weekday"
})


// 时间格式化器 format可以取值0-local(默认),1-long,2-short,3-timestamp,也可以是一个插值表达式
const timeFormatter = Formatter((value,format,$config)=>{
    const optionals = ['local','long','short','timestamp']      
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    })
    switch(optionIndex){
        case 0: // local : toLocaleTimeString
            return value.toLocaleTimeString()
        case 1: // long
            return formatTime(value,$config.long) 
        case 2: // short
            return formatTime(value,$config.short) 
        case 3: // timestamp
            return value.getTime()
        default:
            return formatTime(value,format) 
    }  
},{  
    normalize: toDate,                       
    params   : ['format'],
    configKey: "datetime.time"
})

// 货币格式化器, CNY $13,456.00 
const currencyFormatter = Formatter((value, symbol,prefix ,suffix, division,precision) =>{
    return toCurrency(value, { symbol,division, prefix, precision,suffix })
},{
    normalize: toNumber,
    params:["symbol","prefix","suffix", "division","precision"],
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
                names  : ["Q1","Q2","Q3","Q4"],
                shortNames  : ["Q1","Q2","Q3","Q4"]
            },
            month:{
                names       : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                shortNames  : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                format      : 0           // 0-长名称，1-短名称，2-数字
            },
            weekday:{
                names       :["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                shortNames  : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
                format      : 0,            // 0-长名称，1-短名称，2-数字   
            },       
            time            : {
                long        : "HH:mm:ss",
                short       : "HH:mm:ss",
                format      : 'local'
            },   
        },
        currency          : {
            units         : ["","Thousands","Millions","Billions","Trillions"],    //千,百万,十亿,万亿
            default       : "{symbol}{value}{unit}",
            long          : "{prefix} {symbol}{value}{unit}{suffix}", 
            short         : "{symbol}{value}{unit}",
            symbol        : "$",                     // 符号
            prefix        : "",                      // 前缀
            suffix        : "",                      // 后缀
            division      : 3,                       // ,分割位
            precision     : 2,                       // 精度            
            
        },
        number            : {
            division      : 3,
            precision     : 2
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
            //brief: ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
            //whole:["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
            //precision: 2 // 小数精度
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Date     : dateFormatter,
        //value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
        Null     : value =>"",
        Undefined: value =>"",
        Error    : value => "ERROR",
        Boolean  : value =>value ? "True":"False"                
    },
    // 以下是格式化定义
    // ******************* 日期 *******************
    date          : dateFormatter,
    time          : timeFormatter,
    year          : value => toDate(value).getFullYear(),
    month         : value => toDate(value).getMonth() + 1,
    day           : value => toDate(value).getDate(),
    weekday       : weekdayFormatter,
    month         : monthFormatter,
    // ******************* 时间 *******************
    hour          : value => toDate(value).getHours(),
    hour12        : value => {const hour = toDate(value).getHours(); return hour > 12 ? hour - 12 : thour},
    minute        : value => toDate(value).getMinutes(),
    second        : value => toDate(value).getSeconds(),
    millisecond   : value => toDate(value).getMilliseconds(),
    timestamp     : value => toDate(value).getTime(),
    // ******************* 货币 ******************* 
    currency     : currencyFormatter,
    // 数字,如，使用分割符
    number       : (value, division = 3,precision = 0) => toCurrency(value, { division, precision})
} 