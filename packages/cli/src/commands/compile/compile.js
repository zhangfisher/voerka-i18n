const { t } = require("../../i18n"); 
const path = require("node:path");
const logsets = require("logsets");
const glob = require("fast-glob"); 
const { readFile } = require("flex-tools/fs/nodefs");
const {  compileMessages } = require("./messages");
const {  compileParagraphs } = require("./paragraphs");
const {  generateIdMap } = require("./idMap");
const { getDir } = require("@voerkai18n/utils");

async function mergeTranslatedMessages(){    
    const { tasks, langDir } = this
    const messagesDir = getDir(path.join(langDir,"translates","messages"))

    tasks
    const files = await glob(["*.json","!*.bak.*.json"],{
        cwd     : messagesDir,
        absolute: true
    })
    const messages = {}
    for(let file of files){
        const content = await readFile(file, { encoding: "utf-8" })
        Object.assign(messages,JSON.parse(content,null,4))
    }
    return messages
}

/**
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compile(ctx){
    
    const { langRelDir } = ctx
 
    logsets.header(t("开始编译语言包: {}"),langRelDir)
 
    const allMessages = await mergeTranslatedMessages.call(ctx)

    ctx.tasks = logsets.tasklist({grouped:true})

    await compileMessages.call(ctx,allMessages)
    
    await generateIdMap.call(ctx,allMessages)     

    await compileParagraphs.call(ctx)
 
    ctx.tasks.done()
}

 

module.exports = {
    compile
}