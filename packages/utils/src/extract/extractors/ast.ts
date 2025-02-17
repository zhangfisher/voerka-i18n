/**
 * 
 * 解析源码中的t("xxxx")的内容
 *  
 */

import { parse, Lang, SgNode } from '@ast-grep/napi' 
import { MessageNode, ExtractorOptions  } from '../types'
import { getFileNamespace } from '../../getFileNamespace';
import { parseTranslateMessages } from '../utils/parseTranslateMessage'; 
import { trimChars } from '../../trimChars';


export function extractSectionMessages(node:SgNode,options:ExtractorOptions){
    const { namespaces,file } = options
    const namespace = file ? getFileNamespace(file, namespaces) :'default'
    const msgNode = node.getMatch("MESSAGE")!   
    const results:any = [] 
    if(msgNode){  
        const message = trimChars(msgNode.text())
        results.push({
            message,
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
                    message,
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
export default function extractor(code:string,options:ExtractorOptions):MessageNode[]{
    const { language, ast: astConfig } = Object.assign({
        language: Lang.TypeScript,
    },options)
    if(!astConfig) return []
    const results:any = [] 
    const sectionAst = parse(language, code)        
    const nodes = sectionAst.root().findAll(astConfig)
    nodes.forEach(node=>{
        results.push(...extractSectionMessages(node,options))
    })  
    return results
}
 
         