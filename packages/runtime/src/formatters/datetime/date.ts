
import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"  
import { toDate } from "../../utils/toDate" 
import { formatDateTime } from "flex-tools/misc/formatDateTime"

 

export type DateFormatterOptions = {
    format: string | ((date:Date)=>string)    
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

export default createFormatter<DateFormatterArgs,DateFormatterOptions>((scope: VoerkaI18nScope,{getActiveOptions})=>{
    return {
        name   : "date",
        args   : [ "format" ],
        default: { 
            format : "local" 
        },
        next(value:any,args){              
            try{
                const dateValue = toDate(value)
                const options   = getActiveOptions()
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
            }catch(e){                
                return value
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
 