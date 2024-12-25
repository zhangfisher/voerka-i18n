
import type  { VoerkaI18nScope } from "../../scope"
import { createFormatter } from "../../utils/createFormatter"  
import { toDate } from "../../utils/toDate" 

export type QuarterFormatterOptions = {
    format: string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}


export type QuarterFormatterArgs = {
    format: string
}

export default createFormatter<QuarterFormatterArgs,QuarterFormatterOptions>((scope: VoerkaI18nScope,{getActiveOptions})=>{
    return {
        name   : "quarter",
        args   : [ "format" ],
        default: { 
            format : "long" 
        },
        next(value:any,args){              
            try{
                const month   = toDate(value).getMonth() + 1  
                const quarter = Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) ))
                const options = getActiveOptions()
                const format  = args.format || 'long'
                if( typeof(format)==='string' && format in options ){
                    const formatVal = (options as any)[format]
                    if(typeof formatVal === 'function'){
                        return (formatVal as any)(quarter)
                    }else{
                        return formatVal[quarter]
                    }                    
                }
                return quarter
            }catch(e){                
                return value
            }
        }
    } 
},{
    en:{ 
        long        : ["First Quarter","Second Quarter","Third Quarter","Fourth Quarter"],
        short       : ["Q1","Q2","Q3","Q4"],
        format      : "short"
    },
    zh:{ 
        long        : ["一季度","二季度","三季度","四季度"],
        short       : ["Q1","Q2","Q3","Q4"],
        format      : "short"          // 0-短格式,1-长格式,2-数字
    }
})
 