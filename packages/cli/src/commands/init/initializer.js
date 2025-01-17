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
const { pick } = require("flex-tools/object/pick")
const { copyFiles } = require("flex-tools/fs/copyFiles")
const { packageIsInstalled } = require("flex-tools/package/packageIsInstalled")
const { installPackage } = require("flex-tools/package/installPackage")

async function initializer(options={}){

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

    const { entry,library,moduleType,reset } =  opts

    const projectPackageJson = getPackageJson()
    const langDir = getLanguageDir()
    const langRelDir = path.relative(process.cwd(),langDir)
    const settingsFile = path.join(langDir,"settings.json")
    const settingsRelFile = path.relative(process.cwd(),settingsFile)

    const tasks = logsets.createTasks([
        {
            title:["创建语言文件夹:{}",langRelDir],
            execute:async ()=>{
                if(!fs.existsSync(langDir)){
                    fs.mkdirSync(langDir) 
                }                    
                opts.scopeId =projectPackageJson?.name || 'scope'+parseInt(Math.random()*10000)
                await copyFiles("*.*",langDir, {
                    cwd : path.join(__dirname,"templatges",isTypeScript ? "ts" : moduleType),
                    vars: opts
                }) 
            }
        }, 
        {
            title:["创建配置文件{}","settings.json"],
            execute:async ()=>{ 
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
            title: ["安装{}依赖","@voerkai18n/runtime"],
            execute:async ()=>{
                if(await packageIsInstalled("@voerkai18n/runtime")){
                    return 
                }else{
                    await installPackage.call(this,'@voerkai18n/runtime')
                }            
            }
        }
    ]) 
 
    await tasks.run(t("初始化VoerkaI18n"))
        
    logsets.log(t("生成语言配置文件:{}"),settingsRelFile)
    logsets.log(t("拟支持的语言：{}"),opts.languages.join(","))    
    logsets.log(t("已安装运行时:{}"),'@voerkai18n/runtime')
    logsets.log(t("本工程运行在: {}"),library ? t("库模式") : t("应用模式"))
    logsets.log(t("初始化成功,下一步："))    
    logsets.log(t(" - 编辑{}确定拟支持的语言种类等参数"),`${entry}/settings.json`)
    logsets.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
    logsets.log(t(" - 运行<{}>在线自动翻译"),"voerkai18n translate")
    logsets.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")    
} 



module.exports = initializer