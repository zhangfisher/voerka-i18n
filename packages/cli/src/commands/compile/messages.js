/**
 * 
 * 编译文本信息
 * 
 */


const { t } = require("../../i18n"); 
const path = require("node:path");
const { writeFile } = require("flex-tools/fs/nodefs");
const { getDir } = require("@voerkai18n/utils");
const { readJsonFile } = require("flex-tools/fs/readJsonFile");


/**
 * 编译语言信息文件
 * 
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 */
async function compileMessagesFile(language,allMessages,formatters){
    const { typescript, moduleType,langDir } = this
    const messagesDir = getDir(path.join(langDir,"messages"))

    


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
    
    if(formatters && language.name in formatters){
        compiledMessages.$config = formatters[language.name]
    }

    const jsonContent = `${typescript || moduleType==='esm' ?  'export default ' : 'module.exports =' } ${JSON.stringify(compiledMessages,null,4)}`

    await writeFile(langFile,jsonContent,{ encoding: "utf-8" })    

} 

/**
 * 编译语言信息
 * @param {*} ctx 
 */
async function compileMessages(allMessages){
    const { tasks, langDir, langRelDir, languages,typescript, moduleType } = this
    tasks.addGroup(t("编译语言信息："))
    const langExtName = typescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"     

    const formatters = await readJsonFile(path.join(langDir,"formatters.json")) 

    for(let language of languages){
        try{
            tasks.add([t("编译: {}"),`${langRelDir}/messages/${language.name}.${langExtName}`])
            await compileMessagesFile.call(this, language, allMessages,formatters)
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }
} 

 

module.exports = {
    compileMessages
}