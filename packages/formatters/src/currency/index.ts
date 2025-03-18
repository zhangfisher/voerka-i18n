
import { toCurrency } from "../utils/toCurrency" 
import { createFormatter } from "../utils/createFormatter"

type CurrencyFormatterConfig = {
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


type CurrencyFormatterArgs = { 
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
} & Record<string,any>
 

export  default createFormatter<CurrencyFormatterArgs,CurrencyFormatterConfig>({
        name   : "currency",
        args   : [ "format", "unit", "precision", "prefix", "suffix", "division", "symbol", "radix" ],
        next(value:string,args:CurrencyFormatterArgs,ctx:any){
            const config = ctx.getConfig()               
            const params = Object.assign({},config, args)
            if (params.format in params) { 
                params.format = (params as any)[params.format]
            }
            params.unit = parseInt(String(params.unit)) || 0
            if (params.unit > params.units.length - 1) params.unit = params.units.length - 1
            if (params.unit < 0) params.unit = 0
            // 当指定unit大于0时取消小数点精度控制
            // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
            // 将params.precision=-1取消精度限制就可以显示1234.567899万，从而保证完整的精度
            // 除非显式将precision设置为>2的值
            if (params.unit > 0 && params.precision == 2) {
                params.precision = -1
            }
            return toCurrency(value,params)
        }
    },{
        "en-US":{
            units    : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
            radix    : 3,                       // 进制，即三位一进，中文是4位一进
            symbol   : "$",                     // 符号
            prefix   : "USD",                   // 前缀
            suffix   : "",                      // 后缀
            division : 3,                       // ,分割位
            precision: 2,                       // 精度             
        },
        "zh-CN":{        
            units    : ["","万","亿","万亿","万万亿"],
            radix    : 4,                       // 进制，即三位一进制，中文是是4位一进
            symbol   : "￥",
            prefix   : "RMB",
            suffix   : "元",
            division : 4,
            precision: 2            
        }    
    },{
        default  : "{symbol}{value}{unit}",
        long     : "{prefix} {symbol}{value}{unit}{suffix}", 
        short    : "{symbol}{value}{unit}",
        custom   : "{prefix} {symbol}{value}{unit}{suffix}",
        format   : "default", 
    })

