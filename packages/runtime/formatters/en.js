/**
 *   日期时间格式化器
 * 
 */

 const { toDate,toCurrency } = require("../utils")
 
 module.exports =   {
    // 配置参数: 格式化器函数的最后一个参数就是该配置参数
    $options:{
        datetime          : {
            units         : ["Year","Quarter","Month","Week","Day","Hour","Minute","Second","Millisecond","Microsecond"],
            weekday       : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortWeekdays : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            monthNames    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shorMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        },
        currency          : {
            unit          : "$",
            prefix        : "",
            suffix        : "",
            division      : 3,
            precision     : 2
        },
        number            : {
            division      : 3,
            precision     : 2
        }
    },
    // 默认数据类型的格式化器
    $types: {
        Date     : value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
        Null     : value =>"",
        Undefined: value =>"",
        Error    : value => "ERROR"
    },
    // 以下是格式化定义
    // 日期
    date          : value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}` },
    shortdate     : value => { const d = toDate(value); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}` },
    time          : value => { const d = toDate(value); return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
    shorttime     : value => { const d = toDate(value); return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` },
    year          : value => toDate(value).getFullYear(),
    month         : value => toDate(value).getMonth() + 1,
    day           : value => toDate(value).getDate(),
    weekdayValue  : value => toDate(value).getDay(),
    weekday       : value => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][toDate(value).getDay()],
    shortWeekday  : value => ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"][toDate(value).getDay()],
    monthName     : value => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][toDate(value).getMonth()],
    shorMonthName : value => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"][toDate(value).getMonth()],
    // 时间
    hour          : value => toDate(value).getHours(),
    hour12        : value => {const hour = toDate(value).getHours(); return hour > 12 ? hour - 12 : thour},
    minute        : value => toDate(value).getMinutes(),
    second        : value => toDate(value).getSeconds(),
    millisecond   : value => toDate(value).getMilliseconds(),
    timestamp     : value => toDate(value).getTime(),
    // 货币
    // 常规货币形式 $111,233.33
    currency     : (value, prefix = "$",suffix="", division = 3,precision = 2) => toCurrency(value, { division, prefix, precision,suffix }),
    // 数字,如，使用分割符
    number       : (value, division = 3,precision = 0) => toCurrency(value, { division, precision})
} 