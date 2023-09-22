/**
 * 
 * Gulp插件，用来提取指定文件夹中的翻译文本并输出到指定目录
 * 
 * 本插件需要配合gulp.src(...)使用
 * 
*/
const through2 = require('through2')
const deepmerge = require("deepmerge")
const path = require('path')
const fs = require('fs-extra')
const createLogger = require("logsets") 
const { t } = require("./i18nProxy") 
const replaceAll = require('string.prototype.replaceall');
replaceAll.shim()

const logger = createLogger() 


// 捕获翻译文本正则表达式一： 能匹配完整的t(xx,...)函数调用，如果t函数调用不完整，则不能匹配到
//  但是当t(xxx,...复杂的表达式时....)则不能正确匹配到，因此放弃该正则表达式
// const DefaultTranslateExtractor = String.raw`\b{funcName}\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>.*?)(((\1\s*\)){1})|((\1){1}\s*(,(\w|\d|(?:\{.*\})|(?:\[.*\])|([\"\'\(].*[\"\'\)]))*)*\s*\)))`

// 捕获翻译文本正则表达式二： 能够支持复杂的表达式，但是当提供不完整的t函数定义时，也会进行匹配提取 
const DefaultTranslateExtractor = String.raw`\bt\(\s*("|'){1}(?:((?<namespace>\w+)::))?(?<text>.*?)(?=(\1\s*\))|(\1\s*\,))`


// 从html文件标签中提取翻译文本
const DefaultHtmlAttrExtractor = String.raw`\<(?<tagName>\w+)(.*?)(?<i18nKey>{attrName}\s*\=\s*)([\"\'']{1})(?<text>.*?)(\4){1}\s*(.*?)(\>|\/\>)`

// 声明各种语言的注释匹配正则表达式
// {"js,jsx"}
const commentRegexs ={
    "js,vue,jsx,ts,tsx":[
        /(^[^\n\r\w\W]*\/\/.*$)|(\/\/.*$)/gm,                   // 单行注释
        /\/\*\s*[\W\w|\r|\n|*]*\s*\*\//gm,                      // 多行注释
    ],
    "html,vue":[
        /\<\!--[\s\r\n-]*?[\w\r\n-\W]*?[\s\r\n-]*?--\>/gm,    // 注释
    ]
} 

/**
* 匹配文件中的注释部分
*/
function removeComments(content,filetype="js"){
    Object.entries(commentRegexs).forEach(([filetype,regexps])=>{
        if(filetype.split(",").includes(filetype)){
            regexps.forEach(regex=>{
                 content = content.replaceAll(regex,"")
            })
        }
    })
    return content
}


/**
 * 
 * 返回filePath是否在nsPaths名称空间内
 * 
 * inNamespace("a/b/c/xxx.js","a/b")  == true
 * inNamespace("a/c/c/xxx.js","a/b")  == false
 * 
 * @param {*} filePath  文件路径
 * @param {*} nsPath  名称空间的路径
 * @returns 
 */
function inNamespace(filePath,nsPath){
    return !path.relative(nsPath,filePath).startsWith("..") 
}
// 获取指定文件的名称空间
/**
 * 
 * @param {*} file 
 * @param {*} options.namespaces  名称空间配置 {<name>:[path,...,path],<name>:path,<name>:(file)=>{}}
 */
 function getFileNamespace(file,options){
    const {output, namespaces } = options
    const fileRefPath = file.relative.toLowerCase()   // 当前文件相对源文件夹的路径
    for(let [name,paths] of Object.entries(options.namespaces)){ 
        for(let nsPath of paths){
            if(typeof(nsPath) === "string" && inNamespace(fileRefPath,nsPath)){
                return name
            }else if(typeof nsPath === "function" && nsPath(file)===true){
                return name
            }            
        } 
    }
    return "default"
}
 

/**
 * 使用正则表达式提取翻译文本
 * @param {*} content 
 * @param {*} file 
 * @param {*} options 
 * @returns   {namespace:{text:{zh:"",en:"",...,$file:""},text:{zh:"",en:"",...,$file:""}}
 */
function extractTranslateTextUseRegexp(content,namespace,extractor,file,options){
  
    let { languages,defaultLanguage } = options
     
    // 移除代码中的注释，以便正则表达式提取翻译文本时排除注释部分
    const fileExtName = file.extname.substr(1).toLowerCase()  // 文件扩展名
    content = removeComments(content,fileExtName)
    let result
    let texts = {}
    while ((result = extractor.exec(content)) !== null) {
        // 这对于避免零宽度匹配的无限循环是必要的
        if (result.index === extractor.lastIndex) {
            extractor.lastIndex++;
        }   
        const text = result.groups.text
        if(text){
            const ns = result.groups.namespace || namespace
            if(!(ns in texts)){
                texts[ns]  = {}
            }
            texts[ns][text] ={} 
            languages.forEach(language=>{
                if(language.name !== defaultLanguage){
                    texts[ns][text][language.name] = text
                }                
            })
            texts[ns][text]["$file"]=[file.relative]
        }
    }
    return texts
}

