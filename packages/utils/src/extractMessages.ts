/**
 * 
 * 解析源码中的t("xxxx")的内容
 * 
 * 
 * 
 * 
 */

import { parse,Lang,Range } from '@ast-grep/napi' 
import { getFileNamespace } from './getNamespace'
import { VoerkaI18nNamespaces } from '@voerkai18n/runtime'

export type TranslateNode = {
    text    : string
    rang    : Range
    args?   : string,
    options?: string
    namespace?:string
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
 * - <Translate message="">
 * 
 * @param code 
 * @returns
 * [
 *      {text:"xxxx",rang,args:[],options:{}},
 * ]
 * 
 * 
 */
export function extractMessages<T extends Record<string,any> = Record<string,any>>(code:string, namespaces?: VoerkaI18nNamespaces, extras?:T):(TranslateNode & T)[]{
    const ast = parse(Lang.JavaScript,code);
    const root = ast.root() 
    const nodes = [
        ...root.findAll("t($TEXT)"),
        ...root.findAll("t($TEXT,$ARGS)"),
        ...root.findAll("t($TEXT,$ARGS,$OPTIONS)"),
        ...root.findAll("<Translate t($TEXT,$ARGS,$OPTIONS,$ARGS)")
    ]

    const namespace = getFileNamespace(extras?.file, namespaces ||{})
    
    const result = []

    for(let node of nodes){
        const textNode = node.getMatch("TEXT")!        
        result.push({
            ...extras || {},
            text     : textNode.text().replace(/^['"`]/g,"").replace(/['"`]$/g,""),
            rang     : textNode.range(),
            args     : node.getMatch("ARGS")?.text(),
            options  : node.getMatch("OPTIONS")?.text(),
            namespace
        })
    }
    return result as unknown as (TranslateNode & T)[]
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

 

