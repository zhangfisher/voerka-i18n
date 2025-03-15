/**
 * 将idMap应用到翻译结果中
 * 
 */

import { escapeRegex } from "./escapeRegex"

 

// 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
// const MessageRegex = /([ \t\^;\{\(\,=\'\"\.\[\|\+\>])(t)\(\s*(["']{1})(.*?)(\3)/gm
// const MessageComponentRegex = /<Translate\s+[^>]*(?<![:@#%&*])message\s*=\s*(?:"([^"]+)"|{["'`](.+?)["'`]}|{`([^`]+)`})/gm

const getMessageRegex = (names:string[]=['t'])=>{     
    return new RegExp(`([ \\t\\^;\\{\\(\\,=\\'\\"\\.\\[\\|\\+\\>])(${names.map(name=>escapeRegex(name)).join("|")})\\(\\s*(["']{1})(.*?)(\\3)`,"gm")    
}
const getComponentRegex = (tags:string[]=['Translate'])=>{     
    return new RegExp(`<(${tags.map(tag=>escapeRegex(tag)).join("|")})(\\s+[^>]*)(?<![:@#%&*])message\\s*=\\s*(?:"([^"]+)"|{["'\`](.+?)["'\`]}|{\`([^\`]+)\`})`,"gm")    
}

export type ApplyIdMapOptions = {
    tFuncNames?: string[]
    tComponentNames?:string[]
}

export function applyIdMap(code:string,idMap:Record<string,string>,options?:ApplyIdMapOptions):string{ 
    const { tFuncNames, tComponentNames } = Object.assign({
        tFuncNames:['t','$t'],
        tComponentNames:['Translate','v-translate']
    },options)
    return code.replace(getMessageRegex(tFuncNames),(matched,pre,tName,_,message,n)=>{ 
        return `${pre}${tName}('${idMap[message] || message}'`
    }).replace(getComponentRegex(tComponentNames),(_,tagName,attrs,message)=>{
        return `<${tagName}${attrs}message="${idMap[message] || message}"`
    })
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
//   $t('iii', [1,2,3,""],()=>{})  
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
