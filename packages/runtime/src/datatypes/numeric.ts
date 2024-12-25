/***
 * 
 *  处理数字相关
 * 
 * { value | number }
 * { value | number('default') }
 * { value | number('regular') }
 * { value | number('big') }
 * 
 */
import { toNumber } from "../utils"
import { toCurrency } from "./currency"
import { VoerkaI18nFormatter } from '../types';
import { Formatter } from "../formatter";

export const numberFormartter = Formatter<any,any[]>(function(value:any,[precision,division],config:Record<string,any>){
    return toCurrency(value, { division, precision},config)
},{
    normalize: toNumber,
    params:["precision","division"],
    configKey: "number"
}) as VoerkaI18nFormatter

 