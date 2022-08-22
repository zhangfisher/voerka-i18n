/**
 *   日期时间格式化器
 * 
 */

 const { toDate,toCurrency,toNumber,isFunction,isPlainObject,formatDatetime,formatTime } = require("../utils")
 const { Formatter } = require("../formatter")


/**
 *   该类型的格式化器具有以下特点：
 *  
 *   1. 接受一个format参数，
 *   2. format参数取值可以是若干预设的值，如long,short等，也可能是一个模板字符串
 *   3. 当format值时，如果定义在$config[configKey]里面，代表了$config[configKey][format]是一个模板字符串
 *   4. 如果!(format in $config[configKey])，则代表format值是一个模板字符串 
 *   5. 如果format in presets, 则要求presets[format ]是一个(value)=>{....}，直接返回
 * 
  **/ 
function createDateTimeFormatter(options={},transformer){
    let opts = Object.assign({presets:{}},options)
    return Formatter((value,format,$config)=>{
        if((format in opts.presets) && isFunction(opts.presets[format])){
            return opts.presets[format](value)
        }else if((format in $config)){
            format = $config[format]
        }else if(format == "number"){
            return value
        }
        try{
            return format==null ? value : transformer(value,format)
        }catch(e){
            return value
        }        
    },opts)
}


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


// const dateFormatter = Formatter((value,format,$config)=>{
//     const optionals = ["local","long","short","iso","gmt","utc"]
//     // 处理参数：同时支持大小写名称和数字
//     const optionIndex = optionals.findIndex((v,i)=>{
//         if(typeof(format)=="string"){
//             return v==format || v== format.toUpperCase()
//         }else if(typeof(format)=="number"){
//             return format === i
//         }
//     })
//     // format名称不是optionals中的一个，并且被配置在$config，则视为扩展预设值
//     if(optionIndex==-1 && typeof(format)=="string" && (format in $config)){
//         format = $config[format]
//     }

//     switch(optionIndex){
//         case 0: // local
//             return value.toLocaleString()
//         case 1: // long
//             return formatDatetime(value,$config.long) 
//         case 2: // short
//             return formatDatetime(value,$config.short) 
//         case 3: // ISO
//             return value.toISOString()
//         case 4: // GMT
//             return value.toGMTString()
//         case 5: // UTC
//             return value.toUTCString()
//         default:
//             return formatDatetime(value,format) 
//     }  
// },{  
//     normalize: toDate,                       // 转换输入为Date类型
//     params   : ['format'],
//     configKey: "datetime.date"
// })
// // 季度格式化器 format= 0=短格式  1=长格式    1=数字  
// const quarterFormatter = Formatter((value,format,$config)=>{
//     const month = value.getMonth() + 1 
//     const quarter = Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) ))
//     if(typeof(format)==='string'){ 
//         format = ['short','long','number'].indexOf(format)        
//     }    
//     if(format<0 && format>2) format = 0
//     return format==0 ? $config.short[quarter] : (format==1 ? $config.long[quarter] : quarter)
// },{  
//     normalize: toDate,                      
//     params   : ['format'],
//     configKey: "datetime.quarter"
// })

// // 月份格式化器 format可以取值0,1,2，也可以取字符串long,short,number
// const monthFormatter = Formatter((value,format,$config)=>{
//     const month = value.getMonth() 
//     if(typeof(format)==='string'){ 
//         format = ['long','short','number'].indexOf(format)        
//     }
//     if(format<0 && format>2) format = 0
//     return format==0 ? $config.long[month] : (format==1 ? $config.short[month] : month+1)
// },{  
//     normalize: toDate,                      
//     params   : ['format'],
//     configKey: "datetime.month"
// })

// // 星期x格式化器  format可以取值0,1,2，也可以取字符串long,short,number
// const weekdayFormatter = Formatter((value,format,$config)=>{
//     const day = value.getDay()
//     if(typeof(format)==='string'){ 
//         format = ['long','short','number'].indexOf(format)        
//     }
//     if(format<0 && format>2) format = 0
//     return format==0 ? $config.long[day] : (format==1 ? $config.short[day] : day)
// },{  
//     normalize: toDate,                       
//     params   : ['format'],
//     configKey: "datetime.weekday"
// })


// // 时间格式化器 format可以取值0-local(默认),1-long,2-short,3-timestamp,也可以是一个插值表达式
// const timeFormatter = Formatter((value,format,$config)=>{
//     const optionals = ['local','long','short','timestamp']      
//     const optionIndex = optionals.findIndex((v,i)=>{
//         if(typeof(format)=="string"){
//             return v==format || v== format.toUpperCase()
//         }else if(typeof(format)=="number"){
//             return format === i
//         }
//     })
//     // format名称不是optionals中的一个，并且被配置在$config，则视为扩展预设值
//     if(optionIndex==-1 && typeof(format)=="string" && (format in $config)){
//         format = $config[format]
//     }
    
//     switch(optionIndex){
//         case 0: // local : toLocaleTimeString
//             return value.toLocaleTimeString()
//         case 1: // long
//             return formatTime(value,$config.long) 
//         case 2: // short
//             return formatTime(value,$config.short) 
//         case 3: // timestamp
//             return value.getTime()
//         default:
//             return formatTime(value,format) 
//     }  
// },{  
//     normalize: toDate,                       
//     params   : ['format'],
//     configKey: "datetime.time"
// })

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
    }else if(args.length==4){// 2个参数，分别是format,unit,precision
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
            timeslots       : {
                slots       : [12],
                lowercase   : ["am","pm"],
                uppercase   : ["AM","PM"]
            }
        },
        currency          : {
            default       : "{symbol}{value}{unit}",
            long          : "{prefix} {symbol}{value}{unit}{suffix}", 
            short         : "{symbol}{value}{unit}",
            custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
            //--
            units         : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
            radix         : 3,                       // 进制，即三位一进制，中文是是4位一进
            symbol        : "$",                     // 符号
            prefix        : "USD",                   // 前缀
            suffix        : "",                      // 后缀
            division      : 3,                       // ,分割位
            precision     : 2,                    // 精度            
            
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
    year          : value => toDate(value).getFullYear(),
    quarter       : quarterFormatter,
    month         : monthFormatter,
    weekday       : weekdayFormatter,
    // ******************* 时间 *******************
    time          : timeFormatter,
    // ******************* 货币 ******************* 
    currency     : currencyFormatter,
    // 数字,如，使用分割符
    number       : (value, division = 3,precision = 0) => toCurrency(value, { division, precision})
} 