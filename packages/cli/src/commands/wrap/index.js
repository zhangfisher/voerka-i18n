const { MixCommand } = require("mixcli");
const { t } = require("../../i18n"); 
const path = require("node:path");
const logsets = require("logsets");
const fastGlob = require("fast-glob");
const { getVoerkaI18nSettings, getLanguageDir } = require("@voerkai18n/utils");
const { isTypeScriptPackage } = require("flex-tools/package/isTypeScriptPackage");
const { getPackageModuleType } = require("flex-tools/package/getPackageModuleType");
const { readFile,writeFile } = require("flex-tools/fs/nodefs");



async function compileLanguageFile(language,allMessages,settings){
    const { isTypescript, moduleType,langDir } = settings;

    const langFile = path.join(langDir,  `${language.name}.${isTypescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"}`)    
    const compiledMessages = {}

    for(let [ text,translated ] of Object.entries(allMessages)){
        const id = translated.$id
        if(!id){
            throw new Error(`翻译文本没有id: ${text}`)
        }
        if(language.name in translated){
            compiledMessages[id] = translated[language.name]
        }else{
            if(language.name === settings.defaultLanguage){
                compiledMessages[id] = text
            }
        }
    }    
    const content = `${ moduleType==='cjs' ? 'module.exports =' : 'export default '} ${JSON.stringify(compiledMessages,null,4)}`
    await writeFile(langFile,content,{ encoding: "utf-8" })    
}

async function generateIdMap(allMessages,settings){
    const { isTypescript, moduleType,langDir } = settings;
    const idMapFile = path.join(langDir,  `idMap.${isTypescript ? "ts" : moduleType === "cjs" ? "js" : "mjs"}`)    
    const idMap = {}
    for(let [ text,translated ] of Object.entries(allMessages)){
        idMap[text] = translated.$id
    }
    const content = `${ moduleType==='cjs' ? 'module.exports =' : 'export default '} ${JSON.stringify(idMap,null,4)}`
    await writeFile(idMapFile,content,{ encoding: "utf-8" })
}

async function mergeTranslatedMessages(settings){
    
    const translateDir = path.join(settings.langDir,"translates")

    const files = await fastGlob("*.json",{
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


async function compileLanguagePack(options){
    
    const settings      = await getVoerkaI18nSettings();
    const langDir       = getLanguageDir();
    const langRelDir     = path.relative(process.cwd(),langDir).replace(/\\/g,"/");
    settings.langDir     = langDir;
    settings.langRelDir   = langRelDir
    settings.isTypescript =  isTypeScriptPackage()
    Object.assign(settings,options)

 
    logsets.header(t("开始编译语言包: {}"),langRelDir)

    // 1. 合并所有翻译后的文本

    const allMessages = await mergeTranslatedMessages(settings)
    const langExtName = settings.isTypescript ? "ts" : settings.moduleType === "cjs" ? "js" : "mjs"

    const tasks = logsets.tasklist()

    for(let language of settings.languages){
        try{
            tasks.add(["编译语言文件: {}",`${langRelDir}/${language.name}.${langExtName}`])
            await compileLanguageFile( language, allMessages,settings)
            tasks.complete()
        }catch(e){
            tasks.error(e)
        }
    }
}


/**
 * @param {import('mixcli').MixCli} cli
 */
module.exports = (cli) => {
    const extractCommand = new MixCommand("compile");

    extractCommand
        .disablePrompts()
        .description(t("编译语言包"))
        .disablePrompts()
        .option("-t, --typescript", t("启用typescript"))
        .option("-m, --module-type [values...]", t("模块类型,取值:cjs,esm"))
        .action(async (options) => {
            const isTypescript = options.typescript || isTypeScriptPackage()
            const moduleType = options.moduleType || getPackageModuleType()
            await compileLanguagePack({
                isTypescript,
                moduleType
            });
        });
    return extractCommand;
};
