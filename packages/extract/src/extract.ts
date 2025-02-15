/**
 * 
 * 解析源码中的t("xxxx")的内容
 *  
 */

import { parse, Lang, SgNode } from '@ast-grep/napi' 
import { getMatch } from './utils' 
import { ExtractMessagesOptions, TranslateNode } from './types'
import { trimChars,  getFileNamespace } from '@voerkai18n/utils';
import { parseTranslateMessages } from './utils/parseTranslateMessage';
import Schemas from "./schemas"

function extractSectionMessages(node:SgNode,options:ExtractMessagesOptions){
    const { namespaces,file } = options
    const namespace = file ? getFileNamespace(file, namespaces) :'default'
    const msgNode = node.getMatch("MESSAGE")!   
    const results:any = [] 
    if(msgNode){  
        const text = trimChars(msgNode.text())
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
    return results
}

/**
 * 使用@ast-grep/napi解析code中的t("xxxx")的内容 
 * 
 * @param code 
 * @returns
 * [
 *      {text:"xxxx",rang,vars:[],options:{}},
 * ]
 */
export function extractMessages<T extends Record<string,any> = Record<string,any>>(code:string,options?:ExtractMessagesOptions):(TranslateNode & T)[]{
    
    let opts = Object.assign({
        type      : 'ts',
        sections  : [],        
        language  : Lang.TypeScript, 
        namespaces:{}
    },options) as Required<ExtractMessagesOptions>

    let { type: fileType, language:defaultLanguage } = opts

    if(fileType && fileType in Schemas){        
        opts.sections = Schemas[fileType].sections 
    } 

    const results:any = [] 
    opts.sections.forEach(({ language,regex,config })=>{
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
            results.push(...extractSectionMessages(node,opts))
        }) 
    })
 
    return results

}
 
         