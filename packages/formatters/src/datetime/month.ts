import { createFormatter } from "../utils"
import { toDate } from "../utils/toDate" 
import { CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES } from "flex-tools/chinese"

export type MonthFormatterConfig = {
    format: 'long' | 'short' | string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}


export type MonthFormatterArgs = {
    format: string
}

export const monthFormatter = createFormatter<MonthFormatterArgs,MonthFormatterConfig>({
        name   : "month",
        args   : [ "format" ],
        default: { 
            format : "long" 
        },
        next(value,args,ctx){
            const config = ctx.getConfig()
            const month   = toDate(value).getMonth() + 1
            const format  = args.format || 'long'
            if( typeof(format)==='string' && format in config ){
                const formatVal = (config as any)[format]
                if(typeof formatVal === 'function'){
                    return (formatVal as any)(month)
                }else{
                    return formatVal[month]
                }                    
            }
            return month 
        }
    },{
    en:{ 
        long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        format      : "long"           // 0-长名称，1-短名称，2-数字
    },
    zh:{ 
        long        : CN_MONTH_NAMES,
        short       : CN_SHORT_MONTH_NAMES,
        format      : "long",           // 0-长名称，1-短名称，2-数字
    }
})
 