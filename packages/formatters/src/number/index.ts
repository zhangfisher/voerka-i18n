import { toCurrency } from "../utils/toCurrency"
import { createFormatter } from "../utils/createFormatter"

type NumberFormatterConfig = {   
    precision: number,          // 精度
    division : number,          // , 分割位，3代表每3位添加一个,
}

type NumberFormatterArgs = {  
    precision: number,          // 精度
    division : number,          // , 分割位，3代表每3位添加一个,
}  
 

export default createFormatter<NumberFormatterArgs,NumberFormatterConfig>({
    name: "number",
    args:["precision","division"],
    next(value:string,args:NumberFormatterArgs,ctx:any){
        const config  = ctx.getConfig()
        return toCurrency(value, Object.assign({},config,args))
    }
},{
    "en-US":{
        division      : 3,          // , 分割位，3代表每3位添加一个, 
    },
    "zh-CN":{
        division      : 4,          // , 分割位，4代表每4位添加一个, 
    }    
})
