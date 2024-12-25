import { createFormatter } from "../../formatter"  
import { toDate } from "../../utils/toDate"  

 

export type TimeSlotsFormatterOptions = { 
    slots       : number[],
    lowerCases  : string[],
    upperCases  : string[]
}


export type TimeSlotsFormatterArgs = {
    upper: boolean
 }


export default createFormatter<TimeSlotsFormatterArgs,TimeSlotsFormatterOptions>(({ getLanguageOptions })=>{
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
                const options = getLanguageOptions()
                let slotIndex = options.slots.findIndex(slot=>hour<slot)
                if(slotIndex===-1) slotIndex = options.slots.length-1
                return isUpper ? options.upperCases[slotIndex] : options.lowerCases[slotIndex]                               
            }catch{                
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
 