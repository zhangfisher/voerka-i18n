import { isNumber } from "flex-tools/typecheck/isNumber"
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isFunction } from "flex-tools/typecheck/isFunction"
import { replaceInterpolatedVars } from "./interpolate"
import type { VoerkaI18nScope } from "./scope"


/**
 * 文本id必须是一个数字
 * @param {*} content 
 * @returns 
 */
 function isMessageId(content:string){
    return isNumber(content)
}
/**
 * 根据值的单数和复数形式，从messages中取得相应的消息
 * 
 * @param {*} messages  复数形式的文本内容 = [<=0时的内容>，<=1时的内容>，<=2时的内容>,...]
 * @param {*} value 
 */
function getPluraMessage(messages:any,value:number){
    try{
        if(Array.isArray(messages)){
            return messages.length > value ? messages[value] : messages[messages.length-1]
       }else{
           return messages
       }
    }catch{
        return Array.isArray(messages) ? messages[0] : messages
    }
}

/**
 * 翻译函数
 * 
* translate("要翻译的文本内容")                                 如果默认语言是中文，则不会进行翻译直接返回
* translate("I am {} {}","man") == I am man                    位置插值
* translate("I am {p}",{p:"man"})                              字典插值
* translate("total {$count} items", {$count:1})                复数形式 
* translate("total {} {} {} items",a,b,c)                      位置变量插值
 * 
 * this===scope  当前绑定的scope
 * 
 */
export function translate(this:VoerkaI18nScope,message:string,...args:any[]):string { 
    const scope = this
    const activeLanguage = scope.global.activeLanguage 
    // 如果内容是复数，则其值是一个数组，数组中的每个元素是从1-N数量形式的文本内容
    let result:string | string[] = message
    let vars=[]                             // 插值变量列表
    let pluraValue = null                   // 复数值
    if(!(typeof(message)==="string")) return message
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && isPlainObject(arguments[1])){// 字典插值
            const dictVars:Record<string,any>=arguments[1]
            for(const [name,value] of Object.entries(dictVars)){
                if(isFunction(value)){
                    try{
                        dictVars[name] = value()
                    }catch(e){
                        dictVars[name] = value
                    }
                } 
                // 以$开头的视为复数变量，记录下来
                const isNum:boolean = typeof(dictVars[name])==="number"
                if((pluraValue==null && isNum) || name.startsWith("$") && isNum){
                    pluraValue = dictVars[name]
                }
            }            
            vars = [dictVars]
        }else if(arguments.length >= 2){ // 位置插值
            vars = [...arguments].splice(1).map((arg,index)=>{
                try{
                    arg = isFunction(arg) ? arg() : arg         
                    // 约定：位置参数中以第一个数值变量作为指示复数变量
                    if(isNumber(arg)) pluraValue = parseInt(arg)     
                }catch(e){
                    return String(arg)
                 }
                return arg   
            })            
        }

        if(isMessageId(message)){
            const msgId = scope.idMap[message]  
            result = (scope.current as any)[msgId] || message
        }else{
            result = (scope.current as any)[message] || message
        }

         // 2. 处理复数
        // 经过上面的处理，content可能是字符串或者数组
        // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
        // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
        if(Array.isArray(result) && result.length>0){
            // 如果存在复数命名变量，只取第一个复数变量
            if(pluraValue!==null){  // 启用的是位置插值 
                result = getPluraMessage(result,pluraValue)
            }else{ // 如果找不到复数变量，则使用第一个内容
                result = result[0]
            }
        }         
        // 进行插值处理
        return replaceInterpolatedVars.call(scope,result as string,...vars)
    }catch(e){
        return result as any      // 出错则返回原始文本
    } 
}
  