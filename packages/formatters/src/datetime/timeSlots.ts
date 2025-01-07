import { createFormatter } from "../utils"
import { toDate } from "../utils/toDate"  

 

export type TimeSlotsFormatterConfig = { 
    slots       : number[],
    lowerCases  : string[],
    upperCases  : string[]
}


export type TimeSlotsFormatterArgs = {
    upper: boolean
 }


export default createFormatter<TimeSlotsFormatterArgs,TimeSlotsFormatterConfig>({
        name   : "timeSlots",
        args   : [ "upper" ],
        default: { 
            upper : true
        },
        next(value,args,ctx){               
            const options = ctx.getConfig()
            const hour    = toDate(value).getHours()
            const isUpper = Boolean(args.upper)
            let slotIndex = options.slots.findIndex(slot=>hour<slot)
            if(slotIndex===-1) slotIndex = options.slots.length-1
            return isUpper ? options.upperCases[slotIndex] : options.lowerCases[slotIndex]   
        }
    },{
    en: {
        slots: [12],
        lowerCases: ["am", "pm"],
        upperCases: ["AM", "PM"]
    },
    zh: {
        slots: [6, 9, 11, 13, 18],
        lowerCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"],
        upperCases: ["凌晨", "早上", "上午", "中午", "下午", "晚上"]
    }
})
 