/**
 * 使用函数提取器 
 * @param {*} content 
 * @param {*} namespace 
 * @param {*} extractor   函数提取器(content,file,options)
 * @param {*} file 
 * @param {*} options 
 * @returns {}
 */
function extractTranslateTextUseFunction(content,namespace,extractor,file,options){
    let texts = extractor(content,file,options)
    if(typeof(texts)==="object"){
        return texts
    }else{
        return {}
    } 

}

/**
 * 
 * 返回指定文件类型的提取器
 * @param {*} filetype  文件扩展名
 * @param {*} extractor 提取器配置={default:[],js:[],html:[],"sass,css":[],json:[],"*":[]}"}
 */
function getFileTypeExtractors(filetype,extractor){
    if(!typeof(extractor)=="object") return null
    let matchers=[]
    for(let [key,value] of Object.entries(extractor)){
        if(filetype.toLowerCase()===key.toLowerCase()){
            matchers =  value
            break
        }else if(key.split(",").includes(filetype)){
            matchers = value
            break
        }
    }
    // * 适用于所有文件类型
    if("*" in extractor){
        matchers = matchers.concat(extractor["*"])
    }
    // 如果没有指定提取器，则使用默认提取器
    if(matchers.length===0){
        matchers = extractor["default"]
    }
    return matchers
}
/**
 *  找出要翻译的文本列表 {namespace:[text,text],...}
 * {namespace:{text:{zh:"",en:"",$source:""},...}
 * @param {*} content 
 * @param {*} extractor 
 * @returns 
 */
function getTranslateTexts(content,file,options){
    
    let { extractor: extractorOptions,languages,defaultLanguage,activeLanguage,debug } = options

    if(!options || Object.keys(extractorOptions).length===0) return

    // 获取当前文件的名称空间
    const namespace = getFileNamespace(file,options)
    const fileExtName = file.extname.substr(1).toLowerCase()  // 文件扩展名

    let texts = {}
    // 提取器
    let useExtractors = getFileTypeExtractors(fileExtName,extractorOptions)

    // 分别执行所有提取器并合并提取结果
    return useExtractors.reduce((preTexts,extractor)=>{
        let matchedTexts = {} , extractFunc = ()=>{}  
        if(extractor instanceof RegExp){
            extractFunc = extractTranslateTextUseRegexp
        }else if(typeof(extractor) === "function"){
            extractFunc = extractTranslateTextUseFunction
        }else{
            return preTexts
        }  
        try{
            matchedTexts = extractFunc(content,namespace,extractor,file,options)
        }catch(e){
            console.error(`Extract translate text has occur error from ${file.relative}:${extractor.toString()}.`,e)
        }        
        return deepmerge(preTexts,matchedTexts)
    },texts) 
}

const defaultExtractLanguages  = [
    {name:'en',title:"英文"},
    {name:'zh',title:"中文",default:true},
    {name:'de',title:"德语"},
    {name:'fr',title:"法语"},
    {name:'es',title:"西班牙语"},
    {name:'it',title:"意大利语"},
    {name:'jp',title:"日語"}
]

