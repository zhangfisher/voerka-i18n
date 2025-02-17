/**
 * 将idMap应用到翻译结果中
 * 
 */
 
// // 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
const MessageExtractRegex = /\bt\(\s*(["']{1})(.*?)(\1)/gm

export function applyIdMap(code:string,idMap:Record<string,string>):string{    
    return code.replace(MessageExtractRegex,(matched,q,message,n)=>{         
        return `t('${idMap[message] || message}'`
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
//   t('iii', [1,2,3,""],()=>{})  
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

 

