import { VoerkaI18nFormatterContext } from "@/types"
import { toDate } from "../utils/toDate" 
import { formatDateTime } from "flex-tools/misc/formatDateTime" 

type DateFormatterConfig = {
    format: 'long' | 'short' | 'local' | 'iso' | 'utc' | 'gmt' | string | ((date:Date)=>string)    
    long  : string 
    short : string 
    [key: string]: string | ((date: Date) => string)
}

type DateFormatterArgs = {
    format?: string
}

const transformers =  {
    local: (value:any)=>value.toLocaleString(),
    iso  : (value:any)=>value.toISOString(),
    utc  : (value:any)=>value.toUTCString(),
    gmt  : (value:any)=>value.toGMTString()    
}  

export default [
    {
        global : true,
        name   : "date",
        args   : [ "format" ],
        next(value:string,args:DateFormatterArgs,ctx:VoerkaI18nFormatterContext<DateFormatterConfig>){         
            const config   = ctx.getConfig()
            const dateValue = toDate(value) 
            let format :any   = args.format || config.format
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
            long        : 'YYYY/MM/DD HH:mm:ss', 
            short       : "YYYY/MM/DD"
        },
        "zh-CN":{ 
            long        : 'YYYY年M月D日 HH点mm分ss秒',       
            short       : "YYYY年M月D日"
        }
    },{
        format      : 'local'
    }
]
    