function normalizeLanguageOptions(options){
    options = Object.assign({
        debug          : true,                    // 输出调试信息，控制台输出相关的信息 
        languages      :defaultExtractLanguages,  // 默认要支持的语言            
        defaultLanguage: "zh",                    // 默认语言：指的是在源代码中的原始文本语言
        activeLanguage : "zh",                    // 当前激活语言：指的是当前启用的语言，比如在源码中使用中文，在默认激活的是英文
        extractor        : {                      // 匹配翻译函数并提取内容的正则表达式
            "*"                 :    DefaultTranslateExtractor,
            "html,vue,jsx"      :    DefaultHtmlAttrExtractor
        }, 
        namespaces     : {},                      // 命名空间, {[name]: [path,...,path]}
        output         : {                       
            path       : null,                    // 输出目录，如果没有指定则输出到原目录/languages
            // 输出文本时默认采用合并更新方式,当重新扫描时输出时可以用来保留已翻译的内容
            // 0 - overwrite 覆盖模式，可能导致翻译了一半的原始内容丢失(不推荐)，
            // 1 - merge 合并，尽可能保留原来已翻译的内容
            // 2 - sync 同步， 在合并基础上，如果文本已经被删除，则同步移除原来的内容
            updateMode  : 'sync',                    
        },
        // 以下变量会被用来传递给提取器正则表达式
        translation    : {
            funcName   : "t",                       // 翻译函数名称
            attrName   :"data-i18n",                // 用在html组件上的翻译属性名称
        }
    },options) 
    // 输出配置
    if(typeof(options.output)==="string"){
        options.output = {path:options.output,updateMode: 'sync'}
    }else{
        options.output = Object.assign({},{updateMode: 'sync',path:null},options.output)
    }
    // 语言配置  languages = [{name:"en",title:"英文"},{name:"zh",title:"中文",active:true,default:true}]
    if(!Array.isArray(options.languages)){
        throw new TypeError("options.languages must be an array")
    }else{
        if(options.languages.length === 0)  throw new TypeError("options.languages'length must be greater than 0")
        let defaultLanguage = options.defaultLanguage
        let activeLanguage = options.activeLanguage
        options.languages = options.languages.map(item=>{
            let language = item
            if(typeof item === "string"){
                return {name:item,title:item}
            }else if(typeof item === "object"){
                return Object.assign({name:"",title:""},item)
            }
            if(typeof(item.title)==="string" && item.title.trim().length===0){
                item.title = item.name
            }
            // 默认语言
            if(item.default===true && item.name){
                defaultLanguage = item.name
            }
            // 激活语言
            if(item.active ===true && item.name){
                activeLanguage = item.name
            }
            return item
        })
        if(!defaultLanguage) defaultLanguage = options.languages[0].name
        options.defaultLanguage = defaultLanguage
        options.activeLanguage = activeLanguage 
    }
    // 提取正则表达式匹配
    if(typeof(options.extractor)==="string") options.extractor =  new RegExp(options.extractor,"gm")
    if(options.extractor instanceof RegExp){
        options.extractor = {default: [options.extractor] }  // 默认文件类型的匹配器
    }
    // extractor = {default:[regexp,regexp,...],js:[regexp,regexp,...],json:[regexp,regexp,...],"jsx,ts":[regexp,regexp,...],"*":[regexp,regexp,...],...}"}
    // 提取器可以是:正则表达式字符串、正则表达式或者是函数
    if(typeof(options.extractor)==="object"){ 
        if(Object.keys(options.extractor).length === 0){
            throw new TypeError("options.extractor must be an object with at least one key")
        }
        Object.entries(options.extractor).forEach(([filetype,value])=>{
            if(!Array.isArray(value)) value = [value] 
            value= value.map(item=>{
                if(typeof(item)==="string"){  // 如果是字符串，则支持插值变量后,转换为正则表达式
                    return new RegExp(item.params(options.translation),"gm")
                }else if(item instanceof RegExp){
                    return item
                }else if(typeof(item)==="function"){
                    return item
                }
            })
            options.extractor[filetype] = value
        })
        if(("*" in options.extractor) &&  options.extractor["*"].length===0) options.extractor["*"] = []
        if(("default" in options.extractor) &&  options.extractor["default"].length===0) options.extractor["default"] = [DefaultTranslateExtractor]
    }else{
        options.extractor= {default:[ DefaultTranslateExtractor ]}
    }
    // 名称空间
    if(typeof(options.namespaces)!=="object"){
        throw new TypeError("options.namespaces must be an object")
    }else{
        Object.entries(options.namespaces).forEach(([name,paths])=>{
            if(!Array.isArray(paths)) paths = [paths]
            if(typeof(name)==="string" && name.trim().length>0){
                options.namespaces[name] = paths
            }
        })
    }     
    return options
}

/**
    合并更新语言文件

    当使用extract提取到待翻译内容并保存到languages目标文件夹后
    翻译人员就可以对该文件夹内容进行翻译
    接下来，如果源码更新后，重新进行扫描extract并重新生成语言文件
    此时，需要将重新扫描后的文件合并到已经翻译了一半的内容，以保证翻译的内容不会丢失


 */
