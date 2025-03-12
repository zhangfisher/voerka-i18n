/**
 * 将idMap应用到翻译结果中
 * 
 */
 
// // 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
const MessageRegex = /\bt\(\s*(["']{1})(.*?)(\1)/gm
const MessageComponentRegex = /<Translate\s+[^>]*(?<![:@#%&*])message\s*=\s*(?:"([^"]+)"|{["'`](.+?)["'`]}|{`([^`]+)`})/gm

export function applyIdMap(code:string,idMap:Record<string,string>):string{    
    return code.replace(MessageRegex,(matched,q,message,n)=>{         
        return `t('${idMap[message] || message}'`
    }).replace(MessageComponentRegex,(matched,message1,message2,message3,n)=>{
        const message = message1 || message2 || message3
        return `<Translate message="${idMap[message] || message}"`
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


// console.log(applyIdMap(`
//         <Translate vars="" message="aaa" options={}/>
//     <Translate message={"bbb"} />
//     <Translate message={\`ccc\`} />
//     <Translate vars="sss" message={\`ddd\`} />
//     <Translate vars="sss" message={()=>"Hello, world!"} />

//     <Translate 
//            message="fff"
//      ></Translate>
//     <Translate 
//               message={"ccc"}
//      ></Translate>
//     <Translate message={\`ddd!\`}></Translate>
//     <Translate vars="sss" message={\`eee\`} ></Translate>
// `,{
//         "aaa":"1",
//         "bbb":"2",
//         "ccc":"3",
//         "ddd":"4",
//         "eee":"5",
//         "fff":"6",
//         "ggg":"7",
//         "hhh":"8"    
// }))
 

