import { VoerkaI18nFormatterContext } from "@/types"
import { toDate } from "../utils/toDate" 
import { formatDateTime } from "flex-tools/misc/formatDateTime"

type TimeFormatterConfig = {
    format: 'local' | 'timestamp' | 'long'  | 'short' | string | ((date:Date)=>string)    
    long  : string
    short : string   
    [key: string]: string | ((date: Date) => string)
}

type TimeFormatterArgs = {
    format?: string
}

const transformers =  {
    local    : (value:Date)=>value.toLocaleTimeString(), 
    timestamp: (value:Date)=>value.getTime()
}  

export default [
    {
        name   : "time",
        args   : [ "format" ], 
        next(value:string,args:TimeFormatterArgs,ctx:VoerkaI18nFormatterContext<TimeFormatterConfig>){             
            const config   = ctx.getConfig() 
            const dateValue = toDate(value)
            let format:any    = args.format || config.format
            if( format in transformers ){
                return (transformers as any)[format](dateValue)
            }else if(format in config){
                format = config[format] 
                if(typeof format === 'function'){
                    return (format as any)(dateValue)
                }
            }
            if(typeof(format) === 'string'){
                return formatDateTime(dateValue,format)
            }
        }
    },{
        "en-US":{ 
            long        : "HH:mm:ss"
        },
        "zh-CN":{
            long        : "HH点mm分ss秒"
        }
    },{
        format      : 'local',
        short       : "HH:mm:ss"
    }
]
 