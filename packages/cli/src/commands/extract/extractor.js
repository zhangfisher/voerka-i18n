const { t } = require("../../i18n");
const fastGlob = require("fast-glob");
const { getLanguageDir, getVoerkaI18nSettings, extractTranslates } = require("@voerkai18n/utils")
const logsets = require("logsets");
const path = require("path");
const fs = require("node:fs");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');




/**
 * 
 * @param {*} settings 
 * @returns  
 */
/**
 * 异步函数 `extractTexts` 用于从指定文件中提取需要翻译的文本。
 * 
 * @param {Object} settings - 设置对象，包含提取文本的相关配置。
 * @param {string} settings.langDir - 语言目录的路径。
 * @param {string} settings.langRelDir - 相对于项目根目录的语言目录路径。
 * @param {Array<string>} [settings.patterns] - 可选的文件匹配模式数组，用于扩展默认的匹配规则。
 * @returns {Promise<{ text,rang,args,options,file }>} 返回一个包含提取出的翻译文本的数组。
 * 
 * 该函数首先定义了一组默认的文件匹配模式，然后合并了用户自定义的模式。
 * 使用 fastGlob 函数查找匹配的文件，并逐个读取文件内容。
 * 对每个文件的内容调用 extractTranslates 函数来提取翻译文本。
 * 提取过程中会记录任务进度和结果。
 * 最终返回所有提取出的翻译文本的数组。
 */
async function extractMessages(settings){
    const { langDir, langRelDir } = settings
    const patterns = [
        "**/*.{js,jsx,ts,tsx,vue}",
        "!coverage",
        "!.pnpm",
        "!**/*.test.*",
        "!**/*.spec.*",
        "!.vscode",
        "!dist",
        "!.git",
        "!.turbo",
        "!**/*.d.ts",
        "!node_modules",
        "!"+langRelDir 
    ]
    if(Array.isArray(settings.patterns)){
        patterns.push(...settings.patterns)
    } 

    logsets.header(t("开始提取要翻译的文本"))
    logsets.log(t(" - 更新模式: {}"),settings.mode)    
    logsets.log(t(" - 提取范围: {}"),patterns.join(", "))        
    logsets.log(t(" - 通过{}参数增加文件匹配规则"),"--patterns")
    logsets.log(t(" - 您可以通过修改{}文件的{}参数来调整提取范围"),`${langRelDir}/settings.json`,"patterns")    

    const files = await fastGlob(patterns,{
        cwd:process.cwd(),
        absolute:true
    })

    logsets.separator()

    logsets.header(t("共找到{}个文件"),files.length)

    const tasks = logsets.tasklist()

    const results = []

    let total = 0

    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            tasks.add("提取{}",relFile)
            const code   = await readFile(file,{ encoding: "utf-8" }) 
            const result = await extractTranslates(code,settings.namespaces,{
                file      : relFile
            }) 
            if(result && result.length>0){
                results.push(...result)
            }
            if(result.length === 0){
                tasks.skip()
            }else{
                tasks.complete(["发现{}个文本",result.length])
            }
            total += result.length            
        }catch(e){
            tasks.error(e)
        }       
    }
    logsets.separator()
    logsets.header(t("提取完成，发现名称空间：{}, 提取{}个文本"), Object.keys(settings.namespaces).join(", "),total)
    return results
}

function getTextRange(rang){
    return `${rang.start.line}:${rang.start.column}-${rang.end.line}:${rang.end.column}`
}

function getDefaultLanguage(languages){
    return languages.find(lng=>lng.default) || languages[0]
}
/**
 * 生成要翻译的文本内容
 * {
 *    text:{
 *    }
 * }
 * @param {*} messages 
 * @returns 
 */
