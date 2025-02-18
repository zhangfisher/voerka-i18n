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

// // 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
const MessageExtractor = /\bt\(\s*("|'){1}(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))/gm

 
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
    while ((result = MessageExtractor.exec(code)) !== null) {
        // 这对于避免零宽度匹配的无限循环是必要的
        if (result.index === MessageExtractor.lastIndex) {
            MessageExtractor.lastIndex++;
        }           
        const text = result.groups?.text 

        if(text){
            messages.push({
              message:text,
              rang:{ start:String(result.index), end:String(result.index) }
            })
        }
    }
    return messages 
}