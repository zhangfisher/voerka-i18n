import { createFormatter } from "@voerkai18n/runtime"
import { toDate } from "../utils/toDate" 

type QuarterFormatterConfig = {
    format: 'long' | 'short' | string | ((date:Date)=>string)
    long  : string[]
    short : string[] 
}


type QuarterFormatterArgs = {
    format: string
}

export default  createFormatter<QuarterFormatterArgs,QuarterFormatterConfig>({
        name   : "quarter",
        args   : [ "format" ], 
        next(value,args,ctx){ 
            const config = ctx.getConfig()
            const month   = toDate(value).getMonth() + 1  
            const quarter = Math.floor( ( month % 3 == 0 ? ( month / 3 ) : (month / 3 + 1 ) )) - 1
            const format:any  = args.format || config.format
            if( typeof(format)==='string' && format in config ){
                const formatVal = (config as any)[format]
                if(typeof formatVal === 'function'){
                    return (formatVal as any)(quarter)
                }else{
                    return formatVal[quarter]
                }                    
            }
            return quarter
        }
    },{
        "en-US":{ 
            long    : ["First Quarter","Second Quarter","Third Quarter","Fourth Quarter"],
        },
        "zh-CN":{ 
            long    : ["一季度","二季度","三季度","四季度"],
            
        }
    },{
        format      : "short",         
        short       : ["Q1","Q2","Q3","Q4"],
    })
 