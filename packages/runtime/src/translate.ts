import { isNumber } from "flex-tools/typecheck/isNumber"
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isFunction } from "flex-tools/typecheck/isFunction"
import { replaceInterpolatedVars } from "./interpolate"
import type { VoerkaI18nScope } from "./scope"


/**
 *  当传入的翻译内容不是一个字符串时，进行默认的转换
 * 
 *  - 对函数则执行并取返回结果()
 *  - 对Array和Object使用JSON.stringify
 *  - 其他类型使用toString
 * 
 * @param {*} value 
 * @returns 
 */
 function transformToString(value:any){
    let result  = value
    try{
        if(isFunction(result)) result = value()
        if(!(typeof(result)==="string")){
            if(Array.isArray(result) || isPlainObject(result)){
                result = JSON.stringify(result)
            }else{
                result = result.toString()
            }
        }else{
            return value
        }
    }catch{
        result = result.toString()
    }
    return result
}

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
* translate("total {$count} items", {$count:1})  //复数形式 
* translate("total {} {} {} items",a,b,c)  // 位置变量插值
 * 
 * this===scope  当前绑定的scope
 * 
 */
export function translate(this:VoerkaI18nScope,message:string,...args:any[]) { 
    const scope = this
    const activeLanguage = scope.global.activeLanguage 
    let content:string = message
    let vars=[]                 // 插值变量列表
    let pluralVars= []          // 复数变量
    let pluraValue = null       // 复数值
    if(!(typeof(message)==="string")) return message
    try{
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(arguments.length === 2 && isPlainObject(arguments[1])){
            const dictVars:Record<string,any>={}
            Object.entries(arguments[1]).forEach(([name,value])=>{
                if(typeof(value)=="function"){
                    try{
                        dictVars[name] = value()
                    }catch(e){
                        dictVars[name] = value
                    }
                } 
                // 以$开头的视为复数变量
                if(name.startsWith("$") && typeof(dictVars[name])==="number")  pluralVars.push(name)
            })
            vars = [arguments[1]]
        }else if(arguments.length >= 2){
            vars = [...arguments].splice(1).map((arg,index)=>{
                try{
                    arg = isFunction(arg) ? arg() : arg                    
                    // 位置参数中以第一个数值变量为复数变量
                    if(isNumber(arg)) pluraValue = parseInt(arg)    
                }catch(e){ }
                return arg   
            })
            
        }

        // 3. 取得翻译文本模板字符串
        if(activeLanguage === scope.defaultLanguage){
            // 2.1 从默认语言中取得翻译文本模板字符串
            // 如果当前语言就是默认语言，不需要查询加载，只需要做插值变换即可
            // 当源文件运用了babel插件后会将原始文本内容转换为msgId
            // 如果是msgId则从scope.default中读取,scope.default=默认语言包={<id>:<message>}
            if(isMessageId(content)){
                content = scope.default[content] || message
            }
        }else{ 
            // 2.2 从当前语言包中取得翻译文本模板字符串
            // 如果没有启用babel插件将源文本转换为msgId，需要先将文本内容转换为msgId
            let msgId = isMessageId(content) ? content :  scope.idMap[content]  
            content = scope.messages[msgId] || content
        }
         // 2. 处理复数
        // 经过上面的处理，content可能是字符串或者数组
        // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
        // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
        if(Array.isArray(content) && content.length>0){
            // 如果存在复数命名变量，只取第一个复数变量
            if(pluraValue!==null){  // 启用的是位置插值,pluraIndex=第一个数字变量的位置
                content = getPluraMessage(content,pluraValue)
            }else if(pluralVar.length>0){
                content = getPluraMessage(content,parseInt(vars(pluralVar[0])))
            }else{ // 如果找不到复数变量，则使用第一个内容
                content = content[0]
            }
        }         
        // 进行插值处理
        if(vars.length==0){
            return content
        }else{
            return replaceInterpolatedVars.call(scope,content,...vars)
        }        
    }catch(e){
        return content       // 出错则返回原始文本
    } 
}
  