import { toCurrency } from "../currency/toCurrency"
import { createFormatter } from "../../../runtime/src/formatter/utils"


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
