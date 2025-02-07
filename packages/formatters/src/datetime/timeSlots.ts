import { createFormatter } from "@voerkai18n/runtime"
import { toDate } from "../utils/toDate"  

type TimeSlotsFormatterConfig = { 
    slots       : number[],
    lowerCases  : string[],
    upperCases  : string[]
}


type TimeSlotsFormatterArgs = {
    upper: boolean
 }


export default createFormatter<TimeSlotsFormatterArgs,TimeSlotsFormatterConfig>({
        name   : "timeSlots",
        args   : [ "upper" ],
        default:{
            upper: true
        },
        next(value,args,ctx){               
            const options = ctx.getConfig()
            const hour    = toDate(value).getHours()
            const isUpper = Boolean(args.upper)
            let slotIndex = options.slots.findIndex(slot=>hour<slot)
            if(slotIndex===-1) slotIndex = options.upperCases.length-1
            return isUpper ? options.upperCases[slotIndex] : options.lowerCases[slotIndex]   
        }
    },{
        "en-US": {
            slots     : [12],
            lowerCases: ["am", "pm"],
            upperCases: ["AM", "PM"]
        },
        "zh-CN": {
            slots     : [5, 8, 11, 13, 18],
            lowerCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"],
            upperCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"]
        }
    } )
 