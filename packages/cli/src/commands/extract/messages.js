const path = require("path");
const fs = require("node:fs");
const {readFile, writeFile } = require('flex-tools/fs/nodefs'); 
const glob = require("fast-glob");


let messageIds = []

/**
 * 提取消息id
 * @param {*} ctx 
 * @returns 
 */
async function getMessageIds(ctx){
    const { getTranslateMessagesDir } = ctx
    const files = await glob(["*.json","!*.bak*.json"],{
        cwd: getTranslateMessagesDir(),
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


function getDefaultLanguage(languages){
    return languages.find(lng=>lng.default) || languages[0]
}

/**
 * 生成要翻译的文本内容
 * {
 *    message:{ }
 * }
 * @param {*} messages 
 * @returns 
 */
function formatMessages(messages,ctx){
    const languages = ctx.languages.map(lng=>lng.name)
    const defaultLanguage = getDefaultLanguage(languages)
    const defaultMessageRecord =(text)=>languages.reduce((acc,lng)=>{
        if(lng!=defaultLanguage) acc[lng] = text
        return acc
    },{})
    return messages.reduce((results,record)=>{        
        const message = record.message
        if(!results[record.namespace]){
            results[record.namespace] = {}
        }
        const messageRecord = message in results[record.namespace] ? results[record.namespace][message] : defaultMessageRecord(message) 
        if(!messageRecord.$files) messageRecord.$files = []
        const relFile = path.relative(process.cwd(),record.file).replaceAll("\\","/")
        messageRecord.$files.push(`${relFile}(${record.rang.start}-${record.rang.end})`)
        messageRecord.$id = getNextId()
        results[record.namespace][record.message] = messageRecord
        return results
    },{})
}



async function overwriteMessages(namespaceFile,newMessages){    
    for(let newMessage of Object.values(newMessages)){
        newMessage.$id = getNextId()
    }
    await writeFile(namespaceFile,JSON.stringify(newMessages,null,4))
}

/**
 * 根据从extraceTexts提取的文本按namespace进行分组
 * @param {*} messages 
 */
async function updateMessages(formattedMessages,ctx){    
    const mode = ctx.mode || 'sync' 
    const translateMessagesDir = ctx.getTranslateMessagesDir()
    for(let [namespace,messages] of Object.entries(formattedMessages)){
        const namespaceFile = path.join(translateMessagesDir,`${namespace}.json`)
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

/**
 * sync：同步（默认值）,两者自动合并，并且会删除在源码文件中不存在的文本。如果某个翻译已经翻译了一半也会保留。此值适用于大部情况，推荐。
overwrite：覆盖现存的翻译内容。这会导致已经进行了一半的翻译数据丢失，慎用。
merge：合并，与sync的差别在于不会删除源码中已不存在的文本。

 * @param {*} newMessages 
 * @param {*} settings 
 */

async function syncMessages(namespaceFile, newMessages) {
    let oldMessages = await readFile(namespaceFile, { encoding: "utf-8" });
    oldMessages = JSON.parse(oldMessages) || {};
    const results = {};
    for (let [message, newMessage] of Object.entries(newMessages)) {
      if (message in oldMessages) {
        results[message] = {};
        const oldMessage = oldMessages[message];
        Object.entries(newMessage).forEach(([langName, langMessage]) => {
          if (langName.startsWith("$")) {
            results[message][langName] = newMessage[langName];
          } else {
            if (
              langName in oldMessage &&
              (oldMessage[langName] !== message ||
                Array.isArray(oldMessage[langName]))
            ) {
              results[message][langName] = oldMessage[langName];
            } else {
              results[message][langName] = langMessage;
            }
          }
        });
        if (oldMessage["$id"]) {
          results[message]["$id"] = oldMessage["$id"];
        } else {
          results[message]["$id"] = getNextId();
        }
      } else {
        results[message] = newMessage;
        results[message]["$id"] = getNextId();
      }
    }
    await writeFile(namespaceFile, JSON.stringify(results, null, 4));
    return results;
  }


module.exports = {
    formatMessages,
    updateMessages,
    overwriteMessages,
    getDefaultLanguage,
    getMessageIds,
    syncMessages,
    getNextId
}
