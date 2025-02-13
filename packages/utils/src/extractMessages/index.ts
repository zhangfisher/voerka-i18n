/**
 * 
 * 解析源码中的t("xxxx")的内容
 * 
 * 
 * 
 * 
 */

import { parse, Lang, Range, NapiConfig } from '@ast-grep/napi' 
import { getFileNamespace } from '../getNamespace' 
import { getMatch } from './utils'
import VuePreset from "./schemas/vue"
import { ExtractMessagesOptions, ExtractSchema, TranslateNode } from './types'
import { trimAll } from '../trimAll';
import { parseTranslateMessages } from './utils/parseTranslateMessage';

const Schemas = {
    vue : VuePreset
} as unknown as Record<string,ExtractSchema>


/**
 * 使用@ast-grep/napi解析code中的t("xxxx")的内容 
 * 
 * @param code 
 * @returns
 * [
 *      {text:"xxxx",rang,args:[],options:{}},
 * ]
 */
export function extractMessages<T extends Record<string,any> = Record<string,any>>(code:string,options?:ExtractMessagesOptions):(TranslateNode & T)[]{
    
    let { sections, type: fileType, language:defaultLanguage,namespaces,file } = Object.assign({
        type      : 'ts',
        sections  : [],        
        language  : Lang.TypeScript, 
        namespaces:{}
    },options) as Required<ExtractMessagesOptions>

    
    if(fileType && fileType in Schemas){        
       sections = Schemas[fileType].sections 
    } 
    const results:any = [] 
    sections.forEach(({ language,regex,config })=>{
        let sectionCode:string
        if(regex instanceof RegExp){
            sectionCode = getMatch(code,regex) || code
        }else{
            sectionCode = code      // 使用正则表达式regex从源码中提取出需要的部分，取第一个匹配组的内容
        }

        const sectionAst = parse(language || defaultLanguage, sectionCode)        
        if(!config) return
        
        const nodes = sectionAst.root().findAll(config)
 
        nodes.forEach(node=>{
            const namespace = file ? getFileNamespace(file, namespaces) :'default'
            const msgNode = node.getMatch("MESSAGE")!   
            if(msgNode){
                const text = trimAll(msgNode.text())
                results.push({
                    text,
                    rang     : msgNode.range(),
                    vars     : node.getMatch("VARS")?.text(),
                    options  : node.getMatch("OPTIONS")?.text(),
                    namespace
                })
            }else{                
                const text = node.text()
                const nodeCtx = {
                    rang     : node.range(),
                    vars     : node.getMatch("VARS")?.text(),
                    options  : node.getMatch("OPTIONS")?.text(),
                    namespace
                }
                if(text){
                    const messages = parseTranslateMessages(text)
                    messages.forEach(message=>{
                        results.push({
                            text:message,
                            ...nodeCtx
                        })
                    })
                }
            }
            
        }) 
    })
 
    return results

}
 
 


// const nodes = [
//     ...root.findAll("t($TEXT)"),
//     ...root.findAll("t($TEXT,$ARGS)"),
//     ...root.findAll("t($TEXT,$ARGS,$OPTIONS)"),
//     ...root.findAll("<Translate t($TEXT,$ARGS,$OPTIONS,$ARGS)")
// ]



// const namespace = getFileNamespace(extras?.file, namespaces ||{})

// const result = []

// for(let node of nodes){
//     const textNode = node.getMatch("TEXT")!        
//     result.push({
//         ...extras || {},
//         text     : textNode.text().replace(/^['"`]/g,"").replace(/['"`]$/g,""),
//         rang     : textNode.range(),
//         args     : node.getMatch("ARGS")?.text(),
//         options  : node.getMatch("OPTIONS")?.text(),
//         namespace
//     })
// }
// return result as unknown as (TranslateNode & T)[]