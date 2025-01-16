#!/usr/bin/env node
/**
 * 初始化指定项目的语言包
 */


const path = require("node:path");
const fs = require("node:fs");
const logsets = require("logsets");
const { getProjectModuleType,getWorkDir } = require("@voerkai18n/utils");
const { getPackageJson } = require("flex-tools/package/getPackageJson");
const { t, i18nScope } = require("../../languages");
const artTemplate = require("art-template"); 

async function initializer(srcPath,{entry='languages',library=false,moduleType,isTypeScript,debug = true,languages=["zh","en"],defaultLanguage="zh",activeLanguage="zh",reset=false}={}){
    
    let settings = {}
   
    if(!['esm',"cjs"].includes(moduleType)){
        moduleType = getProjectModuleType(srcPath,isTypeScript)
    } 

    const projectPackageJson = getPackageJson(srcPath)
    const langDir = getLanguageDir()

    const tasks = logsets.createTasks([
        {
            title:"创建语言文件夹",
            execute:async ()=>{
                if(fs.existsSync(lngPath)){
                    return 'skip'
                }else{
                    fs.mkdirSync(lngPath)
                    if(debug) logsets.log(t("创建语言包文件夹: {}"),lngPath)

                }
            }
        },
        {
            title:"生成语言配置文件settings.json",
            execute:async ()=>{
                const settingsFile = path.join(lngPath,"settings.json")
                if(fs.existsSync(settingsFile) && !reset){                    
                    return 'skip'
                }
                settings = {
                    languages:getLanguageList(languages,defaultLanguage,activeLanguage),
                    namespaces:{}
                }    
                // 写入配置文件
                fs.writeFileSync(settingsFile,JSON.stringify(settings,null,4))
            }
        },
        {
            title:"初始化语言上下文",
            execute:async ()=>{
                const templateContext = {
                    moduleType,
                    library,
                    scopeId:projectPackageJson ? projectPackageJson.name : 'scope'+parseInt(Math.random()*10000)
                }
                const entryContent = artTemplate(path.join(__dirname,"templates",`init-entry.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' :  'cjs')}`), templateContext )
                fs.writeFileSync(path.join(lngPath,`index.${isTypeScript ? 'ts' : 'js'}`),entryContent)
            }
        },
        {
            title:"生成IdMap文件",
            execute:async ()=>{
                const entryContent = isTypeScript ? "export default {}" : (moduleType=='cjs' ? "module.exports={}" :"export default {}")
                fs.writeFileSync(path.join(lngPath,`idMap.${isTypeScript ? 'ts' : 'js'}`),entryContent)
            }
        },
        {
            title:"安装@voerkai18n/runtime",
            execute:async ()=>{
                if(isInstallDependent("@voerkai18n/runtime")){
                    return 
                }else{
                    await installPackage.call(this,'@voerkai18n/runtime')
                }            
            }
        }
    ]) 


        logsets.tasklist(t("初始化VoerkaI18n多语言支持"))
    // 查找当前项目的语言包类型路径
    const lngPath = path.join(srcPath,entry)

    // 语言文件夹名称
    try{
        tasks.add(t("创建语言包文件夹"))

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
        tasks.add(t("生成语言配置文件settings.json"))
        const settingsFile = path.join(lngPath,"settings.json")
        if(fs.existsSync(settingsFile) && !reset){
            if(debug) logger.log(t("语言配置文件{}文件已存在，跳过创建。\n使用{}可以重新覆盖创建"),settingsFile,"-r")
            tasks.skip()
            return 
        }
        settings = {
            languages:getLanguageList(languages,defaultLanguage,activeLanguage),
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
        tasks.add(t("初始化语言上下文"))
        const templateContext = {
            moduleType,
            library,
            scopeId:projectPackageJson ? projectPackageJson.name : 'scope'+parseInt(Math.random()*10000)
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
    
    
        
    logger.log(t("生成语言配置文件:{}"),`./${entry}/settings.json`)
    logger.log(t("拟支持的语言：{}"),settings.languages.map(l=>`${l.title}(${l.name})`).join(","))    
    logger.log(t("已安装运行时:{}"),'@voerkai18n/runtime')
    logger.log(t("本工程运行在: {}"),library ? "库模式" : "应用模式")
    logger.log(t("初始化成功,下一步："))    
    logger.log(t(" - 编辑{}确定拟支持的语言种类等参数"),`${entry}/settings.json`)
    logger.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
    logger.log(t(" - 运行<{}>在线自动翻译"),"voerkai18n translate")
    logger.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")    
} 



module.exports = initializer