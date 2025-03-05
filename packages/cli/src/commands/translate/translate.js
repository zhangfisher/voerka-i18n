 

const fs = require("node:fs") 
const path = require("node:path")
const { deepMerge }  = require("flex-tools/object/deepmerge")
const { delay } = require("flex-tools/async/delay") 
const { t } = require("../../i18n"); 


function getTranslateProvider(){
    const  { provider } = this;
    const providerFile = path.join(__dirname,`${provider}.provider.js`)
    try{
        if(fs.existsSync(providerFile)){
            return require(providerFile)(this.api)
        }else{
            return require(provider)(this)
        }        
    }catch(e){
        throw new Error(t("加载翻译提供者{}失败: {}").params([provider,e.message]))
    }
    
} 
 
async function sendToTranslate(messages={},from,to){
    let { qps=0 } = this
    const texts = Object.keys(messages)
    const lineCount = texts.length
    if(lineCount===0) return;
    const provider = getTranslateProvider.call(this)
    if(qps>0) await delay(1000/qps)
    let translatedMessages
    try{
        translatedMessages = await provider.translate.call(this,texts,from,to,this)
        if(lineCount!==translatedMessages.length){
            throw new Error(t("翻译后的内容与原始内容行数不一致"))
        }
    }catch(e){
        throw new Error(e.message)
    }
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
async function translateSingleLineMessage(messages={},from="zh",to="en"){
    const translatedMessages = await sendToTranslate.call(this,messages,from,to)
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
async function translateMultiLineMessage(messages={},from,to){
    const translatedMessages = await sendToTranslate.call(this,messages,from,to)
    return translatedMessages.join("\n")
}

/**
 * 判断是否翻译内容已经变化
 */
function isMessageUpdated(message,lngMessage){
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
async function startTranslate(messages,from,to){
    const ctx = this
    const { maxPackageSize,mode,task } = this;
    const result = messages                // 保存翻译结果    
    const msgCount = Object.keys(messages).length    
    const items  = Object.entries(messages)
    let translatedMessages = {}       // 保存已经翻译的内容    
    let packageSize = 0

    let translatedCount = 0

    for(let i=0;i<msgCount;i++){
        const [message,lngs ] = items[i]
        const langMessage = lngs[to]
        const hasUpdated = isMessageUpdated(message,langMessage)
        
        const needTranslate = mode=='full' || (mode=='auto' && !hasUpdated)
        if(needTranslate)  translatedCount++ 

        task.note(`${translatedCount}/${msgCount}`)
        
        if(Array.isArray(langMessage)){// 由于复数需要手动配置，不进行翻译
            result[message][to] = langMessage
            if(i<msgCount-1) continue
        }else if(mode == "auto" && hasUpdated){
            result[message][to] = langMessage
            if(i<msgCount-1) continue
        }else{
            if(!(message in result)) result[message] = {}
            // 由于百度翻译按\n来分行翻译，如果有\n则会出现多行翻译的情况。因此，如果有\n则就不将多条文件合并翻译
            if(message.includes("\n") && needTranslate){
                result[message][to] = await translateMultiLineMessage.call(this,message.split("\n"),from,to)
            }else if(needTranslate){            
                translatedMessages[message]={[to]:langMessage}
                packageSize += message.length        
            } 

        }
        // 多个信息合并进行翻译，减少请求次数
        if(packageSize>=maxPackageSize || i==msgCount-1){
            await translateSingleLineMessage.call(this,translatedMessages,from,to)
            deepMerge(result,translatedMessages)
            packageSize        = 0
            translatedMessages = {}
        }
    }
    return [result,translatedCount]
}

module.exports = {
    startTranslate,
    translateMultiLineMessage,
    translateSingleLineMessage
}