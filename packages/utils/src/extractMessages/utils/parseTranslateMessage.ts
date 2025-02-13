import { trimAll } from '../../trimAll';
import { parse, Lang, Range, NapiConfig, pattern } from '@ast-grep/napi' 


const config = {
    rule: {
      any: [
        {
          pattern: {
            selector: 'call_expression',
            context: 't($MESSAGE)'
          }
        },
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
    const nodes = ast.root().findAll(config)
    const messages:string[]= []
    nodes.forEach(node=>{
        let message = node.getMatch("MESSAGE")?.text()
        if(message){
            message = trimAll(message,["'",'"'])
            messages.push(message)
        }
    })
    return messages
}


// const code=`
// t("a")
// t("b",1)
// t("c",true)
// t("d",false)
// t("e",x)
// t("f",new Date())
// t("g",[],{})
// t('h',{x:1},{})
// t('n1::a')
// t('n2::b',t("1"))
// t(()=>1)
// `

// console.log(parseTranslateMessage(code))







// // 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
// const TranslateExtractor = /\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))/gm

// export function parseTranslateMessages(code:string):string[]{ 
//     return []
// }

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
// export function parseTranslateFunction(code:string){
//     let result
//     let messages:any[] = []
//     while ((result = TranslateExtractor.exec(code)) !== null) {
//         // 这对于避免零宽度匹配的无限循环是必要的
//         if (result.index === TranslateExtractor.lastIndex) {
//             TranslateExtractor.lastIndex++;
//         }           
//         const text = result.groups?.text
//         if(text){
//             messages.push({
//                 text,
//                 namespace: result.groups?.namespace 
//             })
//         }
//     }
//     return messages
// }