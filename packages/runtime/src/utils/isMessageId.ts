import { isNumber } from "flex-tools/dist/typecheck/isNumber";

/**
 * 文本id必须是一个数字
 * @param {*} content 
 * @returns 
 */
export function isMessageId(content:string){
    return isNumber(content)
}