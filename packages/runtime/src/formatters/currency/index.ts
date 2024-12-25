
import { toCurrency } from "../../utils/toCurrency"
import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"
import options  from "./options" 
import { CurrencyArgs, CurrencyOptions } from "./types"
import { Dict } from "../../types"
 

export default createFormatter<CurrencyArgs,CurrencyOptions>((scope: VoerkaI18nScope,{getActiveOptions})=>{
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
            const options = getActiveOptions()
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
            return toCurrency(value, args,getActiveOptions())
        }
    } 
},options as unknown as Dict<CurrencyOptions>)

