const { t } = require("../../i18n");
const fastGlob = require("fast-glob");
const { extractMessages } = require("@voerkai18n/utils")
const logsets = require("logsets");
const path = require("path");
const fs = require("node:fs");
const { readFile, writeFile } = require('flex-tools/fs/nodefs');
const { getProjectContext } = require("@voerkai18n/utils");

let messageIds = []

/**
 * 提取消息id
 * @param {*} settings 
 * @returns 
 */
async function getMessageIds(settings){
    const { langDir } = settings
    const files = await fastGlob(["*.json","!*.bak*.json"],{
        cwd: path.join(langDir,"translates"),
        absolute: true
    })
    const ids = []
    for(let file of files){
        const content = await readFile(file,{ encoding: "utf-8" })
        const messages = JSON.parse(content)
        for(let message of Object.values(messages)){
            if(message.$id) ids.push(message.$id)
        }        
    }
    messageIds = [...new Set(ids)]
    if(messageIds.length !== ids.length){ // 选出ids中的重复的id       
        const repeatIds = ids.filter((id, index) => ids.indexOf(id) !== index && ids.lastIndexOf(id) === index);
        logsets.log(logsets.colors.red(t("发现重复的文本id: {}")),repeatIds.join(", ")) 
    }
    return messageIds
}

function getNextId(){
    let id = messageIds.length + 1
    while(messageIds.includes(id)){
        id++
    }
    messageIds.push(id)
    return id
}


/**
 * 
 * @param {*} settings 
 * @returns  
 */
/**
 * 异步函数 `extractTexts` 用于从指定文件中提取需要翻译的文本。
 * 
 * @param {Object} ctx - 设置对象，包含提取文本的相关配置。
 * @param {string} ctx.langDir - 语言目录的路径。
 * @param {string} ctx.langRelDir - 相对于项目根目录的语言目录路径。
 * @param {Array<string>} [ctx.patterns] - 可选的文件匹配模式数组，用于扩展默认的匹配规则。
 * @returns {Promise<{ text,rang,args,options,file }>} 返回一个包含提取出的翻译文本的数组。
 * 
 * 该函数首先定义了一组默认的文件匹配模式，然后合并了用户自定义的模式。
 * 使用 fastGlob 函数查找匹配的文件，并逐个读取文件内容。
 * 对每个文件的内容调用 extractMessages 函数来提取翻译文本。
 * 提取过程中会记录任务进度和结果。
 * 最终返回所有提取出的翻译文本的数组。
 */
async function scanMessages(ctx,tasks){
    const {  langRelDir,patterns } = ctx 

    tasks.addGroup(t("提取参数："))
    tasks.create(t(" 更新模式: {}"),ctx.mode)    
    tasks.create(t(" 提取范围: {}"),patterns.join(", "))        
    tasks.create(t(" 通过{}参数增加文件匹配规则"),"--patterns")
    tasks.create(t(" 您可以通过修改{}文件的{}参数来调整提取范围"),`${langRelDir}/settings.json`,"patterns")    

    const files = await fastGlob(patterns,{
        cwd     : process.cwd(),
        absolute: true
    })
 

    const results = []

    let total = 0

    tasks.addGroup(t("开始提取："))    

    for(let file of files){
        try{
            const relFile= path.relative(process.cwd(),file)        
            tasks.add("提取{}",relFile)
            const code   = await readFile(file,{ encoding: "utf-8" }) 
            const result = await extractMessages(code,ctx.namespaces,{
                file      : relFile
            }) 
            if( result && result.length>0 ){
                results.push(...result)
            }
            if(result.length === 0){
                tasks.skip()
            }else{
                tasks.complete(["发现{}条文本",result.length])
            }
            total += result.length
        }catch(e){
            tasks.error(e)
        }
    }
    tasks.addGroup(t("提取结果:"))
    tasks.addMemo(t("名称空间：{}"), ["default",...Object.keys(ctx.namespaces ||[])].join(","))
    tasks.addMemo(t("共提取{}个文本"), total) 
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
 *    text:{ }
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
        messageRecord.$id = getNextId()
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
    for(let [text,newMessage] of Object.entries(newMessages)){
        if(text in oldMessages){
            results[text] = {}
            const oldMessage = oldMessages[text]
            Object.entries(newMessage).forEach(([langName,langText])=>{
                if(langName.startsWith("$")){
                    results[text][langName] = newMessage[langName]
                }else{
                    if(oldMessage[langName] !== text || Array.isArray(oldMessage[langName])){
                        results[text][langName] = oldMessage[langName]                        
                    }else{
                        results[text][langName] = langText
                    }
                }
            })
            if(oldMessage['$id']) {
                results[text]['$id'] = oldMessage['$id']
            }else{
                results[text]['$id'] = getNextId()
            }
        }else{
            results[text] = newMessage
            results[text]['$id'] = getNextId()
        }
    }
    await writeFile(namespaceFile,JSON.stringify(results,null,4))
    return results
}

async function overwriteMessages(namespaceFile,newMessages,settings){    
    for(let newMessage of Object.values(newMessages)){
        newMessage.$id = getNextId()
    }
    await writeFile(namespaceFile,JSON.stringify(newMessages,null,4))
}

/**
 * 根据从extraceTexts提取的文本按namespace进行分组
 * @param {*} messages 
 */
async function updateMessages(formattedMessages,ctx,tasks){    
    const { langDir } = ctx
    const mode = ctx.mode || 'sync'
    const translateDir = path.join(langDir,"translates")
    if(!fs.existsSync(translateDir)){
        fs.mkdirSync(translateDir)
    }

    for(let [namespace,messages] of Object.entries(formattedMessages)){
        const namespaceFile = path.join(langDir,"translates",`${namespace}.json`)
        if(fs.existsSync(namespaceFile)){
            if(mode === 'overwrite'){
                await overwriteMessages(namespaceFile,messages,ctx)
            }else{
                await syncMessages(namespaceFile,messages,ctx)
            }
        }else{
            await overwriteMessages(namespaceFile,messages,ctx)
        }                 
    }
} 

async function extractor(options){    

    const ctx = await getProjectContext(options)

    const tasks = logsets.tasklist({ width:88,grouped:true })

    await getMessageIds(ctx)

    // 1. 提取文本
    const messages = await scanMessages(ctx,tasks)
    // 2. 格式化文本
    const formattedMessages = formatMessages(messages,ctx)
    // 3. 保存文本    
    await updateMessages(formattedMessages,ctx,tasks)

    tasks.addGroup(t("下一步："))    
    tasks.addMemo(t("翻译{}文件"),"translates/*.json")
    tasks.addMemo(t("运行<{}>编译语言包"),"voerkai18n compile")
    tasks.addMemo(t("在源码中从<{}>导入编译后的语言包"), ctx.langRelDir )
    tasks.addMemo("Done!")
}


module.exports = extractor