function formatMessages(messages,settings){
    const languages = settings.languages.map(lng=>lng.name)
    const defaultLanguage = getDefaultLanguage(languages)
    const defaultMessageRecord =(text)=>languages.reduce((acc,lng)=>{
        if(lng!=defaultLanguage) acc[lng] = text
        return acc
    },{})

    return messages.reduce((results,message)=>{        
        const text = message.text
        if(!results[message.namespace]){
            results[message.namespace] = {}
        }        
        const messageRecord = text in results[message.namespace] ? results[message.namespace][text] : defaultMessageRecord(text)        

        if(!messageRecord.$files) messageRecord.$files = []
        const relFile = path.relative(process.cwd(),message.file)
        messageRecord.$files.push(`${relFile}(${getTextRange(message.rang)})`)        
        results[message.namespace][message.text] = messageRecord        
        return results
    },{})
}


/**
 * sync：同步（默认值）,两者自动合并，并且会删除在源码文件中不存在的文本。如果某个翻译已经翻译了一半也会保留。此值适用于大部情况，推荐。
overwrite：覆盖现存的翻译内容。这会导致已经进行了一半的翻译数据丢失，慎用。
merge：合并，与sync的差别在于不会删除源码中已不存在的文本。

 * @param {*} newMessages 
 * @param {*} settings 
 */

async function syncMessages(namespaceFile,newMessages,settings){    
    let oldMessages = await readFile(namespaceFile,{encoding:"utf-8"})
    oldMessages = JSON.parse(oldMessages) || {}
    const results = {}
    for(let [text,message] of Object.entries(newMessages)){
        if(text in oldMessages){
            const oldMessage = oldMessages[text]
            Object.entries(message).forEach(([langName,langText])=>{
                if(langName === '$files'){
                    results[text].$files = message.$files
                }else{
                    if(!(langName in oldMessage) || (oldMessage[langName] !== text)){                        
                        results[text][langName] = langText
                    }
                }
            })
        }else{
            results[text] = message
        }
    }
    await writeFile(namespaceFile,JSON.stringify(results,null,4))
    return results
}

async function overwriteMessages(namespaceFile,newMessages,settings){    
    await writeFile(namespaceFile,JSON.stringify(newMessages,null,4))
}
/**
 * 根据从extraceTexts提取的文本按namespace进行分组
 * @param {*} messages 
 */
async function updateMessages(formattedMessages,settings){    
    const langDir = getLanguageDir()
    const mode = settings.mode || 'sync'

    const tasks = logsets.tasklist()

    const translateDir = path.join(langDir,"translates")
    if(!fs.existsSync(translateDir)){
        fs.mkdirSync(translateDir)
    }

    for(let [namespace,messages] of Object.entries(formattedMessages)){
        const namespaceFile = path.join(langDir,"translates",`${namespace}.json`)
        const namespaceRelFile = path.relative(process.cwd(),namespaceFile).replaceAll(path.sep,"/")
        const task = tasks.add("保存到{}",namespaceRelFile)
        try{
            if(fs.existsSync(namespaceFile)){
                if(mode === 'overwrite'){
                    await overwriteMessages(namespaceFile,messages,settings)
                    task.complete('overwrite')
                }else{
                    await syncMessages(namespaceFile,messages,settings)
                    task.complete('sync')
                }
            }else{
                await overwriteMessages(namespaceFile,messages,settings)
                task.complete()
            }            
        }catch(e){
            task.error(e)
        }        
    }

}
 

async function extractor(options){   

    const settings = await getVoerkaI18nSettings();
    settings.langDir = getLanguageDir()
    settings.langRelDir = path.relative(process.cwd(),settings.langDir).replaceAll(path.sep,"/")
    Object.assign(settings,options)
    // 1. 提取文本
    const messages = await extractMessages(settings)
    // 2. 格式化文本
    const formattedMessages = formatMessages(messages,settings)
    // 3. 保存文本
    
    await updateMessages(formattedMessages,settings) 
    
    logsets.separator()
    logsets.log(t("下一步："))
    logsets.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")
    logsets.log(t(" - 在源码中从[{}]导入编译后的语言包"),options.entry)

}


module.exports = extractor
