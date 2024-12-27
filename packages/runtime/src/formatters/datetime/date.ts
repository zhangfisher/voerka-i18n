import { createFormatter } from "../../scope/mixins/formatter/utils"
import { toDate } from "../../utils/toDate" 
import { formatDateTime } from "flex-tools/misc/formatDateTime" 

export type DateFormatterConfig = {
    format: 'long' | 'short' | 'local' | 'iso' | 'utc' | 'gmt' | string | ((date:Date)=>string)    
    long  : string
    short : string   
    [key: string]: string | ((date: Date) => string)
}


export type DateFormatterArgs = {
    format?: string
}

const transformers =  {
    local: (value:any)=>value.toLocaleString(),
    iso  : (value:any)=>value.toISOString(),
    utc  : (value:any)=>value.toUTCString(),
    gmt  : (value:any)=>value.toGMTString()    
}  

export const dateFormatter = createFormatter<DateFormatterArgs,DateFormatterConfig>(({getLanguageConfig})=>{
    return {
        global : true,
        name   : "date",
        args   : [ "format" ],
        default: { 
            format : "local" 
        },
        next(value:any,args){         
            const dateValue = toDate(value) 
            const options   = getLanguageConfig("date")
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
        long        : 'YYYY/MM/DD HH:mm:ss', 
        short       : "YYYY/MM/DD",
        format      : "local" 
    },
    zh:{ 
        long        : 'YYYY年M月D日 HH点mm分ss秒',       
        short       : "YYYY年M月D日",                          
        format      : 'local' 
    }
})
 