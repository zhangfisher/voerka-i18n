import { trimChars } from '../../../trimChars';
import { parse, Lang } from '@ast-grep/napi'  
import { MessageNode } from '../..';


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

