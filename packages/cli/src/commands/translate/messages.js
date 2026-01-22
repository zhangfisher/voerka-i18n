/**
 * 
 * 翻译文本信息
 * 
 * 
 */
const { t } = require("../../i18n"); 
const path = require("node:path")
const { startTranslate } = require("./translate")
const { writeFile } = require('flex-tools/fs/nodefs');
const { backupFile } = require("./utils");
const glob = require("fast-glob")
const { deepMerge }  = require("flex-tools/object/deepMerge")

/**
 * 
 * @param {string} file
 * @param {import("@voerkai18n/utils").VoerkaI18nProjectContext} ctx
 * 
 */
async function translateFileMessages(file){
    const { defaultLanguage,languages,language,tasks } = this
    const messages = require(file)    
 
    // texts = {text:{zh:"",en:"",...,jp:""}}
    let results = {}
    const lngs = language ? [{name:language}] : languages
    for(let lng of lngs ){
        if(lng.name === defaultLanguage) continue
        let task
        try{
            task = tasks.add(t("翻译 {} -> {}"),[defaultLanguage,lng.name])
            this.task = task
            const [msgs,count] = await startTranslate.call(this,messages,defaultLanguage,lng.name)
            if(count>0){
                results = deepMerge(results,msgs)
                task.complete(`${count}/${Object.keys(messages).length}`)
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



async function translateMessages(){
    const { tasks,langDir } = this
    const messagesDir = path.join(langDir,"translates","messages")

    const files = await glob(["*.json","!*.bak.*.json"],{
        cwd     : messagesDir,
        absolute: true
    })

    tasks.addMemo(t("翻译文本信息, 共{}个文件"),files.length)

    for(let file of files){
        const relFile= path.relative(process.cwd(),file)        
        tasks.addGroup(t("翻译{}"),relFile)            
        await translateFileMessages.call(this,file)        
    }   
}


module.exports = {
    translateMessages
}