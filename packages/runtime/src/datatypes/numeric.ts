/***
 * 
 * 处理数字相关
 * 
 * { value | number }
 * { value | number('default') }
 * { value | number('regular') }
 * { value | number('big') }
 * 
 */
import { toNumber } from "../utils"
import { IFormatter } from "../formatter"
import { toCurrency } from "./currency"
import { VoerkaI18nFormatter } from '../types';

export const numberFormartter = Formatter(function(value:any,[precision,division]:[number,number],$config:any){
    return toCurrency(value, { division, precision},$config)
},{
    normalize: toNumber,
    params:["precision","division"],
    configKey: "number"
}) as VoerkaI18nFormatter

 