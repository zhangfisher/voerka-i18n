 
export type CurrencyOptions = {
    default  : string                       // "{symbol}{value}{unit}",
    long     : string                       // "{prefix} {symbol}{value}{unit}{suffix}", 
    short    : string                       // "{symbol}{value}{unit}",
    custom   : string                       // "{prefix} {symbol}{value}{unit}{suffix}", 
    format   : string                       // "default",
    //--
    units    : string[]                     // [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
    radix    : number                       // 进制，即三位一进，中文是4位一进
    symbol   : string                       // "$",符号
    prefix   : string                       // "USD",                   // 前缀
    suffix   : string                       // "",                      // 后缀
    division : number                       // ,分割位
    precision: number                       // 精度           
}


export type CurrencyArgs = { 
    format    : string                       // "default",
    /**
     * 转换数制单位   比如将元转换到万元单位
     * 如果指定了unit单位，0-代表默认，1-N代表将小数点字向后移动radix*unit位
     * 比如 123456789.88   
     * 当unit=1,radix=3时，   == [123456,78988]  // [整数,小数]
     * 当unit=2,radix=3时，   == [123,45678988]  // [整数,小数] 
     */
    
    unit      : number                       // 转换数制单位
    precision?: number                       // 精度           
    prefix?   : string                       // "USD",  前缀
    suffix?   : string                       // "", 后缀
    division? : number                       // ,分割位
    symbol?   : string                       // "$",符号    
    radix?    : number                       // 进制，即三位一进，中文是4位一进
} 
