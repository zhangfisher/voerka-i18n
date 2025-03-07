#!/usr/bin/env node


/**
 * 初始化指定项目的语言包
 */


const path = require("node:path");
const fs = require("node:fs");
const logsets = require("logsets");
const { getBcp47LanguageApi,addToGitIgnore,getDir } = require("@voerkai18n/utils");
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

function getDefaultScopeId(){
    const pkg = getPackageJson()
    if(pkg){
        return `${pkg.name || 'scope'+ parseInt(Math.random()*10000)}_${pkg.version ? "_"+pkg.version.replaceAll(".","_") : ""}`
    }else{
        return  'scope'+ parseInt(Math.random()*10000)
    } 

}

function createParagraphsDir(opts){    

    const  { languages,langDir,typescript:isTypeScript } = opts
    const codeFileExtName = isTypeScript ? "ts" : 'js'
    const paragraphsDir = getDir(path.join(langDir,"paragraphs"))      

    const langEsmImports = languages.reduce((acc,lng)=>{
        acc.push(`\t'${lng.name}': () => import("./${lng.name}")`)
        return acc
    },[]).join(",\n")
    const langCjsImports = languages.reduce((acc,lng)=>{
        acc.push(`\t'${lng.name}' : () => require("./${lng.name}")`)
        return acc
    },[]).join(",\n")
    const paragraphsCode = isTypeScript || moduleType === 'esm' ? 
        `export default {\n${langEsmImports}\n}` 
        : `module.exports =  ${langCjsImports}`

    fs.writeFileSync(path.join(paragraphsDir,`index.${codeFileExtName}`),paragraphsCode)
    return paragraphsDir
}

function createMessagesDir(opts){    
    const  { languages,langDir,typescript:isTypeScript } = opts
    const codeFileExtName = isTypeScript ? "ts" : 'js'
    const messagesDir = getDir(path.join(langDir,"messages"))      

    languages.forEach(lng=>{ // 生成信息文件       
        const msgFile    = path.join(messagesDir,`${lng.name}.${codeFileExtName}`)
        const msgContent = isTypeScript || moduleType === 'esm' ? "export default {}" : "module.exports = {}"
        if(!fs.existsSync(msgFile)){
            fs.writeFileSync(msgFile,msgContent)
        }  
    })
    return messagesDir
}

async function initializer(opts={}){
 
    formatLanguages(opts)

    const { langDir,langRelDir,library, settingRelFile, moduleType, typescript:isTypeScript } =  opts 

    const tasks = logsets.createTasks([
        {
            title:[t("初始化语言文件夹:{}"),langRelDir],
            execute:async ()=>{
                if(!fs.existsSync(langDir)){
                    fs.mkdirSync(langDir) 
                }                    
                opts.scopeId = getDefaultScopeId()
                await copyFiles("**/*.*",langDir, {
                    cwd      : path.join(__dirname,"templates",isTypeScript ? "ts" : (moduleType=='cjs' ? moduleType : "esm")),
                    vars     : opts, 
                    overwrite: file=>{
                        return !file.endsWith(".json")
                    }
                }) 

                await copyFiles("**/*.*",path.join(langDir,"prompts"), { 
                    cwd: path.join(__dirname,"prompts"),
                    overwrite: false  
                }) 

                createParagraphsDir(opts) 
                createMessagesDir(opts) 

                addToGitIgnore([
                    `${langRelDir}/api.json`, 
                    `${langRelDir}/translates/*/*.bak.*.json`,
                    "**/*.wrapped.*",
                ])
            }
        },  
        {
            title: [t("安装{}依赖"),"@voerkai18n/runtime"],
            execute:async ()=>{
                if(await packageIsInstalled("@voerkai18n/runtime")){
                    return 'skip'
                }else{
                    await installPackage.call(this,'@voerkai18n/runtime')
                }            
            }
        },
        {
            title: [t("安装{}依赖"),"@voerkai18n/formatters"], 
            end:false,
            execute:async ()=>{
                if(await packageIsInstalled("@voerkai18n/formatters")){
                    return 'skip'
                }else{
                    await installPackage.call(this,'@voerkai18n/formatters')
                }            
            }
        }
    ]) 

    logsets.separator(80)

    await tasks.run(t("开始初始化")) 

    const summary = logsets.tasklist({grouped:true})
    summary.addGroup(t("配置信息："))    
    summary.addMemo(t("语言配置文件: {}"),settingRelFile)
    summary.addMemo(t("拟支持的语言: {}"),opts.languages.map(lng=>`${lng.title}(${lng.name})`).join(","))    
    summary.addMemo(t("已安装运行时: {}"),'@voerkai18n/runtime')
    summary.addMemo(t("工作模式   :  {}"),library ? t("库模式") : t("应用模式"))
    summary.addGroup(t("下一步："))    
    summary.addMemo(t("修改{}文件编辑语言参数"),`${langRelDir}/settings.json`)
    summary.addMemo(t("运行<{}>自动包裹要翻译的文本"),"voerkai18n wrap")
    summary.addMemo(t("运行<{}>扫描提取要翻译的文本"),"voerkai18n extract")    
    summary.addMemo(t("运行<{}>在线自动翻译"),"voerkai18n translate")
    summary.addMemo(t("运行<{}>编译语言包"),"voerkai18n compile")
    summary.done()
} 



module.exports = initializer

 