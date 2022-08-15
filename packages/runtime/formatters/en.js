/**
 *   日期时间格式化器
 * 
 */

 const { toDate,toCurrency,formatDatetime,formatTime,Formatter } = require("../utils")

// 日期格式化器
// format取字符串"long","short","local","iso","gmt","utc"或者日期模块字符串
// { value | date } == '2022/8/15'
// { value | date('long') } == '2022/8/15 12:08:32'
// { value | date('short') } == '8/15'
// { value | date('GMT') } == 'Mon, 15 Aug 2022 06:39:38 GMT'
// { value | date('ISO') } == 'Mon, 15 Aug 2022 06:39:38 ISO'
// { value | date('YYYY-MM-DD HH:mm:ss') } == '2022-8-15 12:08:32'
const dateFormatter = Formatter((value,format,$config)=>{
    const optionals = ["long","short","local","iso","gmt","utc"]
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    })
    switch(optionIndex){
        case 0: // long
            return formatDatetime(value,$config.long) 
        case 1: // short
            return formatDatetime(value,$config.short) 
        case 2: // local
            return value.toLocaleString()
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

// 周格式化器  format可以取值0,1,2，也可以取字符串long,short,number
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


// 时间格式化器 format可以取值0,1,2，也可以取字符串long,short,timestamp,local
const timeFormatter = Formatter((value,format,$config)=>{
    const month = value.getMonth()
    const optionals = ['long','short','timestamp','local']        //toLocaleTimeString
    const optionIndex = optionals.findIndex((v,i)=>{
        if(typeof(format)=="string"){
            return v==format || v== format.toUpperCase()
        }else if(typeof(format)=="number"){
            return format === i
        }
    })
    switch(optionIndex){
        case 0: // long
            return formatTime(value,$config.long) 
        case 1: // short
            return formatTime(value,$config.short) 
        case 2: // timestamp
            return value.getTime()
        case 3: // local
            return value.toLocaleTimeString()
        default:
            return formatTime(value,format) 
    }  
},{  
    normalize: toDate,                       
    params   : ['format'],
    configKey: "datetime.month"
})

// 货币格式化器, CNY $13,456.00 
const currencyFormatter = Formatter((value, unit,prefix ,suffix, division,precision) =>{
    return toCurrency(value, { unit,division, prefix, precision,suffix })
},{
    normalize: toNumber,
    params:["prefix","suffix", "division","precision"],
    configKey: "currency"
}) 

 module.exports =   {
    // 配置参数
    $config:{
        datetime            : {
            units           : ["Year","Quarter","Month","Week","Day","Hour","Minute","Second","Millisecond","Microsecond"],
            date            :{
                long        : 'YYYY/MM/DD HH:mm:ss', 
                short       : "MM/DD",
                format      : "local"
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
        }
        currency          : {
            unit          : "$",                    // 单位
            prefix        : "",                     // 前缀
            suffix        : "",                     // 后缀
            division      : 3,                      // ,分割位
            precision     : 2,                      // 精度
        },
        number            : {
            division      : 3,
            precision     : 2
        },
        empty:{
            //values        : [],               // 可选，定义空值，如果想让0,''也为空值，可以指定values=[0,'']
            escape        : "",                 // 当空值时显示的备用值
            next          : 'break'                // 当空值时下一步的行为: break=中止;skip=跳过
        },
        error             : {
            //当错误时显示的内容，支持的插值变量有message=错误信息,error=错误类名,也可以是一个返回上面内容的同步函数
            escape        : null,                   // 默认当错误时显示空内容
            next          : 'break'                    // 当出错时下一步的行为: break=中止;skip=忽略
        },
        fileSize:{
            //brief: ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
            //whole:["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
            //precision: 2 // 小数精度
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Date     : value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
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