function updateLanguageFile(newTexts,toLangFile,options){
    const { output:{ updateMode } } = options
    
    // 默认的overwrite
    if(!["merge","sync"].includes(updateMode)){
        fs.writeFileSync(toLangFile,JSON.stringify(oldTexts,null,4))
        return 
    }
    let oldTexts = {}
    // 读取原始翻译文件
    try{
        oldTexts =JSON.parse(fs.readFileSync(toLangFile))
    }catch(e){
        logger.log(t("读取语言文件<{}>出错: {}"),toLangFile,e.message)
        // 如果读取出错，可能是语言文件不是有效的json文件，则备份一下
    }
    // 同步模式下，如果原始文本在新扫描的内容中，则需要删除
    if(updateMode==="sync"){
        Object.keys(oldTexts).forEach((text)=>{
            if(!(text in newTexts)){
                delete oldTexts[text]             
            }
        })
    }
    Object.entries(newTexts).forEach(([text,sourceLangs])=>{
        if(text in oldTexts){ // 合并 
            let targetLangs = oldTexts[text]  //{zh:'',en:''}
            Object.entries(sourceLangs).forEach(([langName,sourceText])=>{
                if(langName.startsWith("$")) return         // 以$开头的为保留字段，不是翻译内容
                const langExists = langName in targetLangs
                const targetText = targetLangs[langName]
                // 如果目标语言已经存在并且内容不为空，则不需要更新 
                if(!langExists){ // 不存在则创建新的翻译条目
                    targetLangs[langName] = sourceText                
                }
            })
        }else{
            oldTexts[text] = sourceLangs 
        }
    })
    fs.writeFileSync(toLangFile,JSON.stringify(oldTexts,null,4))
}


module.exports = function(options={}){
    options = normalizeLanguageOptions(options)
    let {debug,outputPath} = options
    
    logger.log(t("支持的语言\t: {}"),options.languages.map(item=>`${item.title}(${item.name})`).join(","))    
    logger.log(t("默认语言\t: {}"),options.defaultLanguage)
    logger.log(t("激活语言\t: {}"),options.activeLanguage) 
    logger.log(t("名称空间\t: {}"),Object.keys(options.namespaces).join(","))
    logger.log("")
    
    // 保存提交提取的文本 = {}
    let results = {}
    let fileCount=0  // 文件总数
    // file == vinyl实例
    return through2.obj(function(file, encoding, callback){
        // 如果没有指定输出路径，则默认输出到<原文件夹/languages>
        if(!outputPath){
            outputPath = path.join(file.base,"languages")
        }
        if(file.isNull()) return callback()
        if(file.isStream()) return callback()

        // 提取翻译文本
        try{
            const texts = getTranslateTexts(file.contents.toString(),file,options) 
            results = deepmerge(results,texts)
            fileCount++
            if(debug){
                const textCount = Object.values(texts).reduce((sum,item)=>sum+Object.keys(item).length,0)
                logger.log(t("提取<{}>, 发现 [{}] 名称空间，{} 条信息。"),file.relative,Object.keys(texts).join(","),textCount)
            }
        }catch(err){
            logger.log(t("从<{}>提取信息时出错 : {}"),file.relative,err.message)
        }
        
        callback()
    },function(callback){
        logger.log("")
        logger.log(t("翻译信息提取完成。"))
        logger.log(t(" - 文件总数\t: {}"),fileCount)
        logger.log(t(" - 输出路径\t: {}"),outputPath)
        const translatesPath = path.join(outputPath,"translates")
        if(!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)
        if(!fs.existsSync(translatesPath)) fs.mkdirSync(translatesPath)
        if(!("default" in results)){
            results["default"] = {}
        }
        // 每个名称空间对应一个文件
        for(let [namespace,texts] of Object.entries(results)){
            const langFile = path.join(outputPath,"translates",`${namespace}.json`)
            const isExists = fs.existsSync(langFile)
            const langTexts = {}
            if(isExists){
                updateLanguageFile(texts,langFile,options)
                logger.log(t("    √ 更新语言文件 : {}"),path.relative(outputPath,langFile))
            }else{
                fs.writeFileSync(langFile,JSON.stringify(texts,null,4)) 
                logger.log(t("    √ 保存语言文件 : {}"),path.relative(outputPath,langFile))
            }   
        }
        // 生成语言配置文件 settings.json  , 仅当不存在时才生成
        const settingsFile = path.join(outputPath,"settings.json")
        if(!fs.existsSync(settingsFile)){
            const settings = {
                languages      : options.languages,
                defaultLanguage: options.defaultLanguage,
                activeLanguage : options.activeLanguage,
                namespaces     : options.namespaces 
            }
            fs.writeFileSync(settingsFile,JSON.stringify(settings,null,4))
            logger.log(t(" - 生成语言配置文件: {}"),settingsFile) 
        }else{
            logger.log(t(" - 应用语言配置文件: {}"),settingsFile) 
        }    

        logger.log(t("下一步："))
        logger.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")
        logger.log(t(" - 在源码中从[{}]导入编译后的语言包"),options.entry)


        callback()               
    });
}


module.exports.getTranslateTexts = getTranslateTexts
module.exports.normalizeLanguageOptions = normalizeLanguageOptions