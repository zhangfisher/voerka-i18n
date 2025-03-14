import { trimChars } from '../../trimChars';
import { parse, Lang } from '@ast-grep/napi'  
import { MessageNode } from '..';


const messageAstConfig = {
    rule: {
      any: [
        { pattern: 't($MESSAGE)' },
        { pattern: 't($MESSAGE,$VARS)' },
        { pattern: 't($MESSAGE,$VARS,$OPTIONS)' }
      ]
    },
    constraints: {
      MESSAGE: {
        kind: 'string'
      }, 
      OPTIONS: {
        kind: 'object'
      }
    }
};



export function parseTranslateMessages(code:string){
    const ast = parse(Lang.TypeScript,code)        
    const nodes = ast.root().findAll(messageAstConfig)
    const messages:string[]= []
    if(nodes.length === 0){    
        messages.push(...parseTranslateMessagesByRegex(code).map(node=>node.message))    
    }else{
      nodes.forEach(node=>{
          let message = node.getMatch("MESSAGE")?.text()
          if(message){
              message = trimChars(message,["'",'"'])
              messages.push(message)
          }
      })
    }
    
    return messages
}

const messageExtractors = [
  /\bt\(\s*("|'){1}(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))/gm,
  /\<Translate[^:#@]*?message\s*=\s*(["'])(?<text>.*?)\1/gm
]
 
// /**
//  * 使用正则表达式提取翻译文本
//  * 
//  * parseTranslateFunction("t('hello')") => [{text:"hello"}]
//  * 
//  * parseTranslateFunction("t('a') t('ns::b')") => [{text:"a"},{text:"b",namespace:"ns"}]
//  * 
//  * 
//  * @param {*} content 
//  * @returns 
//  */
export function parseTranslateMessagesByRegex(code:string){
    let result
    let messages:MessageNode[] = []
    for(let regex of messageExtractors){
      while ((result = regex.exec(code)) !== null) {
          // 这对于避免零宽度匹配的无限循环是必要的
          if (result.index === regex.lastIndex) {
            regex.lastIndex++;
          }           
          const text = result.groups?.text 
          if(text){
              messages.push({
                message:text,
                rang:{ start:String(result.index), end:String(result.index) }
              })
          }
      }
    }    
    return messages 
}