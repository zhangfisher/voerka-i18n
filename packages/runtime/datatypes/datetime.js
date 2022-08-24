/**

处理日期时间相关

*/
const { isFunction,replaceAll,toDate } = require('../utils')
const  { Formatter } = require('../formatter');

/**
 * 获取一天中的时间段
 * @param {*} hour        小时，取值0-23
 * @param {*} options 
 * @returns 
 */
function getTimeSlot(hour,caseStyle = 0){
    if(hour<0 && hour>23) hour = 0
    const timeSlots = this.timeSlots
    const slots = [0,...timeSlots.slots,24]
    let slotIndex = slots.findIndex(v=>v>hour) - 1 
    return caseStyle == 0 ? timeSlots.lowerCases[slotIndex] :  timeSlots.upperCases[slotIndex]
}

/**
 * 根据模板格式化日期时间
 * 

    YY	18	年，两位数
    YYYY	2018	年，四位数
    M	1-12	月，从1开始
    MM	01-12	月，两位数字
    MMM	Jan-Dec	月，英文缩写
    D	1-31	日
    DD	01-31	日，两位数
    H	0-23	24小时
    HH	00-23	24小时，两位数
    h	1-12	12小时
    hh	01-12	12小时，两位数
    m	0-59	分钟
    mm	00-59	分钟，两位数
    s	0-59	秒
    ss	00-59	秒，两位数
    S	0-9	毫秒（百），一位数
    SS	00-99	毫秒（十），两位数
    SSS	000-999	毫秒，三位数
    Z	-05:00	UTC偏移
    ZZ	-0500	UTC偏移，两位数
    A	AM / PM	上/下午，大写
    a	am / pm	上/下午，小写
    Do	1st... 31st	月份的日期与序号
    t   小写时间段，如am,pm
    T   大写时间段段，如上午、中午、下午


 * 重点： this-->当前格化器的配置参数
 * 
 * 因此可以通过this.month.long来读取长格式模板
 * 
 * 
 * @param {*} value 
 * @param {*} template 
 * @param {Boolean} onlyTime 仅格式化时间
 * @param {*} options   = {month:[<短月份名称>,<短月份名称>],timeSlots:{}}
 * @returns 
 */
function formatDatetime(value,template="YYYY/MM/DD HH:mm:ss",onlyTime=false){
    const $config = this.datetime// this->指向的是当前语言的格式化化器配置
    const v = toDate(value)
    const hour = v.getHours(),Hour = String(hour).padStart(2, "0")
    const hour12 =  hour > 12 ? hour - 12 : hour ,Hour12 = String(hour12).padStart(2, "0")
    const minute = String(v.getMinutes()),second = String(v.getSeconds()),millisecond=String(v.getMilliseconds())    
    let vars = [        
        ["HH", Hour],                                                   // 00-23	24小时，两位数
        ["H", hour],                                                    // 0-23	24小时
        ["hh", Hour12],                                                 // 01-12	12小时，两位数
        ["h", hour12],                                                  // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"],                                 // am / pm	上/下午，小写
        ["t",  getTimeSlot.call($config,hour,0)],                       // 小写时间段，如上午、中午、下午
        ["T",  getTimeSlot.call($config,hour,1)],                       // 大写时间段，如上午、中午、下午
    ]
    if(!onlyTime){
        const year =String(v.getFullYear()),month = v.getMonth(),weekday=v.getDay(),day=String(v.getDate())
        vars.push(...[
            ["YYYY", year],                                              // 2018	年，四位数
            ["YY", year.substring(2)],                                   // 18年，两位数        
            ["MMM", $config.month.short[month]],                         // Jan-Dec月，缩写
            ["MM", String(month+1).padStart(2, "0")],                      // 01-12月，两位数字
            ["M", month+1],                                              // 1-12	月，从1开始
            ["DD", day.padStart(2, "0")],                                // 01-31	日，两位数
            ["D", day],                                                  // 1-31	日
            ["d",weekday],                                               // 0-6	一周中的一天，星期天是 0
            ["dd",$config.weekday.short[weekday]],                       //	Su-Sa	最简写的星期几
            ["ddd",$config.weekday.short[weekday]],                      //	Sun-Sat	简写的星期几
            ["dddd",$config.weekday.long[weekday]],                      //	Sunday-Saturday	星期几，英文全称
        ])
    }
    let result = template
    vars.forEach(([k,v])=>result = replaceAll(result,k,v))
    return result
}
/**
 * 只格式化时间
 * @param {*} value 
 * @param {*} template 
 * @returns 
 */
function formatTime(value,template="HH:mm:ss"){    
    return formatDatetime.call(this,value,template,true)
}


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
    return Formatter(function(value,format,$config){
        if((format in opts.presets) && isFunction(opts.presets[format])){
            return opts.presets[format](value)
        }else if((format in $config)){
            format = $config[format]
        }else if(format == "number"){
            return value
        }
        try{// this指向的是activeFormatter.$config
            return format==null ? value : transformer.call(this,value,format)
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

/**
 * 返回相对于rel的时间
 * @param {*} value 
 * @param {*} baseTime  基准时间，默认是相对现在
 */
// 对应:秒,分钟,小时,天,周,月,年的毫秒数,月取30天，年取365天概数
const TIME_SECTIONS = [1000,60000,3600000,86400000,604800000,2592000000,31536000000,Number.MAX_SAFE_INTEGER]
const relativeTimeFormatter = Formatter((value,baseTime,$config)=>{    
    const { units,now,before,base = Date.now() , after } = $config
    let ms = value.getTime()
    let msBase = (baseTime instanceof Date) ? baseTime.getTime() : toDate(base).getTime()
    let msDiff = ms - msBase
    let msIndex = TIME_SECTIONS.findIndex(x=>Math.abs(msDiff) <  x) - 1   
    if(msIndex < 0) msIndex = 0
    if(msIndex > TIME_SECTIONS.length-1 ) msIndex = TIME_SECTIONS.length-1
    if(msDiff==0){
        return now
    }else if(msDiff<0){// 之前
        let result = parseInt(Math.abs(msDiff) / TIME_SECTIONS[msIndex])
        return before.replace("{value}",result).replace("{unit}",units[msIndex])
    }else{// 之后
        let result = parseInt(Math.abs(msDiff) / TIME_SECTIONS[msIndex])
        return after.replace("{value}",result).replace("{unit}",units[msIndex])
    }
},{
    normalize:toDate,
    params:["base"],
    configKey:"datetime.relativeTime"
})

module.exports = {
    toDate,
    formatTime,
    formatDatetime,
    createDateTimeFormatter,
    relativeTimeFormatter,
    dateFormatter,
    quarterFormatter,
    monthFormatter,
    weekdayFormatter,
    timeFormatter
}