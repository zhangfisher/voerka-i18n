import { createFormatter } from "../utils/createFormatter"
import { toDate } from "../utils/toDate" 
import { relativeTime } from "flex-tools/misc/relativeTime"

 

type RelativeTimeFormatterConfig = {
    units       : string[]
    now         : string
    before      : string
    after       : string
}

type RelativeTimeFormatterArgs = {
    base: Date
}
 
export default createFormatter<RelativeTimeFormatterArgs,RelativeTimeFormatterConfig>({
        name   : "relativeTime",
        args   : [ "base" ],
        default: ()=>({
            base: new Date()
        }) ,
        next(value:string,args:RelativeTimeFormatterArgs,ctx:any){              
            const config   = ctx.getConfig()
            const baseTime = args.base || new Date()
            return relativeTime(toDate(value),baseTime,config)   
        }
    },{
    "en-US":{ 
        units       : ["seconds","minutes","hours","days","weeks","months","years"],
        now         : "Just now",
        before      : "{value} {unit} ago",
        after       : "after {value} {unit}"
    },
    "zh-CN":{ 
        units       : ["秒","分钟","小时","天","周","个月","年"],
        now         : "刚刚",
        before      : "{value}{unit}前",
        after       : "{value}{unit}后"
    }
})
 