/**
 
    

    格式化器用来对翻译文本内容中的插值变量进行处理

    如何编写格式器请参阅官网！
    
 */


// import { Formatter,FlexFormatter } from "./runtime"
export default {
    // 直接对内置格式化器进行配置，请参阅官网文档
    // $config:{
    //     datetime            : {
    //         units           : ["Year","Quarter","Month","Week","Day","Hour","Minute","Second","Millisecond","Microsecond"],
    //         date            :{
    //             long        : 'YYYY/MM/DD HH:mm:ss', 
    //             short       : "YYYY/MM/DD",
    //             format      : "local"
    //         },
    //         quarter         : {
    //             long        : ["First Quarter","Second Quarter","Third Quarter","Fourth Quarter"],
    //             short       : ["Q1","Q2","Q3","Q4"],
    //             format      : "short"
    //         },
    //         month:{
    //             long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    //             short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    //             format      : "long"           // 0-长名称，1-短名称，2-数字
    //         },
    //         weekday:{
    //             long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    //             short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
    //             format      : "long",            // 0-长名称，1-短名称，2-数字   
    //         },       
    //         time            : {
    //             long        : "HH:mm:ss",
    //             short       : "HH:mm:ss",
    //             format      : 'local'
    //         },
    //         timeSlots       : {
    //             slots       : [12],
    //             lowerCases  : ["am","pm"],
    //             upperCases  : ["AM","PM"]
    //         }, 
    //         relativeTime    : {
    //             units       : ["seconds","minutes","hours","days","weeks","months","years"],
    //             now         : "Now",
    //             before      : "{value} {unit} ago",
    //             after       : "after {value} {unit}"
    //         }
    //     },
    //     currency          : {
    //         default       : "{symbol}{value}{unit}",
    //         long          : "{prefix} {symbol}{value}{unit}{suffix}", 
    //         short         : "{symbol}{value}{unit}",
    //         custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
    //         format        : "default",
    //         //--
    //         units         : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
    //         radix         : 3,                       // 进制，即三位一进，中文是4位一进
    //         symbol        : "$",                     // 符号
    //         prefix        : "USD",                   // 前缀
    //         suffix        : "",                      // 后缀
    //         division      : 3,                       // ,分割位
    //         precision     : 2,                       // 精度 
            
    //     },
    //     number            : {
    //         division      : 3,                      // , 分割位，3代表每3位添加一个, 
    //         precision     : 0                      // 精度，即保留小数点位置,0代表不限 
    //     },
    //     empty:{
    //         //values        : [],                   // 可选，定义空值，如果想让0,''也为空值，可以指定values=[0,'']
    //         escape        : "",                     // 当空值时显示的备用值
    //         next          : 'break'                 // 当空值时下一步的行为: break=中止;skip=跳过
    //     },
    //     error             : {
    //         //当错误时显示的内容，支持的插值变量有message=错误信息,error=错误类名,也可以是一个返回上面内容的同步函数
    //         escape        : null,                   // 默认当错误时显示空内容
    //         next          : 'break'                 // 当出错时下一步的行为: break=中止;skip=忽略
    //     },
    //     fileSize:{
    //         brief    : ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB","NB","DB"],
    //         whole    : ["Bytes", "Kilobytes", "Megabytes", "Gigabytes", "TeraBytes", "PetaBytes", "ExaBytes", "ZetaBytes", "YottaBytes","DoggaBytes"],
    //         precision: 2 // 小数精度
    //     }
    // },
    // 改变特定数据类型的默认格式化器
    // $types:{    
        // Date     : dateFormatter,
        // Null     : value =>"",
        // Undefined: value =>"",
        // Error    : value => "ERROR",
        // Boolean  : value =>value ? "True":"False",
        // Number   : numberFormartter           
    // }
    // 以下可以自定义编写格式化器
    // xxxx        : value => { ... }, 
    // xxxx        : (value,$config) => { ... }, 
    // xxxx        : (value,...args,$config) => { ... }, 
    // xxxx        : Formatter(value,...args,$config) => { ... }, 
    // xxxx        : FlexFormatter(value,params,$config) => { ... }, 
}
