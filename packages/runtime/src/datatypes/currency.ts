/***
 * 
 * 处理货币相关
 * 
 */

import { toNumber } from '../utils'
import { get as getByPath } from "flex-tools/object/get"
import { isNumber } from "flex-tools/typecheck/isNumber"
import { FlexFormatter }  from "../formatter"

/**
 * 货币格式化器
 */
export const currencyFormatter = FlexFormatter((value:string | number,params:Record<string,any>={},$config:any)=>{
    // format可以取预设值的名称，如long,short等    
    if(params.format in $config){
        params.format = $config[params.format]
    }
    params.unit = parseInt(params.unit) || 0
    if(params.unit>$config.units.length-1) params.unit = $config.units.length-1
    if(params.unit<0) params.unit = 0
    // 当指定unit大于0时取消小数点精度控制
    // 例 value = 12345678.99  默认情况下精度是2,如果unit=1,则显示1234.47+,
    // 将params.precision=-1取消精度限制就可以显示1234.567899万，从而保证完整的精度
    // 除非显式将precision设置为>2的值
    if(params.unit>0 && params.precision==2){
        params.precision = -1
    }
    return toCurrency(value,params,$config)
},{
    normalize: (value:string)=>toNumber(value),
    params : ["format","unit","precision","prefix","suffix","division","symbol","radix"],
    configKey: "currency"
},{
    format:"default",
    unit:0              // 小数点精度控制,0代表不控制
})

 