/**
 * 
 * 处理中文数字和货币相关
 * 
 */


import { FlexFormatter, Formatter } from '../formatter'
import { toChineseNumber } from "flex-tools/chinese/toChineseNumber"
import { toChineseCurrency } from "flex-tools/chinese/toChineseCurrency"


export const chineseNumberFormatter = Formatter((value: number, isBig: boolean, $config: any) => {
    return toChineseNumber(value, isBig)
}, {
    params: ["isBig"]
})


export const rmbFormater = FlexFormatter((value:number | string, params : any, $config:any) => {
    return toChineseCurrency(value, params, $config)
}, {
    params: ["big", "prefix", "unit", "suffix"],
    configKey: "rmb"
})
