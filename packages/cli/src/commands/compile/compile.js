const { t } = require("../../i18n"); 
const path = require("node:path");
const logsets = require("logsets");
const glob = require("fast-glob"); 
const { readFile,writeFile } = require("flex-tools/fs/nodefs");



/**
 * 编译语言信息文件
 * 
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compileLanguageFile(language,allMessages,ctx){
    const { typescript, moduleType,langDir } = ctx;
    const messagesDir = path.join(langDir,"messages")
    if(!fs.existsSync(messagesDir)){
        fs.mkdirSync(messagesDir)
    }

    const langFile = path.join(messagesDir, `${language.name}.${typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"}`)    
    const compiledMessages = {}

    for(let [ text,translated ] of Object.entries(allMessages)){
        const id = translated.$id
        if(!id){
            throw new Error(t("翻译文本没有id: {}",text))
        }
        if(language.name in translated){
            compiledMessages[id] = translated[language.name]
        }else{
            compiledMessages[id] = text
        }
    }    
    const content = `${typescript || moduleType==='esm' ?  'export default ' : 'module.exports =' } ${JSON.stringify(compiledMessages,null,4)}`
    await writeFile(langFile,content,{ encoding: "utf-8" })    
}

async function generateIdMap(allMessages,ctx){
    const { langDir,tasks } = ctx         
    try{
        tasks.add([t("生成IDMap文件: {}"),`${langRelDir}/idMap.json`])
        const idMapFile = path.join(langDir,  "idMap.json")    
        const idMap = {}
        for(let [ text,translated ] of Object.entries(allMessages)){
            idMap[text] = translated.$id
        }
        const content = JSON.stringify(idMap,null,4)
        await writeFile(idMapFile,content,{ encoding: "utf-8" })
        tasks.complete()
    }catch(e){
        tasks.error(e)
    }
}

async function mergeTranslatedMessages(ctx){
    
    const translateDir = path.join(ctx.langDir,"translates")

    const files = await glob(["*.json","!*.bak.*.json"],{
        cwd     : translateDir,
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
 * 编译语言信息
 * @param {*} ctx 
 */
async function compileMessages(ctx){
    const { tasks,langRelDir, languages,typescript, moduleType } = ctx
    tasks.addGroup(t("编译语言信息："))
    const langExtName = typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"     
    for(let language of languages){
        try{
            tasks.add([t("编译: {}"),`${langRelDir}/messages/${language.name}.${langExtName}`])
            await compileLanguageFile( language, allMessages,ctx)
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }
}
/**
 * 编译段落文本
 * 
 * @param {*} ctx 
 */
async function compileParagraphts(ctx){
    const { tasks,langRelDir, languages,typescript, moduleType } = ctx
    tasks.addGroup(t("编译段落文本："))


}


/**
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compile(ctx){
    
    const { langRelDir } = ctx
 
    logsets.header(t("开始编译语言包: {}"),langRelDir)

    // 1. 合并所有翻译后的文本

    const allMessages = await mergeTranslatedMessages(ctx)
    ctx.tasks = logsets.tasklist({grouped:true})

    await compileMessages(ctx)

    await compileParagraphts(ctx)

    await generateIdMap(allMessages,ctx) 
    
    tasks.done()
}

 

module.exports = {
    compile
}