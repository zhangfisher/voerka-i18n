import { ParagraphNode } from "..";


const paragraphExtractors = [
    /<Translate\s*[^>]*(id\s*=\s*(['"])(\w+)\2)?[^>]*?(?<![\/])>(?<text>[\s\S]*?)<\/Translate>/gm
]

/**
 * 
 * 
 * 解释段落
 * 
 * 
 */
export function parseTranslateParagraphsByRegex(code:string){
    let result
    let paragraphs:ParagraphNode[] = []
    for(let regex of paragraphExtractors){
      while ((result = regex.exec(code)) !== null) {
          // 这对于避免零宽度匹配的无限循环是必要的
          if (result.index === regex.lastIndex) {
            regex.lastIndex++;
          }           
          const text = result.groups?.text 
          if(text){
            paragraphs.push({
                message:text,
                rang:{ start:String(result.index), end:String(result.index) }
              })
          }
      }
    }    
    return paragraphs
}