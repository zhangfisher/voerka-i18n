/**
 * 
 * 解析源码中的t("xxxx")的内容
 *  
 */
 
import { getMatchs, parseTranslateMessagesByRegex } from './utils' 
import { ExtractMessagesOptions, ExtractSection, MessageNode } from './types' 
import Schemas from "./schemas"
import astExtractor from './extractors/ast'
import regexExtractor from './extractors/regex'
import { getFileNamespace } from '../'
 

function extractSessionCode(code:string,extractArg:ExtractSection['extract'] ):string[]{
    if(extractArg instanceof RegExp){
        return getMatchs(code,extractArg) || [code]
    }else if(typeof(extractArg)==='object'){
        let finalCode = code
        const exclude = extractArg.exclude 
                            ? (Array.isArray(extractArg.exclude) ? extractArg.exclude : [extractArg.exclude] ) : []

        exclude.forEach((regex)=>{
            finalCode = finalCode.replaceAll(regex,"")
        })
        const results:string[] = []
        const include = extractArg.include 
                            ? (Array.isArray(extractArg.include) ? extractArg.include : [extractArg.include] ) : []
        if(include.length===0){
            results.push(finalCode)
        }else{
            include.forEach((regex)=>{
                if(!(regex && regex instanceof RegExp)) return
                const matched = getMatchs(finalCode,regex)
                if(matched){
                    results.push(...matched)
                }
            })
        }        
        return results
    }else{
        return [code]
    }
}

export function extractMessagesUseAst(code:string,options:ExtractMessagesOptions):MessageNode[]{
    const  { language,file,namespaces }  = options
    const sections = (language && language in Schemas)? Schemas[language] : Schemas['ts']
    const results:any = [] 
    sections.forEach((section)=>{        
        // 1. 先分割源码为多个部分，如vue文件的template,script,style
        const { extract,type  } = section 

        const sectionCodes = extractSessionCode(code,extract)

        // 2. 使用ast或者regex提取每个部分要翻译的文本        
        sectionCodes.filter((sCode)=>sCode && sCode.trim().length>0).forEach(sCode=>{
            const extractorOpts = Object.assign({
                file ,
                namespaces
            },section)
            if(type==='ast' || section.ast){
                results.push(...astExtractor(sCode,extractorOpts))
            }else{
                results.push(...regexExtractor(sCode,extractorOpts))
            }
        })
    })
    return results
}
export function extractMessagesUseRegex(code:string,options:ExtractMessagesOptions):MessageNode[]{
    const { file,namespaces }  = options   
    const namespace = file ? getFileNamespace(file, namespaces) :'default'

    const messages = parseTranslateMessagesByRegex(code)
    return messages.map(message=>({        
        vars:undefined,
        options:undefined,
        namespace,
        ...message
    }))
}
/**
 * 提取要翻译的文本信息
 * 
 * extractMessages(code,options) // 默认使用AST
 * 
 * extractMessages(code,{extractor:"regex"}) // 使用正则表达式提取
 * 
 * @param code 
 * @returns
 * [
 *      {text:"xxxx",rang,vars:[],options:{}},
 * ]
 */
export function extractMessages(code:string,options?:ExtractMessagesOptions):MessageNode[]{
    
    const  opts   = Object.assign({
        extractor : 'ast',
        language  : 'ts', 
        namespaces: {}
    },options) as Required<ExtractMessagesOptions>

    const results:any = [] 

    if(opts.extractor==='regex'){
        return extractMessagesUseRegex(code,opts)
    }else{
        return extractMessagesUseAst(code,opts)
    }

    
 
    return results

}
 
         