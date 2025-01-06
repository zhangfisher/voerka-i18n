import { toCurrency } from "../utils/toCurrency"
import { createFormatter } from "@voerkai18n/runtime"


export const numberFormatter = createFormatter(()=>{
    return {
        name: "number",
        args:["precision","division"],
        default: ()=>{
            return {
                division      : 3,          // , 分割位，3代表每3位添加一个, 
                precision     : -1          // 精度，即保留小数点位置,-1代表保留所有小数位数 
            }
        },
        next(value:any,args){
            return toCurrency(value, args,{})
        }
    } 
})
