const { t } = require("../../i18n");
const glob = require("fast-glob");
const { extractMessages } = require("@voerkai18n/utils/extract");
const logsets = require("logsets");
const path = require("path"); 
const { readFile } = require("flex-tools/fs/nodefs");
const { getDefaultLanguage } = require("./utils");

/**
 * 生成要翻译的文本内容
 * {
 *    message:{ }
 * }
 * @param {*} messages 
 * @returns 
 */
function formatParagraphs(paragraphs,ctx){
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



async function overwriteParagraphs(newParagraphs){    
    const ctx = this
    for(let newParagraph of Object.values(newParagraphs)){
        newMessage.$id = getNextId()
    }
    await writeFile(namespaceFile,JSON.stringify(newMessages,null,4))
}


async function syncParagraphs(paragraphs){    
    const ctx = this
}
/**
 * 
 * 
 * 
 *     type ParagraphNode = {
 *         id?        : string
 *         message   : string
 *         vars?      : string
 *         scope?     : string
 *         options?   : string
 *         rang     : { start: string, end: string } 
 *         file?     : string
 }
  * @param {ParagraphNode[]} paragraphs
 */
async function updateParagraphs(paragraphs,ctx){    
    const mode = ctx.mode || 'sync' 

    for(let paragraph of paragraphs){
        const paragraphFile = path.join(ctx.getTranslateParagraphsDir(),`${paragraph.id}.html`)
        const isExisted = fs.existsSync(paragraphFile)
        if(isExisted && mode === 'overwrite') {
            await overwriteMessages.call(ctx,paragraphs)
        }else{
            await syncParagraphs.call(ctx,paragraphs)
        }
    }
}


