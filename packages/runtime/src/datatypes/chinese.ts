/**
 * 
 * 处理中文数字和货币相关
 * 
 */


import { FlexFormatter, Formatter } from '../formatter'
import { toChineseNumber } from "flex-tools/chinese/toChineseNumber"
import { toChineseCurrency } from "flex-tools/chinese/toChineseCurrency"


export const chineseNumberFormatter = Formatter<any,[isBig: boolean]>((value: any, [isBig], config: any) => {
    return toChineseNumber(value, isBig) as string
}, {
    params: ["isBig"]
})


export const rmbFormater = FlexFormatter((value:number | string, [params] : any[], $config:any) => {
    return toChineseCurrency(value, params, $config)
}, {
    params: ["big", "prefix", "unit", "suffix"],
    configKey: "rmb"
})
