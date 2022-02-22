/**
 * 从源文件中提取要翻译的文本
 */

const through2 = require('through2')
const deepmerge = require("deepmerge")
const path = require('path')
const fs = require('fs')
const readJson = require("readjson")
const { deepStrictEqual } = require('assert')

// 捕获翻译函数的表达式
const DefaultTranslateMatcher =  /\bt\(\s*("|'){1}(?:((?<namespace>\w+):))?(?<text>.*?)(((\1\s*\)){1})|((\1){1}\s*(,(\w|\d|(?:\{.*\})|(?:\[.*\])|([\"\'\(].*[\"\'\)]))*)*\s*\)))/gm

// 获取指定文件的名称空间
/**
 * 
 * @param {*} file 
 * @param {*} namespaces  名称空间配置 {<name>:[path,...,path],<name>:path,<name>:(file)=>{}}
 */
 function getFileNamespace(file,options){
    const {output, namespaces } = options
    const refPath = file.relative.toLowerCase()  
    for(let [name,paths] of Object.entries(options.namespaces)){
        if(typeof paths === "string"){
            paths = [paths]
        }
        for(let path of paths){
            if(refPath.startsWith(path.toLowerCase())){
                return name
            }
        } 
    }
    return "default"
}

 
/**
 *  找出要翻译的文本列表 {namespace:[text,text],...}
 * {namespace:{text:{cn:"",en:"",$source:""},...}
 * @param {*} content 
 * @param {*} matcher 
 * @returns 
 */
function getTranslateTexts(content,file,options){
    
    let { matcher,languages,defaultLanguage } = options

    if(!matcher) return

    // 获取当前文件的名称空间
    const namespace = getFileNamespace(file,options)
    
    let texts = {default:{}}
    while ((result = matcher.exec(content)) !== null) {
        // 这对于避免零宽度匹配的无限循环是必要的
        if (result.index === matcher.lastIndex) {
            matcher.lastIndex++;
        }   
        const text = result.groups.text
        if(text){
            const ns = result.groups.namespace || namespace
            if(!(ns in texts)){
                texts[ns]  = {}
            }
            texts[ns][text] ={} 
            languages.forEach(language=>{
                if(language !== defaultLanguage){
                    texts[ns][text][language] = ""
                }                
            })
            texts[ns][text]["$file"]=[file.relative]
        }
    }
    return texts
}
 

function mergeLanguageFile(langFile,texts,options){



}

module.exports = function(options={}){
    options = Object.assign({
        debug          : true,                    // 输出调试信息
        format         : "js",                    // 目标文件格式，取值JSON,JS
        languages      : ["en","cn"],             // 目标语言列表
        defaultLanguage: "cn",                    // 默认语言
        matcher        : DefaultTranslateMatcher, // 匹配翻译函数并提取内容的正则表达式
        namespaces     : {},                      // 命名空间, {[name]: [path,...,path]}
        output         : null,                     //  输出目录，如果没有指定，则转让
        merge          : true,                    // 输出文本时默认采用合并更新方式
    },options) 
    let {debug,output:outputPath,languages} = options
    // 输出语言文件 {cn:{default:<文件>,namespace:<文件>},en:{default:{}}}
    let outputFiles = languages.map(language=>{}) 
    // 保存提交提取的文本 = {}
    let results = {}
    // file == vinyl实例
    return through2.obj(function(file, encoding, callback){
        // 如果没有指定输出路径，则默认输出到<原文件夹/languages>
        if(!outputPath){
            outputPath = path.join(file.base,"languages")
        }
        // 跳过空文件
        if(file.isNull()){ 
            return callback()
        }
        // 跳过流文件
        if(file.isStream()){
            return callback()
        }

        // 提取翻译文本
        const texts = getTranslateTexts(file.contents.toString(),file,options) 
        results = deepmerge(results,texts)

        callback()
    },function(callback){
        
        console.log("输出路径:",outputPath)
        const translatesPath = path.join(outputPath,"translates")
        if(!fs.existsSync(translatesPath)) fs.mkdirSync(translatesPath)

        for(let [namespace,texts] of Object.entries(results)){
            const langFile = path.join(outputPath,"translates",`${namespace}.json`)
            const isExists = fs.existsSync(langFile)
            const langTexts = isExists ? readJson.sync(langFile) : {}
            if(isExists && options.merge){
                mergeLanguageFile(langFile,langTexts,options)
            }else{
                fs.writeFileSync(langFile,JSON.stringify(texts,null,4)) 
            }                     
        }
        callback()               
    });
}