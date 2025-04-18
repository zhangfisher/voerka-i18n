import { VoerkaI18nFormatterContext } from "@/types"
import { toDate } from "../utils/toDate" 
import { CN_SHORT_WEEK_DAYS, CN_WEEK_DAYS } from "flex-tools/chinese"

type WeekdayFormatterConfig = {
    format: 'long' | 'short' | string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}

type WeekdayFormatterArgs = {
    format: string
}

export default [
    {
        name   : "weekday",
        args   : [ "format" ], 
        next(value:string,args:WeekdayFormatterArgs,ctx:VoerkaI18nFormatterContext<WeekdayFormatterConfig>){
            const options = ctx.getConfig()  
            const day   = toDate(value).getDay()            
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
        }
    },{
        "en-US":{ 
            long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
        },
        "zh-CN":{ 
            long        : CN_WEEK_DAYS,
            short       : CN_SHORT_WEEK_DAYS
        }
    },{ 
        format : "long" 
    }
]
 