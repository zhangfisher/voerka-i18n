import { isMessageId } from "@/utils/isMessageId"
import { isFunction } from "flex-tools/typecheck/isFunction"
import { isNumber } from "flex-tools/typecheck/isNumber"
import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import type { VoerkaI18nScope } from ".."
import type { VoerkaI18nToBeTranslatedMessage, VoerkaI18nTranslateVars, VoerkaI18nTranslatedComponentProps, VoerkaI18nTranslateOptions } from "@/types"



export class TranslateMixin {    
    /**
     * 根据值的单数和复数形式，从messages中取得相应的消息
     * 
     * @param {*} messages  复数形式的文本内容 = [<=0时的内容>，<=1时的内容>，<=2时的内容>,...,<>=N的内容>]
     * @param {*} value 
     */
    private _getPluraMessage(this:VoerkaI18nScope,messages:string | string[],value:number){
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
    private _getPluraValue(args:any):[number | null,any[]]{
        let pluraValue:number | null = null                 // 复数值        
        let vars:any[] = []                                 // 插值变量列表
        // 1. 预处理变量:  复数变量保存至pluralVars中 , 变量如果是Function则调用 
        if(isPlainObject(args)){// 字典插值
            const dictVars:Record<string,any> = args
            for(const [name,value] of Object.entries(dictVars)){
                if(isFunction(value)){
                    try{
                        dictVars[name] = value()
                    }catch{
                        dictVars[name] = value
                    }
                }                   
                const isNum:boolean = typeof(dictVars[name])==="number"  // 以$开头的视为复数变量，记录下来
                if((pluraValue==null && isNum) || name.startsWith("$") && isNum){
                    pluraValue = dictVars[name]
                }
            }            
            vars = [dictVars]
        }else if(Array.isArray(args)){      // 位置插值
            vars = args.map((arg)=>{
                try{
                    arg = isFunction(arg) ? arg() : arg
                    if(isNumber(arg) && !pluraValue) pluraValue = parseInt(arg)     // 约定：位置参数中以第一个数值变量作为指示复数变量
                }catch{
                    return String(arg)
                 }
                return arg   
            })            
        }else if(args!==undefined){         // 单个插值
            pluraValue = isNumber(args) ? parseInt(args) : 0
            vars = [args]
        }
        return [pluraValue,vars]
    } 
 
    private _getTranslateComponent(this:VoerkaI18nScope){
        const component = this.options.component || this.appScope.options.component
        if(typeof(component)==='function'){
            return component
        }
    }

    /**
     * 翻译组件
     * import { Translate } from './languages'
     * <Translate message="hello" vars={{ name:"world" }} />
     * <Translate 
     *      message={ async ({ language,vars })=>"hello"} 
     *      vars={{ name:"world" }}
     *      options={options}                   // 用来传递给组件的额外参数
     *  />
     */
    Translate<T = any>(this: VoerkaI18nScope, props: VoerkaI18nTranslatedComponentProps): T {
        let result = props.options?.default
        const component = this._getTranslateComponent()
        if(typeof(component)==='function'){
            result = component.call(this,props)
        }else{
            throw new Error("No translate component found")
        }
        return result
    }

    translate<T=string>(this:VoerkaI18nScope, message:string, args?:VoerkaI18nTranslateVars, options?:VoerkaI18nTranslateOptions):T{ 
        // 为什么样要转义换行符？因为在translates/*.json中key不允许换行符存在，需要转义为\\n，这里需要转回来
        message = message.replaceAll(/\n/g,"\\n")
        // 如果内容是复数，则其值是一个数组，数组中的每个元素是从1-N数量形式的文本内容
        let result:string | string[] = message        
        if(!(typeof(message)==="string")) return message 
        const finalArgs = args===undefined ? [] : (isFunction(args) ? args() : args) 
        try{            
            if(isMessageId(message)){ // 如果是数字id,
                result = (this.activeMessages as any)[message] || message
            }else{
                const msgId = this.idMap[message]  
                // 语言包可能是使用idMap映射过的，则需要转换
                result = ( this.activeMessages[msgId]  || this.activeMessages[message] || message ) as string | string[]
            }
            const [pluraValue,vars] = this._getPluraValue(finalArgs)
             // 2. 处理复数
            // 经过上面的处理，content可能是字符串或者数组
            // content = "原始文本内容" || 复数形式["原始文本内容","原始文本内容"....]
            // 如果是数组说明要启用复数机制，需要根据插值变量中的某个变量来判断复数形式
            if(Array.isArray(result) && result.length>0){
                // 如果存在复数命名变量，只取第一个复数变量
                if(pluraValue!==null){  // 启用的是位置插值 
                    result = this._getPluraMessage(result,pluraValue!)
                }else{ // 如果找不到复数变量，则使用第一个内容
                    result = result[0]
                }
            }         
            // 如果没有传入插值变量，则直接返回
            if(finalArgs.length===0) result as string
            // 进行插值处理
            result = this.interpolator.replace(result as string,...vars)
        }catch(e:any){
            this.logger.error(`翻译失败：${e.stack}`) 
        }  
        return result as T
    } 
}