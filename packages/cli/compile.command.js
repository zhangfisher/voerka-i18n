#!/usr/bin/env node
/**
 * 将extract插件扫描的文件编译为语言文件
 * 
 * 编译后的语言文件用于运行环境使用
 * 
 * 编译原理如下：
 * 
 * 
 * 编译后会在目标文件夹输出:
 *    
 *    - languages
 *        translates
 *          - en.json
 *          - zh.json
 *          - ...
 *       idMap.js                    // id映射列表
 *       settings.json                 // 配置文件
 *       zh.js                       // 中文语言包
 *       en.js                       // 英文语言包
 *       [lang].js                   // 其他语言包
 * 
 * @param {*} opts 
 */

const { Command } = require('commander');
const glob  = require("glob")
const logger = require("logsets") 
const path = require("path")
const { i18nScope,t } = require("./i18nProxy")
const fs = require("fs-extra")
const artTemplate = require("art-template")
const semver = require("semver") 
const { 
    findModuleType,
    getProjectSourceFolder,
    getCurrentPackageJson, 
    getInstalledPackageInfo, 
    isTypeScriptProject,
    getPackageReleaseInfo,
    upgradePackage
} = require("@voerkai18n/utils")


function normalizeCompileOptions(opts={}) {
    let options = Object.assign({
        moduleType:"auto",                               // 指定编译后的语言文件的模块类型，取值common,cjs,esm,es
        isTypeScript:false
    }, opts)
    options.moduleType = options.moduleType.trim()
    if(options.moduleType==="es") options.moduleType = "esm"
    if(options.moduleType==="cjs") options.moduleType = "commonjs"
    if(!["auto","commonjs","cjs","esm","es"].includes(options.moduleType))  options.moduleType = "esm"
    return options;
}

function generateFormatterFile(langName,{isTypeScript,formattersFolder,templateContext,moduleType}={}){

    const formattersFile =  path.join(formattersFolder,`${langName}.${isTypeScript ? 'ts' : 'js'}`) 
    if(!fs.existsSync(formattersFile)){
        const formattersContent = artTemplate(path.join(__dirname,"templates",`formatters.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' : 'cjs')}`), templateContext )
        fs.writeFileSync(formattersFile,formattersContent)
        logger.log(t(" - 格式化器:{}"),path.basename(formattersFile))
    }else{ // 格式化器如果存在，则需要更改对应的模块类型
        let formattersContent = fs.readFileSync(formattersFile,"utf8").toString()
        if(moduleType == "esm" || isTypeScript){
                formattersContent = formattersContent.replaceAll(/^[^\n\r\w]*module.exports\s*\=/gm,"export default ")
                formattersContent = formattersContent.replaceAll(/^[^\n\r\w]*module.exports\./gm,"export ")
        }else{
            formattersContent = formattersContent.replaceAll(/^[^\n\r\w]*export\s*default\s*/gm,"module.exports = ")
            formattersContent = formattersContent.replaceAll(/^[^\n\r\w]*export\s*/gm,"module.exports.")
        }
        fs.writeFileSync(formattersFile,formattersContent)
        logger.log(t(" - 更新格式化器:{}"),`formatters/${path.basename(formattersFile)}`)
    }
}
function generateStorageFile({isTypeScript,langFolder,templateContext,moduleType}={}){

    const storageFile =  path.join(langFolder,`storage.${isTypeScript ? 'ts' : 'js'}`) 
    if(!fs.existsSync(storageFile)){
        const storageFileContent = artTemplate(path.join(__dirname,"templates",`storage.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' : 'cjs')}`), templateContext )
        fs.writeFileSync(storageFile,storageFileContent)
        logger.log(t(" - 配置存储文件:{}"),path.basename(storageFile))
    }else{ // 存储文件如果存在，则需要更改对应的模块类型
        let storageFileContent = fs.readFileSync(storageFile,"utf8").toString()
        if(moduleType == "esm" || isTypeScript){
                storageFileContent = storageFileContent.replaceAll(/^[^\n\r\w]*module.exports\s*\=/gm,"export default ")
                storageFileContent = storageFileContent.replaceAll(/^[^\n\r\w]*module.exports\./gm,"export ")
        }else{
            storageFileContent = storageFileContent.replaceAll(/^[^\n\r\w]*export\s*default\s*/gm,"module.exports = ")
            storageFileContent = storageFileContent.replaceAll(/^[^\n\r\w]*export\s*/gm,"module.exports.")
        }
        fs.writeFileSync(storageFile,storageFileContent)
        logger.log(t(" - 配置存储文件:{}"),path.basename(storageFile))
    }
}

