import { createFormatter } from "../utils/createFormatter"
import { toDate } from "../utils/toDate" 
import { CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES } from "flex-tools/chinese"

type MonthFormatterConfig = {
    format: 'long' | 'short' | string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}

type MonthFormatterArgs = {
    format: string
}

export default createFormatter<MonthFormatterArgs,MonthFormatterConfig>({
        name   : "month",
        args   : [ "format" ], 
        next(value:string,args:MonthFormatterArgs,ctx:any){
            const config = ctx.getConfig()
            const month   = toDate(value).getMonth() + 1
            const format  = args.format ||  config.format
            if( typeof(format)==='string' && format in config ){
                const formatVal = (config as any)[format]
                if(typeof formatVal === 'function'){
                    return (formatVal as any)(month)
                }else{
                    return formatVal[month-1]
                }                    
            }
            return month 
        }
    },{
        "en-US":{ 
            long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        },
        "zh-CN":{ 
            long        : CN_MONTH_NAMES,
            short       : CN_SHORT_MONTH_NAMES,
        }
    },{
        format      : "long",
    })
 