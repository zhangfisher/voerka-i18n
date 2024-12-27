import { createFormatter } from "../../scope/mixins/formatter/utils"
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

export const timeFormatter =  createFormatter<TimeFormatterArgs,TimeFormatterConfig>(({ getLanguageConfig })=>{
    return {
        name   : "time",
        args   : [ "format" ],
        default: { 
            format : "local" 
        },
        next(value:any,args){              
            const dateValue = toDate(value)
            const options   = getLanguageConfig("time")
            const format    = args.format || 'local'
            if( format in transformers ){
                return (transformers as any)[format](dateValue)
            }else if(format in options){
                const formatVal = options[format] 
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
 