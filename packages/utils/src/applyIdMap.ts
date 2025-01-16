/**
 * 将idMap应用到翻译结果中
 * 
 */


import { parse,Lang,Range } from '@ast-grep/napi' 


export function applyIdMap(code:string,idMap:Record<string,string>):string{
    const ast = parse(Lang.JavaScript,code);
    const root = ast.root() 
    const nodes = [
        ...root.findAll("t($TEXT)"),
        ...root.findAll("t($TEXT,$ARGS)"),
        ...root.findAll("t($TEXT,$ARGS,$OPTIONS)")
    ]
    const fixs = []
    for(let node of nodes){
        const textNode = node.getMatch("TEXT")!
        const text = textNode.text().replace(/^['"`]/g,"").replace(/['"`]$/g,"")
        if(text in idMap){            
            fixs.push(textNode.replace(`'${idMap[text]}'`))
        }
    } 
    fixs.sort((a, b) => b.startPos - a.startPos)
    return root.commitEdits(fixs)
}



// console.log(applyIdMap(String.raw`
//   t("aaa") 
//   t('bbb') 
//   t("ccc", {xxx:xxx})
//   t('ddd', [1,2,3,""])
//   t("eee", {xxx:xxx},{})
//   t('fff', [1,2,3,""],{})
//   t("ggg", {xxx:xxx},()=>{}) 
//   t('hhh', [1,2,3,""],()=>{})  
// `,{
//     "aaa":"1",
//     "bbb":"2",
//     "ccc":"3",
//     "ddd":"4",
//     "eee":"5",
//     "fff":"6",
//     "ggg":"7",
//     "hhh":"8"    
// }))

 

