#!/usr/bin/env node
/**
 * 初始化指定项目的语言包
 */


const path = require("node:path");
const fs = require("node:fs");
const logsets = require("logsets");
const { getLanguageDir } = require("@voerkai18n/utils");
const { getPackageJson } = require("flex-tools/package/getPackageJson");
const { t } = require("../../languages");
const artTemplate = require("art-template"); 
const { pick } = require("flex-tools/object/pick")
const { copyFiles } = require("flex-tools/fs/copyFiles")



async function initializer(srcPath,options={}){

    const opts = Object.assign({
        entry          : "src/languages",
        library        : false,
        moduleType     : "esm",
        typeScript     : false,
        debug          : true,
        languages      : ["zh-CN","en-US"],
        reset          : false,
        defaultLanguage: "zh-CN",
        activeLanguage : "zh-CN"
    },options)    

    const { entry,library,moduleType,typeScript,debug,languages,reset } =  opts

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
                }
            }
        },
        {
            title:["生成语言配置文件{}","settings.json"],
            execute:async ()=>{
                const settingsFile = path.join(langDir,"settings.json")
                if(fs.existsSync(settingsFile) && !reset){                    
                    return 'skip'
                }

                const settings = pick(opts,[
                    "languages",
                    "debug",
                    "library",                    
                ])

                const langApi = getBcp47LanguageApi(osLang)

                settings.languages = langApi.getTags(opts.languages)
                                    .map(lang=>{
                                        return {
                                            name       : lang.tag,
                                            title      : lang.name,
                                            nativeTitle: lang.nativeName,
                                            active     : lang.tag==opts.activeLanguage,
                                            default    : lang.tag==opts.defaultLanguage,
                                        }
                                    })
                // 写入配置文件
                fs.writeFileSync(settingsFile,JSON.stringify(settings),null,4)
            }
        },
        {
            title:"复制语言文件",
            execute:async ()=>{
                const files = []
                 
                await copyFiles("*.*",langDir, {cwd:path.join(__dirname,"templatges") } )

                const tmpFile = path.join(__dirname,"templates","guage.js")                
                const entryContent = artTemplate(path.join(__dirname,"templates",`init-entry.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' :  'cjs')}`), templateContext )
                fs.writeFileSync(path.join(lngPath,`index.${isTypeScript ? 'ts' : 'js'}`),entryContent)
            }
        },
        // {
        //     title:"初始化语言上下文",
        //     execute:async ()=>{
        //         const templateContext = {
        //             moduleType,
        //             library,
        //             scopeId:projectPackageJson ? projectPackageJson.name : 'scope'+parseInt(Math.random()*10000)
        //         }
        //         const entryContent = artTemplate(path.join(__dirname,"templates",`init-entry.${isTypeScript ? 'ts' : (moduleType=='esm' ? 'mjs' :  'cjs')}`), templateContext )
        //         fs.writeFileSync(path.join(lngPath,`index.${isTypeScript ? 'ts' : 'js'}`),entryContent)
        //     }
        // },
        // {
        //     title:"生成IdMap文件",
        //     execute:async ()=>{
        //         const entryContent = isTypeScript ? "export default {}" : (moduleType=='cjs' ? "module.exports={}" :"export default {}")
        //         fs.writeFileSync(path.join(lngPath,`idMap.${isTypeScript ? 'ts' : 'js'}`),entryContent)
        //     }
        // },
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
 
    
        
    logger.log(t("生成语言配置文件:{}"),`./${entry}/settings.json`)
    logger.log(t("拟支持的语言：{}"),opts.languages.join(","))    
    logger.log(t("已安装运行时:{}"),'@voerkai18n/runtime')
    logger.log(t("本工程运行在: {}"),library ? "库模式" : "应用模式")
    logger.log(t("初始化成功,下一步："))    
    logger.log(t(" - 编辑{}确定拟支持的语言种类等参数"),`${entry}/settings.json`)
    logger.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
    logger.log(t(" - 运行<{}>在线自动翻译"),"voerkai18n translate")
    logger.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")    
} 



module.exports = initializer