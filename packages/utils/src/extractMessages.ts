/**
 * 
 * 解析源码中的t("xxxx")的内容
 *  
 */

import type { VoerkaI18nNamespaces } from '@voerkai18n/runtime'
import {  getFileNamespace } from './getFileNamespace' 
import { encodeRegExp } from './encodeRegExp' 
import { escapeRegex } from './escapeRegex'

export type MessageNode = {
    message   : string
    rang      : { start: number, end: number }
    vars?     : string
    options?  : string
    namespace?: string
    file?     : string
} 

export type ExtractMessagesOptions = {
    language?       : "js" | "ts" | "jsx" | "tsx" | "vue" | "react" | "svelte" | "astro" | "mdx" 
    namespaces      : VoerkaI18nNamespaces
    file            : string
    tFuncNames?     : string[]
    tComponentNames?: string[]
}



// 声明各种语言的注释匹配正则表达式 
const commentRegexs ={
    "js,vue,jsx,ts,tsx" : [
        /(^[^\n\r\w\W]*\/\/.*$)|(\/\/.*$)/gm,                   // 单行注释
        /\/\*\s*[\W\w|\r|\n|*]*\s*\*\//gm,                      // 多行注释
    ],
    "html,vue,svelte" : [
        /\<\!--[\s\r\n-]*?[\w\r\n-\W]*?[\s\r\n-]*?--\>/gm,    // 注释
    ]
} 

/**
* 匹配文件中的注释部分
*/
function removeComments(code:string,language="js"){
    Object.entries(commentRegexs).forEach(([filetype,regexps])=>{
        if(filetype.split(",").includes(filetype)){
            regexps.forEach(regex=>{
                code = code.replaceAll(regex,"")
            })
        }
    })
    return code
} 

// const messageExtractors = [
//     /[ \\t\\^;\\{\\(\\,=\\'\\"\\.\\[\\|\\+\\>]t\(\s*("|'){1}(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))/gm,
//     /\<Translate[^:#@]*?message\s*=\s*(["'])(?<text>.*?)\1/gm
// ]
   
const messageExtractors = [
    /[ \t\^;\{\(,='"\.\[\|\+\>](__T_FUNC__)\(\s*(["'])(?<text>.*?)(?=(\2\s*\))|(\2\s*\,))/,
    /<(__T_COMPONENT__)[^:#@\>]*?message\s*=\s*(["'])(?<text>.*?)\2[\s\/\>]/
]
   
function getMessageExtractors(options:{tFuncNames:string[],tComponentNames:string[]}){
    const { tFuncNames = ['t','$t'], tComponentNames=['Translate','v-translate'] } = options
    return messageExtractors.map(regex=>{
        return new RegExp(encodeRegExp(regex,{
            "__T_FUNC__"     : tFuncNames.map(n=>escapeRegex(n)).join("|"),
            "__T_COMPONENT__": tComponentNames.map(n=>escapeRegex(n)).join("|")
        }),"gm")
    })
}

/**
 * 使用正则表达式提取翻译文本
 * 
 * parseTranslateFunction("t('hello')") => [{text:"hello"}]
 * parseTranslateFunction("t('a') t('ns::b')") => [{text:"a"},{text:"b",namespace:"ns"}]
 * 
 * @param {*} content 
 * @returns 
 */
export function parseTranslateMessagesByRegex(code:string,options:ExtractMessagesOptions){
    const { tFuncNames, tComponentNames } = Object.assign({
        tFuncNames     : ['t','$t'],
        tComponentNames: ['Translate','v-translate']
    },options)
    let result
    let messages:MessageNode[] = []

    const messageExtractors = getMessageExtractors({ tFuncNames, tComponentNames })

    for(let regex of messageExtractors){
        while ((result = regex.exec(code)) !== null) {
            // 这对于避免零宽度匹配的无限循环是必要的
            if (result.index === regex.lastIndex) {
              regex.lastIndex++;
            }           
            const text = result.groups?.text 
            if(text){
                messages.push({
                  message: text,
                  rang   : { start:result.index, end:result.index+result[0].length }
                })
            }
        }
    }    
    return messages 
 }

 
export function extractMessagesUseRegex(code:string,options:ExtractMessagesOptions):MessageNode[]{
    const { file, namespaces, language}  = options   
    const namespace = file ? getFileNamespace(file, namespaces) :'default'

    code = removeComments(code,language)

    const messages = parseTranslateMessagesByRegex(code,options)

    return messages.map((message:any)=>({        
        vars:undefined,
        options:undefined,
        namespace,
        file,
        ...message
    }))
}
/**
 * 提取要翻译的文本信息
 * 
 * @param code 
 * @returns
 * [
 *   {text:"xxxx",rang,vars:[],options:{}},
 * ]
 */
export function extractMessages(code:string,options?:ExtractMessagesOptions):MessageNode[]{    
    const  opts   = Object.assign({
        language  : 'ts', 
        namespaces: {}
    },options) as Required<ExtractMessagesOptions> 
    return extractMessagesUseRegex(code,opts)
}
 
         