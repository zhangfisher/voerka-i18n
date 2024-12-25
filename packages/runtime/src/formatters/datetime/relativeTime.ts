
import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"  
import { toDate } from "../../utils/toDate" 
import { formatDateTime, relativeTime } from "flex-tools/misc/formatDateTime"

 

export type RelativeTimeFormatterOptions = {
    units       : string[]
    now         : string
    before      : string
    after       : string
}


export type RelativeTimeFormatterArgs = {
    base: Date
}
 
export default createFormatter<RelativeTimeFormatterArgs,RelativeTimeFormatterOptions>((scope: VoerkaI18nScope,{ getActiveOptions })=>{
    return {
        name   : "time",
        args   : [ "base" ],
        default: ()=>({
            base:new Date()
        }),
        next(value:any,args){              
            try{ 
                const options   = getActiveOptions()
                const baseTime = args.base || new Date()
                return relativeTime(toDate(value),baseTime,options)
            }catch(e){                
                return value
            }
        }
    } 
},{
    en:{ 
        units       : ["seconds","minutes","hours","days","weeks","months","years"],
        now         : "Just now",
        before      : "{value} {unit} ago",
        after       : "after {value} {unit}"
    },
    zh:{ 
        units       : ["秒","分钟","小时","天","周","个月","年"],
        now         : "刚刚",
        before      : "{value}{unit}前",
        after       : "{value}{unit}后"
    }
})
 