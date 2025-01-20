#!/usr/bin/env node


/**
 * 初始化指定项目的语言包
 */


const path = require("node:path");
const fs = require("node:fs");
const logsets = require("logsets");
const { getLanguageDir,getBcp47LanguageApi } = require("@voerkai18n/utils");
const { getPackageJson } = require("flex-tools/package/getPackageJson");
const { t } = require("../../i18n"); 
const { copyFiles } = require("flex-tools/fs/copyFiles")
const { packageIsInstalled } = require("flex-tools/package/packageIsInstalled")
const { installPackage } = require("flex-tools/package/installPackage")



function formatLanguages(options){
    const osLang = global.OSLanguage || "en-US";
    const langApi = getBcp47LanguageApi(osLang)
    options.languages = langApi
        .getTags(options.languages)
        .map(lang=>{
            const lng ={
                name       : lang.tag,
                title      : lang.name,
                nativeTitle: lang.nativeName
            }
            if(lang.tag === options.activeLanguage){
                lng.active = true
            }
            if(lang.tag === options.defaultLanguage){
                lng.default = true
            }
            return lng
        })

}

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
    formatLanguages(opts)

    const { entry,library,moduleType,reset,typescript:isTypeScript } =  opts

    const projectPackageJson = getPackageJson()
    const langDir = getLanguageDir()
    const langRelDir = path.relative(process.cwd(),langDir)
    const settingsFile = path.join(langDir,"settings.json")
    const settingsRelFile = path.relative(process.cwd(),settingsFile)

    const tasks = logsets.createTasks([
        {
            title:["初始化语言文件夹:{}",langRelDir],
            execute:async ()=>{
                if(!fs.existsSync(langDir)){
                    fs.mkdirSync(langDir) 
                }                    
                opts.scopeId =projectPackageJson?.name || 'scope'+parseInt(Math.random()*10000)
                await copyFiles("*.*",langDir, {
                    cwd : path.join(__dirname,"templates",isTypeScript ? "ts" : moduleType),
                    vars: opts,
                    overwrite:true
                }) 
                opts.languages.forEach(lng=>{
                    const msgFile = path.join(langDir,`${lng.name}.${isTypeScript ? "ts" : moduleType}`)
                    const msgContent = moduleType==='cjs' ? `module.exports = {}` : `export default {}`
                    fs.writeFileSync(msgFile,msgContent)
                })
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
        
    logsets.log(t("语言配置文件: {}"),settingsRelFile)
    logsets.log(t("拟支持的语言: {}"),opts.languages.map(lng=>`${lng.title}(${lng.name})`).join(","))    
    logsets.log(t("已安装运行时: {}"),'@voerkai18n/runtime')
    logsets.log(t("本工程运行在: {}"),library ? t("库模式") : t("应用模式"))
    logsets.log(t("初始化成功,下一步："))    
    logsets.log(t(" - 修改{}文件编辑语言参数"),`${entry}/settings.json`)
    logsets.log(t(" - 运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")
    logsets.log(t(" - 运行<{}>在线自动翻译"),"voerkai18n translate")
    logsets.log(t(" - 运行<{}>编译语言包"),"voerkai18n compile")
} 



module.exports = initializer