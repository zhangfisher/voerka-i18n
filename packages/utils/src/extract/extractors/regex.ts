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

export default function extractMessages(code:string,options?:ExtractorOptions):MessageNode[]{
    const { file,namespaces,language } = Object.assign({},options) as ExtractorOptions     
    const namespace = file ? getFileNamespace(file, namespaces) :'default'
    code = removeComments(code,language)
    const messages = parseTranslateMessagesByRegex(code) 
    messages.forEach(message=>{
        message.namespace = namespace 
        message.file = file
    })
    return messages
    
}