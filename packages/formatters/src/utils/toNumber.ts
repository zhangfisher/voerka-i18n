import { isNumber } from "flex-tools/typecheck/isNumber"

/**
 * 转换为数字类型
 */
export  function toNumber(value:any):number {
    try {
        if (isNumber(value)) {
            return parseFloat(value)
        } else {
            return 0
        }
    } catch {
        return value 
    }
} 

