
import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"  
import { toDate } from "../../utils/toDate" 
import { CN_MONTH_NAMES, CN_SHORT_MONTH_NAMES, CN_SHORT_WEEK_DAYS, CN_WEEK_DAYS } from "flex-tools/misc/formatDateTime"

export type WeekdayFormatterOptions = {
    format: string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}


export type WeekdayFormatterArgs = {
    format: string
}

export default createFormatter<WeekdayFormatterArgs,WeekdayFormatterOptions>((scope: VoerkaI18nScope,{getActiveOptions})=>{
    return {
        name   : "weekday",
        args   : [ "format" ],
        default: { 
            format : "long" 
        },
        next(value:any,args){              
            try{
                const day   = toDate(value).getDay() + 1
                const options = getActiveOptions()
                const format  = args.format || 'long'
                if( typeof(format)==='string' && format in options ){
                    const formatVal = (options as any)[format]
                    if(typeof formatVal === 'function'){
                        return (formatVal as any)(day)
                    }else{
                        return formatVal[day]
                    }                    
                }
                return day
            }catch(e){                
                return value
            }
        }
    } 
},{
    en:{ 
        long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
        format      : "long",            // 0-长名称，1-短名称，2-数字   
    },
    zh:{ 
        long        : CN_WEEK_DAYS,
        short       : CN_SHORT_WEEK_DAYS,
        format      : "long",            // 0-长名称，1-短名称，2-数字   
    }
})
 