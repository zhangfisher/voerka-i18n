#!/usr/bin/env node
/**
 * 初始化指定项目的语言包
 */


const path = require("path")
const fs = require("fs")
const { t,i18nScope } = require("./i18nProxy")
const createLogger = require("logsets")
const logger = createLogger() 
const { installPackage,isTypeScriptProject,getCurrentPackageJson,getProjectSourceFolder, isInstallDependent } = require("@voerkai18n/utils")
const artTemplate = require("art-template")
const { Command } = require('commander'); 

function getLanguageList(langs,defaultLanguage){
    try{
        const available_languages = require("./available_languages")
        if(defaultLanguage in available_languages){
            return langs.map(lng=>{
                const langIndex = available_languages[defaultLanguage].findIndex(l=>l.name===lng)
                if(langIndex > -1 ){
                    return {
                        name:lng,
                        title:available_languages[defaultLanguage][langIndex].title 
                    }
                }else{                    
                    return {
                        name:lng,
                        title:lng 
                    }
                }                
            })   
        }else{
            return langs.map(lng=>({name:lng,title:lng}))
        }        
    }catch(e){
        return langs.map(lng=>({name:lng,title:lng}))
    }
}

/**
 * 获取当前项目的模块类型
 * 
 * 1. <package.json>.type="module"
 * 2. 当前工程的index.(js|ts)是否包含了import  xx from 
 * 3. 检查是否是typescript工程
 * 
 * 
 */

function getProjectModuleType(srcPath,isTypeScript){

    // <package.json>.type="module"
    try{
        let packageJson = getCurrentPackageJson(srcPath)
        if(packageJson.type=="module") return "esm"
    }catch{}

    // 检查入口文件
    const importRegex = /import\s*.*\s*from\s*(["']).*\1/gm
    const extryFiels = [
        path.join(srcPath,"index.js"),
        path.join(srcPath,"src","index.js"),
        path.join(srcPath,"main.js"),
        path.join(srcPath,"src","main.js"),
    ]

    for(let file of extryFiels){
        try{
            const source = fs.readFileSync(file)
            if(importRegex.test(source)){
                return 'esm'
            }            
        }catch{}
    }
    return isTypeScript ? 'esm' : 'cjs'       
}

async function initializer(srcPath,{library=false,moduleType,isTypeScript,debug = true,languages=["zh","en"],defaultLanguage="zh",activeLanguage="zh",reset=false}={}){
    let settings = {}
    // 检查当前项目的模块类型
    if(!['esm',"cjs"].includes(moduleType)){
        moduleType = getProjectModuleType(srcPath)
    } 
    const projectPackageJson = getCurrentPackageJson(srcPath)

    let tasks = logger.tasklist("初始化VoerkaI18n多语言支持")
    const  langFolderName = "languages"
    // 查找当前项目的语言包类型路径
    const lngPath = path.join(srcPath,langFolderName)

    // 语言文件夹名称
    try{
        tasks.add("创建语言包文件夹")

        if(!fs.existsSync(lngPath)){
            fs.mkdirSync(lngPath)
            if(debug) logger.log(t("创建语言包文件夹: {}"),lngPath)
        }    
        tasks.complete()
    }catch(e){
        tasks.error(e.stack)
    }
    
    // 创建settings.json文件
    try{
        tasks.add("生成语言配置文件settings.json")
        const settingsFile = path.join(lngPath,"settings.json")
        if(fs.existsSync(settingsFile) && !reset){
            if(debug) logger.log(t("语言配置文件{}文件已存在，跳过创建。\n使用{}可以重新覆盖创建"),settingsFile,"-r")
            tasks.skip()
            return 
        }
        settings = {
            languages:getLanguageList(languages,defaultLanguage),
            defaultLanguage,
            activeLanguage,
            namespaces:{}
        }    
        // 写入配置文件
        fs.writeFileSync(settingsFile,JSON.stringify(settings,null,4))
        tasks.complete()
    }catch(e){
        tasks.error(e.stack)
    }    
    
    // 生成一个语言初始化文件,该文件在执行extract/compile前提供访问t函数的能力
    try{
        tasks.add("初始化语言上下文")
        const templateContext = {
            moduleType,
            library,
            scopeId:projectPackageJson.name,
        }
        const entryContent = artTemplate(path.join(__dirname,"templates",`init-entry.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' :  'cjs')}`), templateContext )
        fs.writeFileSync(path.join(lngPath,`index.${isTypeScript ? 'ts' : 'js'}`),entryContent)
        tasks.complete()
    }catch(e){
        tasks.error(e.stack)
    } 

    try{
        tasks.add(t("生成IdMap文件"))
        const entryContent = isTypeScript ? "export default {}" : (moduleType=='cjs' ? "module.exports={}" :"export default {}")
        fs.writeFileSync(path.join(lngPath,`idMap.${isTypeScript ? 'ts' : 'js'}`),entryContent)
        tasks.complete()
    }catch(e){
        tasks.error(e.stack)
    } 
 
    
    try{
        tasks.add(t("安装@voerkai18n/runtime"))
        if(isInstallDependent("@voerkai18n/runtime")){
            tasks.skip()   
        }else{
            await installPackage.call(this,'@voerkai18n/runtime')
            tasks.complete()
        }            
    }catch(e){
        tasks.error(e.stack)
    } 
    
    
        
    logger.log(t("生成语言配置文件:{}"),"./languages/settings.json")
    logger.log(t("拟支持的语言：{}"),settings.languages.map(l=>l.name).join(","))
    logger.log(t("已安装运行时:{}"),'@voerkai18n/runtime')
    logger.log(t("本工程运行在: {}"),library ? "库模式" : "应用模式")
    logger.log(t("初始化成功,下一步："))    
    logger.log(t(" - 编辑{}确定拟支持的语言种类等参数"),"languages/settings.json")
    logger.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
    logger.log(t(" - 运行<{}>在线自动翻译"),"voerkai18n translate")
    logger.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")
    
} 

const program = new Command();

program
    .argument('[location]', t('工程项目所在目录'))
    .description(t('初始化项目国际化配置'))
    .option('-D, --debug', t('输出调试信息'))
    .option('-m, --moduleType [types]', t('输出模块类型,取值auto,esm,cjs'), 'auto')     
    .option('-r, --reset', t('重新生成当前项目的语言配置'))
    .option('-t, --typescript',t("输出typescript代码")) 
    .option('-l, --library',t("开发库模式"),false) 
    .option('-lngs, --languages <languages...>', t('支持的语言列表'), ['zh','en'])     
    .option('-d, --defaultLanguage <name>', t('默认语言'), 'zh')  
    .option('-a, --activeLanguage <name>', t('激活语言'), 'zh')  
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
        await i18nScope.change(lang)     
    })
    .action(async (location,options) => { 
        options.isTypeScript = options.typescript==undefined ?  isTypeScriptProject()   : options.typescript
        location = getProjectSourceFolder(location)
        logger.log(t("工程目录：{}"),location)
        //
        if(options.debug){
            logger.format(options,{compact:true})
        }
        await initializer.call(options,location,options)
    });



program.parseAsync(process.argv);
 
