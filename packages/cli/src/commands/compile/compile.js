const { t } = require("../../i18n"); 
const path = require("node:path");
const logsets = require("logsets");
const fastGlob = require("fast-glob"); 
const { readFile,writeFile } = require("flex-tools/fs/nodefs");



/**
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compileLanguageFile(language,allMessages,ctx){
    const { typescript, moduleType,langDir,defaultLanguage } = ctx;

    const langFile = path.join(langDir,  `${language.name}.${typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"}`)    
    const compiledMessages = {}

    for(let [ text,translated ] of Object.entries(allMessages)){
        const id = translated.$id
        if(!id){
            throw new Error(t("翻译文本没有id: {}",text))
        }
        if(language.name in translated){
            compiledMessages[id] = translated[language.name]
        }else{
            if(language.name === defaultLanguage){
                compiledMessages[id] = text
            }
        }
    }    
    const content = `${typescript || moduleType==='esm' ?  'export default ' : 'module.exports =' } ${JSON.stringify(compiledMessages,null,4)}`
    await writeFile(langFile,content,{ encoding: "utf-8" })    
}

async function generateIdMap(allMessages,ctx){
    const { typescript,moduleType,langDir } = ctx
    const langExtName = typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"
    const idMapFile = path.join(langDir,  `idMap.${langExtName}`)    
    const idMap = {}
    for(let [ text,translated ] of Object.entries(allMessages)){
        idMap[text] = translated.$id
    }
    const content = `${ typescript || moduleType==='esm' ?  'export default ' : 'module.exports ='} ${JSON.stringify(idMap,null,4)}`
    await writeFile(idMapFile,content,{ encoding: "utf-8" })
}

async function mergeTranslatedMessages(ctx){
    
    const translateDir = path.join(ctx.langDir,"translates")

    const files = await fastGlob(["*.json","!*.bak.*.json"],{
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
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compile(ctx){
    
    const { langRelDir,typescript,moduleType,languages} = ctx
 
    logsets.header(t("开始编译语言包: {}"),langRelDir)

    // 1. 合并所有翻译后的文本

    const allMessages = await mergeTranslatedMessages(ctx)
    const langExtName = typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"

    const tasks = logsets.tasklist({grouped:true})
    
    for(let language of languages){
        try{
            tasks.add([t("编译: {}"),`${langRelDir}/${language.name}.${langExtName}`])
            await compileLanguageFile( language, allMessages,ctx)
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }
    try{
        tasks.add([t("生成IDMap文件: {}"),`${langRelDir}/idMap.${langExtName}`])
        await generateIdMap(allMessages,ctx)
        tasks.complete()
    }catch(e){
        tasks.error(e)
    }
    
    tasks.done()
}

 

module.exports = {
    compile
}