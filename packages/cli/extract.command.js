#!/usr/bin/env node
const { Command } = require('commander');
const { i18nScope,t } = require("./i18nProxy")
const path = require("path")
const fs = require("fs-extra")
const gulp = require("gulp")
const extractor = require("./extract.plugin")
const createLogger = require("logsets")
const { getProjectSourceFolder } = require("@voerkai18n/utils")
const logger = createLogger()
const { getCliLanguage } = require("./oslocate")


function extract(srcPath,options={}){
    let { filetypes,exclude,languagesLocation} =  options
    if(!filetypes) filetypes = ["*.js","*.jsx","*.ts","*.tsx","*.vue","*.html"]
    if(!Array.isArray(filetypes)) filetypes = filetypes.split(",")
    const folders = filetypes.map(ftype=>{
        if(ftype.startsWith(".")) ftype = "*"+ftype
        if(!ftype.startsWith("*.")) ftype = "*."+ftype
        return path.join(srcPath,"**",ftype)
    })
    folders.push(`!${path.join(srcPath,languagesLocation,"**")}`)
    folders.push(`!${path.join(srcPath,"node_modules","**")}`)
    folders.push(`!${path.join(srcPath,"**","node_modules","**")}`)
    folders.push("!**/babel.config.js")
    folders.push("!**/gulpfile.js")
    folders.push("!**/*.test.js")
    folders.push("!__test__/**/*.js")
    folders.push("!**/vite.config.js")
    

    if(!Array.isArray(exclude) && exclude){
        exclude = exclude.split(",")
    } 
    if(exclude){
        exclude.forEach(folder=>{
            folders.push(`!${path.join(srcPath,folder)}`)
        })
    } 
    if(!fs.existsSync(srcPath)){
        logger.log(t("目标文件夹<{}>不存在"),srcPath)
        return 
    }
    if(options.debug){
        logger.log(t("扫描提取范围："))
        logger.format(folders)
    }

    options.outputPath = path.join(srcPath,languagesLocation)
    gulp.src(folders)
        .pipe(extractor(options))
        .pipe(gulp.dest(options.outputPath))
}


const program = new Command();

program
    .description(t('扫描并提取所有待翻译的字符串到<languages/translates>文件夹中'))
    .option('-D, --debug', t('输出调试信息')) 
    .option('-lngs, --languages <languages...>', t('支持的语言'), ['zh','en'])  
    .option('-d, --defaultLanguage', t('默认语言'), 'zh')  
    .option('-a, --activeLanguage', t('激活语言'), 'zh')  
    .option('-ns, --namespaces', t('翻译名称空间'))  
    .option('-e, --exclude <folders>', t('排除要扫描的文件夹，多个用逗号分隔'))
    .option('-u, --updateMode', t('本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并'), 'sync')  
    .option('-f, --filetypes', t('要扫描的文件类型'), 'js,vue,html,jsx,ts,mjs,cjs') 
    .option('--languages-location',t("languages文件夹相对位置"),"languages")  
    .argument('[location]', t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){ 
        await i18nScope.change(getCliLanguage())     
    })
    .action(async (location,options) => {
        location = getProjectSourceFolder(location)
        if(options.languages){
            options.languages = options.languages.map(l=>({name:l,title:l}))
        }
        logger.log(t("工程目录：{}"),location)
        logger.log(t("语言目录：{}"),options.languagesLocation)
        const langSettingsFile = path.join(location,options.languagesLocation,"settings.json")
        if(fs.existsSync(langSettingsFile)){
            logger.log(t("语言配置文件<{}>已存在,将优先使用此配置文件中参数来提取文本"),`${languages-location}/settings.json`)
            let lngOptions  = fs.readJSONSync(langSettingsFile)
            options.languages = lngOptions.languages
            options.defaultLanguage = lngOptions.defaultLanguage
            options.activeLanguage = lngOptions.activeLanguage
            options.namespaces = lngOptions.namespaces
        }
        extract(location,options)
    });


program.parseAsync(process.argv);
 