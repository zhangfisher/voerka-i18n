import { pick } from "flex-tools/object/pick";


export type ParagraphNode = {
    id?     : string
    message : string
    vars?   : string
    scope?  : string
    options?: string
    rang    : { start: number, end: number }
    file?   : string
    [key    : string]: any
}

export type ExtractParagraphsOptions = {
    language?  : string
    namespaces?: Record<string,string>
    file?      : string

    
}
const attrsRegex = /(?<name>\w+)\s*=\s*(["'])(?<value>.*?)\2/gm

function parseTranslateAttrs(attrs:string):Record<string,any> {
    let result
    let attrsMap:Record<string,any> = {}
    while ((result = attrsRegex.exec(attrs)) !== null) {
        const { name,value } = result.groups || {}
        if(name && value){
            attrsMap[name] = value
        }
    }
    return attrsMap
}   


// /<Translate\s*[^>]*(id\s*=\s*(['"])(\w+)\2)?[^>]*?(?<![\/])>(?<text>[\s\S]*?)<\/Translate>/gm
const paragraphExtractors = [
    /<Translate\s*(?<attrs>[^>]*)(?<![\/])>(?<text>[\s\S]*?)<\/Translate>/gm
]

/**
 * 解释段落
 */
export function parseParagraphsByRegex(code:string,options:ExtractParagraphsOptions){
    const { file }  = options    
    let result
    let paragraphs:ParagraphNode[] = []
    for(let regex of paragraphExtractors){
      while ((result = regex.exec(code)) !== null) {
          // 这对于避免零宽度匹配的无限循环是必要的
        if (result.index === regex.lastIndex) {
            regex.lastIndex++;
        }           
        const text = result.groups?.text 
        const attrs = parseTranslateAttrs(result.groups?.attrs || '')
        if(text){
            paragraphs.push({
                message:text,
                rang:{ 
                    start: result.index, 
                    end: result.index + result[0].length 
                },
                file,
                ...pick(attrs,[
                    'id',
                    'vars',
                    'scope',
                    'options',
                    'tag',
                    'style',
                    'class',
                    'className' 
                ])
              })
          }
      }
    }    
    return paragraphs
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
    const opts = Object.assign({},options) as Required<ExtractParagraphsOptions>
    const paragraphs:ParagraphNode[] = parseParagraphsByRegex(code,opts)
    return paragraphs
}