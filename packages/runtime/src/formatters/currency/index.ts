
import { toCurrency } from "./toCurrency" 
import { createFormatter } from "../../formatter" 


export type CurrencyFormatterOptions = {
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


export type CurrencyFormatterArgs = { 
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
 

export default createFormatter<CurrencyFormatterArgs,CurrencyFormatterOptions>(({getLanguageOptions})=>{
    return {
        name   : "currency",
        args   : [ "format", "unit", "precision", "prefix", "suffix", "division", "symbol", "radix" ],
        default: { 
            format   : "default",
            unit     : 0,
            precision: 2,
            prefix   : "USD",
            suffix   : "",
            division : 3,
            symbol   : "$",
            radix    : 3     
        },
        next(value:any,args){
            const options = getLanguageOptions()
            // format可以取预设值的名称，如long,short等    
            if(args.format in options){
                args.format = (options as any)[args.format]
            }
            args.unit = parseInt(String(args.unit)) || 0
            if(args.unit>options.units.length-1) args.unit = options.units.length-1
            if(args.unit<0) args.unit = 0
            // 当指定unit大于0时取消小数点精度控制
            // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
            // 将params.precision=-1取消精度限制就可以显示1234.567899万，从而保证完整的精度
            // 除非显式将precision设置为>2的值
            if(args.unit>0 && args.precision==2){
                args.precision = -1
            }
            return toCurrency(value, args,getLanguageOptions())
        }
    } 
},{
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
} )

