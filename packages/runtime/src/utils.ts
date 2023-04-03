import { isNumber } from "flex-tools/typecheck/isNumber"
import { SupportedDateTypes } from './types';

/**
 * 获取指定变量类型名称
 * getDataTypeName(1) == Number
 * getDataTypeName("") == String
 * getDataTypeName(null) == Null
 * getDataTypeName(undefined) == Undefined
 * getDataTypeName(new Date()) == Date
 * getDataTypeName(new Error()) == Error
 * 
 * @param {*} v 
 * @returns 
 */
export function getDataTypeName(v:any):SupportedDateTypes{
	if (v === null)  return 'Null' 
	if (v === undefined) return  'Undefined'   
    if(typeof(v)==="function")  return "Function"
	return v.constructor && v.constructor.name;
};
 

 /**
  * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
  * 
  * 比如  str = "I am {username}"  
  * replace(new RegExp(str),"Tom") !===  I am Tom
  * 
  * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
  * 
  * replace(new RegExp(escapeRegexpStr(str)),"Tom")
  * 
  * 
  * @param {*} str 
  * @returns 
  */
 export function escapeRegexpStr(str:string):string{
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
 } 
 
export const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"]

/**
 * 转换为数字类型
 */
export  function toNumber(value:any,defualt=0):number {
    try {
        if (isNumber(value)) {
            return parseFloat(value)
        } else {
            return defualt
        }
    } catch {
        return value 
    }
} 

/**
 * 将值转换为Date类型
 * @param {*} value  
 */
export  function toDate(value:any) {
    try {
        return value instanceof Date ? value : new Date(value)
    } catch {
        return parseInt(value)
    }
}

export function toBoolean(value:any){
    return !!value
}
