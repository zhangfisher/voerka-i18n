import type { ExtractorOptions, MessageNode } from "..";
import { getFileNamespace } from "../../getFileNamespace";
import { parseTranslateMessagesByRegex } from "../utils";




// // 捕获翻译文本正则表达式一： 能匹配完整的t(xx,...)函数调用，如果t函数调用不完整，则不能匹配到
// //  但是当t(xxx,...复杂的表达式时....)则不能正确匹配到，因此放弃该正则表达式
// // const DefaultTranslateExtractor = String.raw`\b{funcName}\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>.*?)(((\1\s*\)){1})|((\1){1}\s*(,(\w|\d|(?:\{.*\})|(?:\[.*\])|([\"\'\(].*[\"\'\)]))*)*\s*\)))`

// // 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
// const MessageExtractRegex = String.raw`\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))`

// // 从html文件标签中提取翻译文本
// const MessageAttrExtractorRegex = String.raw`\<(?<tagName>\w+)(.*?)(?<i18nKey>{attrName}\s*\=\s*)([\"\'']{1})(?<text>.*?)(\4){1}\s*(.*?)(\>|\/\>)`

// const extractors = {                      
//     "*" : MessageExtractRegex,
//     "html,vue,jsx":MessageAttrExtractorRegex 
// }


// 声明各种语言的注释匹配正则表达式 
const commentRegexs ={
    "js,vue,jsx,ts,tsx" : [
        /(^[^\n\r\w\W]*\/\/.*$)|(\/\/.*$)/gm,                   // 单行注释
        /\/\*\s*[\W\w|\r|\n|*]*\s*\*\//gm,                      // 多行注释
    ],
    "html,vue" : [
        /\<\!--[\s\r\n-]*?[\w\r\n-\W]*?[\s\r\n-]*?--\>/gm,    // 注释
    ]
} 

/**
* 匹配文件中的注释部分
*/
function removeComments(content:string,language="js"){
    Object.entries(commentRegexs).forEach(([filetype,regexps])=>{
        if(filetype.split(",").includes(filetype)){
            regexps.forEach(regex=>{
                 content = content.replaceAll(regex,"")
            })
        }
    })
    return content
}


// /**
//  * 
//  * 返回filePath是否在nsPaths名称空间内
//  * 
//  * inNamespace("a/b/c/xxx.js","a/b")  == true
//  * inNamespace("a/c/c/xxx.js","a/b")  == false
//  * 
//  * @param {*} filePath  文件路径
//  * @param {*} nsPath  名称空间的路径
//  * @returns 
//  */
// function inNamespace(filePath:string,nsPath:string){
//     return !path.relative(nsPath,filePath).startsWith("..") 
// } 

// /**
//  * 使用正则表达式提取翻译文本
//  * @param {*} code:string 
//  * @param {*} file 
//  * @param {*} options 
//  * @returns   {namespace:{text:{zh:"",en:"",...,$files:""},text:{zh:"",en:"",...,$files:""}}
//  */
// function extractMessagesUseRegexp(code:string,namespace,extractor,file,options){
  
//     let { languages,defaultLanguage } = options
      
//     code = removeComments(code,language)
//     let result
//     let texts = {}
//     while ((result = extractor.exec(code:string)) !== null) {
//         // 这对于避免零宽度匹配的无限循环是必要的
//         if (result.index === extractor.lastIndex) {
//             extractor.lastIndex++;
//         }   
//         const text = result.groups.text
//         if(text){
//             const ns = result.groups.namespace || namespace
//             if(!(ns in texts)){
//                 texts[ns]  = {}
//             }
//             texts[ns][text] ={} 
//             languages.forEach(language=>{
//                 if(language.name !== defaultLanguage){
//                     texts[ns][text][language.name] = text
//                 }                
//             })
//             texts[ns][text]["$files"]=[file.relative]
//         }
//     }
//     return texts
// }

// /**
//  * 
//  * 返回指定文件类型的提取器
//  * @param {*} language  文件扩展名
//  * @param {*} extractor 提取器配置={default:[],js:[],html:[],"sass,css":[],json:[],"*":[]}"}
//  */
// function getExtractors(language:string){ 
//     let matchers=[]
//     for(let [key,value] of Object.entries(extractors)){
//         if(language.toLowerCase()===key.toLowerCase()){
//             matchers =  value
//             break
//         }else if(key.split(",").includes(language)){
//             matchers = value
//             break
//         }
//     }
//     // * 适用于所有文件类型
//     if("*" in extractors){
//         matchers = matchers.concat(extractors["*"])
//     }
//     // 如果没有指定提取器，则使用默认提取器
//     if(matchers.length===0){
//         matchers = extractors["default"]
//     }
//     return matchers
// }


// /**
//  *  找出要翻译的文本列表 {namespace:[text,text],...}
//  * {namespace:{text:{zh:"",en:"",$source:""},...}
//  * @param {*} content 
//  * @param {*} extractor 
//  * @returns 
//  */
// function getTranslateTexts(content,file,options){
    
//     let { extractor: extractorOptions } = options

//     if(!options || Object.keys(extractorOptions).length===0) return

//     // 获取当前文件的名称空间
//     const namespace = getFileNamespace(file,options)
//     const fileExtName = file.extname.substr(1).toLowerCase()  // 文件扩展名

//     let texts = {}
//     // 提取器
//     let useExtractors = getExtractors(fileExtName,extractorOptions)

//     // 分别执行所有提取器并合并提取结果
//     return useExtractors.reduce((preTexts,extractor)=>{
//         let matchedTexts = {} , extractFunc = ()=>{}  
//         if(extractor instanceof RegExp){
//             extractFunc = extractTranslateTextUseRegexp
//         }else{
//             return preTexts
//         }  
//         try{
//             matchedTexts = extractFunc(content,namespace,extractor,file,options)
//         }catch(e){
//             console.error(`Extract translate text has occur error from ${file.relative}:${extractor.toString()}.`,e)
//         }        
//         return deepmerge(preTexts,matchedTexts)
//     },texts) 
// }


export default function extractMessages(code:string,options?:ExtractorOptions):MessageNode[]{
    const { file,namespaces,language } = Object.assign({},options) as ExtractorOptions
     
    const namespace = file ? getFileNamespace(file, namespaces) :'default'
    code = removeComments(code,language)

    const messages = parseTranslateMessagesByRegex(code) 

    return messages
    
}