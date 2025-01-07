import { createFormatter } from "../utils"
import { toDate } from "../utils/toDate" 
import { relativeTime } from "flex-tools/misc/relativeTime"

 

export type RelativeTimeFormatterConfig = {
    units       : string[]
    now         : string
    before      : string
    after       : string
}


export type RelativeTimeFormatterArgs = {
    base: Date
}
 
export const relativeTimeFormatter =  createFormatter<RelativeTimeFormatterArgs,RelativeTimeFormatterConfig>({
        name   : "relativeTime",
        args   : [ "base" ],
        default: ()=>({
            base: new Date()
        }) ,
        next(value,args,ctx){              
            const config   = ctx.getConfig()
            const baseTime = args.base || new Date()
            return relativeTime(toDate(value),baseTime,config)   
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
 