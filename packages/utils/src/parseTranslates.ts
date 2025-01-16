/**
 * 
 * 解析源码中的t("xxxx")的内容
 * 
 * 
 * 
 * 
 */

import { parse,Lang,Range } from '@ast-grep/napi' 

export type TranslateNode = {
    text    : string
    rang    : Range
    args?   : string,
    options?: string
} 

/**
 * 
 * 使用@ast-grep/napi解析code中的t("xxxx")的内容
 * 
 * 支持
 * - t("xxxx")
 * - t('xxxx')
 * - t("xxxx", {xxx:xxx})
 * - t('xxxx', [1,2,3,""])
 * - t("xxxx", {xxx:xxx},{})
 * - t('xxxx', [1,2,3,""],{})
 * - t("xxxx", {xxx:xxx},()=>{})
 * - t('xxxx', [1,2,3,""],()=>{})
 * 
 * 
 * @param code 
 * @returns
 * [
 *      {text:"xxxx",rang,args:[],options:{}},
 * ]
 * 
 * 
 */
export function parseTranslates(code:string):TranslateNode[]{
    const ast = parse(Lang.JavaScript,code);
    const root = ast.root() 
    const nodes = [
        ...root.findAll("t($TEXT)"),
        ...root.findAll("t($TEXT,$ARGS)"),
        ...root.findAll("t($TEXT,$ARGS,$OPTIONS)")
    ]
    const result = []
    for(let node of nodes){
        const textNode = node.getMatch("TEXT")!        
        result.push({
            text:textNode.text(),
            rang:textNode.range(),
            args:node.getMatch("ARGS")?.text(),
            options:node.getMatch("OPTIONS")?.text() 
        })
    }
    return result
}



// console.log(parseTranslates(String.raw`
//   t("aaa") 
//   t('bbb')
//   t(\`YYYY\`)
//   t("ccc", {xxx:xxx})
//   t('ddd', [1,2,3,""])
//   t("eee", {xxx:xxx},{})
//   t('fff', [1,2,3,""],{})
//   t("ggg", {xxx:xxx},()=>{}) 
//   t('hhh', [1,2,3,""],()=>{})  
// `))

 

