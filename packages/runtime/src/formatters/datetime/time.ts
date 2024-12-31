import { createFormatter } from "../../formatter/utils"
import { toDate } from "../../utils/toDate" 
import { formatDateTime } from "flex-tools/misc/formatDateTime"

 

export type TimeFormatterConfig = {
    format: 'local' | 'timestamp' | 'long'  | 'short' | string | ((date:Date)=>string)    
    long  : string
    short : string   
    [key: string]: string | ((date: Date) => string)
}


export type TimeFormatterArgs = {
    format?: string
}

const transformers =  {
    local    : (value:Date)=>value.toLocaleTimeString(), 
    timestamp: (value:Date)=>value.getTime()
}  

export const timeFormatter =  createFormatter<TimeFormatterArgs,TimeFormatterConfig>(()=>{
    return {
        name   : "time",
        args   : [ "format" ],
        default: { 
            format : "local" 
        },
        next(value,args,ctx){             
            const config   = ctx.getFormatterConfig<TimeFormatterConfig>("time")
            const dateValue = toDate(value)
            const format    = args.format || 'local'
            if( format in transformers ){
                return (transformers as any)[format](dateValue)
            }else if(format in config){
                const formatVal = config[format] 
                if(typeof formatVal === 'function'){
                    return (formatVal as any)(dateValue)
                }
            }else if(typeof(format) === 'string'){
                return formatDateTime(dateValue,format)
            }
        }
    } 
},{
    en:{ 
        long        : "HH:mm:ss",
        short       : "HH:mm:ss",
        format      : 'local'
    },
    zh:{ 
        long        : "HH点mm分ss秒",
        short       : "HH:mm:ss",
        format      : 'local'
    }
})
 