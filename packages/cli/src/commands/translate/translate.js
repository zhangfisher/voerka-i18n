const fs = require("node:fs")
const logsets = require("logsets") 
const path = require("node:path")
const { deepMerge }  = require("flex-tools/object/deepmerge")
const { delay } = require("flex-tools/async/delay")
const fastGlob = require("fast-glob")
const { t } = require("../../i18n");
const { getBackupFile } = require("@voerkai18n/utils")
const { readFile, writeFile } = require('flex-tools/fs/nodefs');


function getTranslateProvider(ctx={}){
    const  { provider } = ctx;
    const providerFile = path.join(__dirname,`${provider}.provider.js`)
    try{
        if(fs.existsSync(providerFile)){
            return require(providerFile)(ctx.api)
        }else{
            return require(provider)(ctx)
        }        
    }catch(e){
        throw new Error(t("加载翻译提供者{}失败: {}",[provider,e.message]))
    }
    
} 

/**
 * 文本中的插值变量不进行翻译，所以需要进行替换为特殊字符，翻译后再替换回来
 * 
 * 如“My name is {},I am {} years old” 先替换为“My name is {VARIABLE},I am {VARIABLE} years old” 
 * 翻译后再替换回来
 *  
 * @param {String | Object} messages 
 */
function replaceInterpVars(messages){
    const interpVars = []
    const msgs = Array.isArray(messages) ? messages : Object.keys(messages)
    const replacedMessages = msgs.map((message)=>{
        let vars=[]
        let result = message.replaceAll(/\{\s*.*?\s*\}/gm,(matched)=>{
            vars.push(matched)
            return `{VARIABLE}`
        })
        interpVars.push(vars)
        return result
    })
    return [replacedMessages,interpVars]
}

/**
 * 将翻译后的内容还原为插值变量
 * @param {String[]} messages   翻译后的内容
 * @param {*} interpVars 
 */
function restoreInterpVars(messages,interpVars){ 
    return messages.map((message,index)=>{
        let i = 0
        return message.replaceAll(/\{VARIABLE\}/gm,()=>interpVars[index][i++])
    })
}

async function startTranslate(messages={},from="zh",to="en",ctx={}){
    let { qps=1 } = ctx
    if(messages.length===0) return;
    const provider = getTranslateProvider(ctx)
    await delay(1000/qps)
    // 将文本中的插值变量替换为特殊字符，避免翻译时对插值变量进行翻译
    const [replacedMessages,interpVars] = replaceInterpVars(messages)
    let translatedMessages
    try{
        translatedMessages = await provider.translate(replacedMessages,from,to)
    }catch(e){
        throw new Error(t('调用翻译API服务时出错:{}',e.message))
    }
    translatedMessages = restoreInterpVars(translatedMessages,interpVars)
    Object.keys(messages).forEach((key,index)=>{
        messages[key][to] = translatedMessages[index]
    })
    return messages
}


/**
 * 翻译多条单行文本
 * @param {*} to 
 * @param {*} messages  保存要翻译的内容
 * @param {*} options 
 * @returns 
 */
async function translateSingleLineMessage(messages={},from="zh",to="en",options={}){
    const translatedMessages = await startTranslate(messages,from,to,options)
    Object.keys(messages).forEach((key)=>{
        messages[key][to] = translatedMessages[key][to]
    })
    return messages 
}

/**
 * 翻译多行文本
 * @param {*} messages 
 * @param {*} ctx 
 * @returns 
 */
async function translateMultiLineMessage(messages=[],from,to,ctx={}){
    const translatedMessages = await startTranslate(messages,from,to,ctx)
    return translatedMessages.join("\n")
}

/**
 * 判断是否翻译内容已经变化
 */
function isMessageChanged(message,lngMessage){
    return typeof(lngMessage)==="string" && (lngMessage!=message && lngMessage.trim()!="")
}

/**
 * 翻译指定的语言
 * @param {*} messages 
 * @param {*} from 
 * @param {*} to 
 * @param {*} options 
 * @returns 
 */
async function translateLanguage(messages,from,to,ctx,task){
    const { maxPackageSize,mode } = ctx;
    const result = {}                   // 保存翻译结果    
    const msgCount = Object.keys(messages).length    
    const items  = Object.entries(messages)
    let translatedMessages = {}       // 保存已经翻译的内容    
    let packageSize = 0

    for(let i=0;i<msgCount;i++){
        const [message,lngs ] = items[i]
        const langMessage = lngs[to]

        task.note(`${i+1}/${msgCount}`)
        
        if(Array.isArray(langMessage)){// 由于复数需要手动配置，不进行翻译
            result[message][to] = langMessage
        }else if(mode == "auto" && isMessageChanged(message,langMessage)){
            result[message][to] = langMessage
        }else{
            if(!(message in result)) result[message] = {}
            // 由于百度翻译按\n来分行翻译，如果有\n则会出现多行翻译的情况。因此，如果有\n则就不将多条文件合并翻译
            if(message.includes("\n")){
                result[message][to] = await translateMultiLineMessage(message.split("\n"),from,to,ctx)
            }else{            
                translatedMessages[message]={[to]:''}
                packageSize += message.length           
                // 多个信息合并进行翻译，减少请求次数
                if(packageSize>=maxPackageSize || i==msgCount-1){
                    await translateSingleLineMessage(translatedMessages,from,to,ctx)
                    deepMerge(result,translatedMessages)
                    packageSize        = 0
                    translatedMessages = {}
                }
            } 
        }  
    }
    return result 
}

/**
 * 
 * @param {string} file
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 * 
 */
async function translateFile(file,ctx,tasks){
    const { defaultLanguage,languages,language } = ctx
    const messages = require(file)    
 
    // texts = {text:{zh:"",en:"",...,jp:""}}
    let results = {}
    const lngs = language ? [{name:language}] : languages
    for(let lng of lngs ){
        if(lng.name === defaultLanguage) continue
        let task
        try{
            task = tasks.add(t("翻译 {} -> {}"),[defaultLanguage,lng.name])
            const msgs = await translateLanguage(messages,defaultLanguage,lng.name,ctx,task)
            if(Object.keys(msgs).length>0){
                results = deepMerge(results,msgs)
                task.complete()
            }else{
                task.skip()
            }
        }catch(e){
            task.error(e)
        }
    }

    if(Object.keys(results).length>0){        
        backupFile(file)                // 备份原始文件        
        await writeFile(file,JSON.stringify(results,null,4))
    }

} 


function backupFile(file){
    const bakFile = getBackupFile(file)
    fs.copyFileSync(file,bakFile)
} 


/**
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function translate(ctx) {
    const { langDir } = ctx 

    const tasks = logsets.tasklist({ width:80,grouped:true}) 

    const translateDir = path.join(langDir,"translates")

    const files = await fastGlob(["*.json","!*.bak*.json"],{
        cwd     : translateDir,
        absolute: true
    })

    logsets.header(t("准备翻译{}个文件"),files.length)
    
    for(let file of files){
        const relFile= path.relative(process.cwd(),file)        
        tasks.addGroup("翻译{}",relFile)            
        await translateFile(file,ctx,tasks)       // 翻译文件
    }   
}

module.exports = {
    translate
}