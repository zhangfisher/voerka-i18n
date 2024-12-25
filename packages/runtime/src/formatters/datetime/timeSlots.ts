import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"  
import { toDate } from "../../utils/toDate"  
import { formatDateTime } from "flex-tools/misc/timeFormatter"

 

export type TimeSlotsFormatterOptions = { 
    slots       : number[],
    lowerCases  : string[],
    upperCases  : string[]
}


export type TimeSlotsFormatterArgs = {
    upper: boolean
 }


export default createFormatter<TimeSlotsFormatterArgs,TimeSlotsFormatterOptions>((scope: VoerkaI18nScope,{ getActiveOptions })=>{
    return {
        name   : "time",
        args   : [ "upper" ],
        default: { 
            upper : true
        },
        next(value:any,args){              
            try{
                const hour    = toDate(value).getHours()
                const isUpper = Boolean(args.upper)
                const options = getActiveOptions()
                let slotIndex = options.slots.findIndex(slot=>hour<slot)
                if(slotIndex===-1) slotIndex = options.slots.length-1
                return isUpper ? options.upperCases[slotIndex] : options.lowerCases[slotIndex]                
               
            }catch(e){                
                return value
            }
        }
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
 