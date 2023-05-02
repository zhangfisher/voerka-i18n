/**
 
    格式化器用来对翻译文本内容中的插值变量进行处理

    如何编写格式器请参阅官网！
    
 */

 
export default {    
    // global   : true,     // 简单地设置为true,代表当前所有格式化器均注册到全局，false只在当前scope生效        
    // global   : { // 仅将里面的格式化器注册到全局
        // $config:{... }
        // xxxx        : value => { ... }, 
        // xxxx        : (value,$config) => { ... }, 
        // xxxx        : (value,...args,$config) => { ... }, 
        // xxxx        : Formatter(value,...args,$config) => { ... }, 
        // xxxx        : FlexFormatter(value,params,$config) => { ... }, 
    //},       // 是否注册到全局，false只在当前scope生效
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
    //     } 
    // },
    // 改变特定数据类型的默认格式化器
    // $types:{     
        // Null     : value =>"",
        // Undefined: value =>"", 
        // Boolean  : value =>value ? "True":"False", 
    // }
    // 以下可以自定义编写格式化器
    // xxxx        : value => { ... }, 
    // xxxx        : (value,$config) => { ... }, 
    // xxxx        : (value,...args,$config) => { ... }, 
    // xxxx        : Formatter(value,...args,$config) => { ... }, 
    // xxxx        : FlexFormatter(value,params,$config) => { ... }, 
}   