/**
 * 将@voerkai18n/runtime更新到最新版本
 */
async function updateRuntime(){
    const task = logger.task(t("更新@voerkai18n/runtime运行时"))
    try{
        const packageName = "@voerkai18n/runtime"
        const curVersion = getInstalledPackageInfo(packageName).version
        const latestVersion = (await getPackageReleaseInfo(packageName)).latestVersion
        if(semver.gt(latestVersion, curVersion)){
            await upgradePackage(packageName)
            task.complete(t("Updated:{}",[latestVersion]))
            return 
        }        
        task.complete(t("已经是最新的"))
    }catch(e){        
        logger.log(t("更新@voerkai18n/runtime失败,请手动更新!"))
        task.error(e.message)        
    }    
}

async  function compile(langFolder,opts={}){
    const options = normalizeCompileOptions(opts);
    let { moduleType,isTypeScript,updateRuntime:isUpdateRuntime,library,skip} = options; 

    if(isUpdateRuntime){
        await updateRuntime()
    }    

    // 如果自动则会从当前项目读取，如果没有指定则会是esm
    if(moduleType==="auto"){
        moduleType = findModuleType(langFolder)
    }
    const projectPackageJson = getCurrentPackageJson(langFolder)
    // 加载多语言配置文件
    const settingsFile = path.join(langFolder,"settings.json")

    try{                   

        // 读取多语言配置文件
        const langSettings = fs.readJSONSync(settingsFile) 
        let { languages,defaultLanguage,activeLanguage,namespaces }  = langSettings
        
        logger.log(t("支持的语言\t: {}"),languages.map(item=>`${item.title}(${item.name})`).join(","))
        logger.log(t("默认语言\t: {}"),defaultLanguage)
        logger.log(t("激活语言\t: {}"),activeLanguage)
        logger.log(t("名称空间\t: {}"),Object.keys(namespaces).join(","))
        logger.log(t("模块类型\t: {}"),moduleType)
        logger.log(t("库模式\t\t: {}"),library)
        logger.log(t("TypeScript\t: {}"),isTypeScript)
        logger.log("")
        logger.log(t("编译结果输出至：{}"),langFolder)

        // 1. 合并生成最终的语言文件
        let messages = {} ,msgId =1 
        glob.sync(path.join(langFolder,"translates/*.json")).forEach(file=>{
            try{
                let msg = fs.readJSONSync(file)
                Object.entries(msg).forEach(([msg,langs])=>{
                    if(msg in messages){
                        Object.assign(messages[msg],langs)
                    }else{
                        messages[msg] = langs
                    } 
                }) 
            }catch(e){
                logger.log(t("读取语言文件{}失败:{}"),file,e.message)
            }
        })
        logger.log(t(" - 共合成{}条文本"),Object.keys(messages).length)
 
        // 2. 为每一个文本内容生成一个唯一的id
        let messageIds = {}
        Object.entries(messages).forEach(([msg,langs])=>{
            langs.$id = msgId++
            messageIds[msg] = langs.$id
        })
        // 3. 为每一个语言生成对应的语言文件
        languages.forEach(lang=>{
            let langMessages = {}   
            Object.entries(messages).forEach(([message,translatedMsgs])=>{ 
                langMessages[translatedMsgs.$id] = lang.name in translatedMsgs ? translatedMsgs[lang.name] : message
            })
            const langFile = path.join(langFolder,`${lang.name}.${isTypeScript ? 'ts' : 'js'}`)
            // 为每一种语言生成一个语言文件
            if(moduleType==="esm" || isTypeScript){
                fs.writeFileSync(langFile,`export default ${JSON.stringify(langMessages,null,4)}`)
            }else{
                fs.writeFileSync(langFile,`module.exports = ${JSON.stringify(langMessages,null,4)}`)
            } 
            logger.log(t(" - 语言包文件: {}"),path.basename(langFile))
        })
        
        // 4. 生成id映射文件
        const idMapFile = path.join(langFolder,`idMap.${isTypeScript ? 'ts' : 'js'}`)
        if(moduleType==="esm" || isTypeScript){
            fs.writeFileSync(idMapFile,`export default ${JSON.stringify(messageIds,null,4)}`)
        }else{
            fs.writeFileSync(idMapFile,`module.exports = ${JSON.stringify(messageIds,null,4)}`)
        }
        logger.log(t(" - idMap文件: {}"),path.basename(idMapFile))
   
        const templateContext = {
            scopeId:projectPackageJson.name,
            languages,
            defaultLanguage,
            activeLanguage,
            namespaces,
            moduleType,
            isTypeScript,
            JSON,
            settings:JSON.stringify(langSettings,null,4),
            library
        }
        // 5 . 生成编译后的格式化函数文件
        const formattersFolder =  path.join(langFolder,"formatters") 
        if(!fs.existsSync(formattersFolder)) fs.mkdirSync(formattersFolder)
        // 6. 为每一个语言生成一个对应的式化器
        languages.forEach(lang=>{
            generateFormatterFile(lang.name,{isTypeScript,formattersFolder,templateContext,moduleType}) 
        }) 
        // 7.生成存储配置文件
        generateStorageFile({isTypeScript,langFolder,templateContext,moduleType}) 
        
        // 8. 生成编译后的访问入口文件
        if(skip){
            logger.log(t(" - 跳过更新访问入口文件: {}"),path.basename(entryFile))
        }else{
            const entryFile = path.join(langFolder,`index.${isTypeScript ? 'ts' : 'js'}`)
            const tmpFile = path.join(__dirname,"templates",isTypeScript ? "entry.ts" : (moduleType==="esm" ? "entry.mjs" : "entry.cjs"))
            const entryContent = artTemplate(tmpFile, templateContext )
            fs.writeFileSync(entryFile,entryContent)
            logger.log(t(" - 访问入口文件: {}"),path.basename(entryFile))
        }
        

    }catch(e){ 
        logger.log(t("加载多语言配置文件<{}>失败: {} "),settingsFile,e.stack)
    }
}

const program = new Command();

program
    .description(t('编译指定项目的语言包'))
    .option('-D, --debug', t('输出调试信息')) 
    .option('-t, --typescript',t("输出typescript代码")) 
    .option('-l, --library',t("开发库模式"),false)
    .option('-u, --update-runtime',t("自动更新runtime")) 
    .option('-m, --moduleType [types]', t('输出模块类型,取值auto,esm,cjs'), 'esm')     
    .option('--skip',t("跳过更新language/index.(ts|js)文件"),false) 
    .argument('[location]',  t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
         await i18nScope.change(lang)      
    })
    .action(async (location,options) => { 
        location = getProjectSourceFolder(location)
        options.isTypeScript = options.typescript==undefined ?  isTypeScriptProject()   : options.typescript
        const langFolder = path.join(location,"languages")
        if(!fs.existsSync(langFolder)){
            logger.error(t("语言包文件夹<{}>不存在",langFolder))
            return
        }         
        compile(langFolder,options)
    });
 
program.parseAsync(process.argv);
 
