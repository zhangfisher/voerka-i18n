export default {
    en:{
        default  : "{symbol}{value}{unit}",
        long     : "{prefix} {symbol}{value}{unit}{suffix}", 
        short    : "{symbol}{value}{unit}",
        custom   : "{prefix} {symbol}{value}{unit}{suffix}", 
        format   : "default",
        //--
        units    : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
        radix    : 3,                       // 进制，即三位一进，中文是4位一进
        symbol   : "$",                     // 符号
        prefix   : "USD",                   // 前缀
        suffix   : "",                      // 后缀
        division : 3,                       // ,分割位
        precision: 2,                       // 精度             
    },
    zh:{
        units    : ["","万","亿","万亿","万万亿"],
        radix    : 4,                       // 进制，即三位一进制，中文是是4位一进
        symbol   : "￥",
        prefix   : "RMB",
        suffix   : "元",
        division : 4,
        precision: 2            
    }    
} 