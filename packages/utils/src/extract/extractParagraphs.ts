import { getFileNamespace } from '../getFileNamespace'
import { trimChars } from '../trimChars'
import { parse, Lang, SgNode } from '@ast-grep/napi' 

 

function parseTranslateAttrs(code:string):ParagraphNode {
    const ast = parse(Lang.Html,code)        
    
    const nodes = ast.root().findAll({
        utils:{            
            "is-translate" : {
                kind: "element",
                regex: "^<Translate"
            }
        },
        rule: {
            pattern:{
              selector: "attribute",
              context: "<Translate $ATTR_NAME=$ATTR_VALUE>"
            },
            inside: {
                matches: "is-translate",
                stopBy: "end"
            }
        }
    })
    return nodes.reduce<ParagraphNode>((result,item)=>{
        const attrName = item.getMatch("ATTR_NAME")?.text()
        if(attrName){
            const attrValue = item.getMatch("ATTR_VALUE")?.text()
            result[attrName] = attrValue ? trimChars(attrValue) : undefined
        }
        return result
    },{} as ParagraphNode)

}   


export type ParagraphNode = {
    [key: string]: any
    id?        : string
    message   : string
    vars?      : string
    scope?     : string
    options?   : string
    rang     : { start: string, end: string }
    namespace?: string
    file?     : string
}

export type ExtractParagraphsOptions = {
    language?:string
    namespaces?:Record<string,string>
    file?:string
}
/**
 * 
 * 提取段落
 * 
 * <Translate>
 *   段落内容
 * </Translate>
 * 
 * @param code 
 */
export function extractParagraphs(code:string,options?:ExtractParagraphsOptions):ParagraphNode[]{
 
    const  opts   = Object.assign({
        extractor : 'ast',
        language  : 'ts', 
        namespaces: {}
    },options) as Required<ExtractParagraphsOptions> 

    const { file,namespaces }  = opts   
    const namespace = file ? getFileNamespace(file, namespaces) :'default'

    const translatesAst = parse(Lang.Html,code)        
    const nodes = translatesAst.root().findAll({
        rule:{
            kind: "element",
            regex: "^<Translate",
            pattern: "<Translate $$$>$$$</Translate>"
        }
    })

    const paragraphs:ParagraphNode[] = []
    nodes.forEach((node:SgNode)=>{        
        const attrs = parseTranslateAttrs(node.text()) || {}        
        const range = node.range()
        attrs.rang = {
            start: `${range.start.line}:${range.start.column}`,
            end  : `${range.end.line}:${range.end.column}`
        }
        attrs.namespace = namespace
        attrs.file = file

        if(attrs.message){
            console.warn("[VoerkaI18n] translate paragraph attribute 'message' is not allowed")
            return
        }
        if(!attrs.id){
            console.warn("[VoerkaI18n] translate paragraph attribute 'id' is required")
            return 
        }

        const message = node.children().slice(1,-1).map(n=>n.text()).join("\n").trim()
        if(message.length>0){
            attrs.message=message
            paragraphs.push(attrs as any)
        }
    })    

    return paragraphs

}