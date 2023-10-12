#!/usr/bin/env node
const { Command } = require('commander');
const { i18nScope,t } = require("./i18nProxy")
const path = require("path")
const fs = require("fs-extra")
const gulp = require("gulp")
const extractor = require("./extract.plugin")
const createLogger = require("logsets")
const { getProjectSourceFolder,getSettingsFromPackageJson } = require("@voerkai18n/utils")
const logger = createLogger()
const { getCliLanguage } = require("./oslocate")


function extract(srcPath,options={}){
    let { filetypes,exclude,entry} =  options
    if(!filetypes || (Array.isArray(filetypes) && filetypes.length === 0)) {
        filetypes = ["*.js","*.jsx","*.ts","*.tsx","*.vue","*.html"]
    }
    if(!Array.isArray(filetypes)) filetypes = filetypes.split(",")

    const folders = filetypes.map(ftype=>{
        if(ftype.startsWith(".")) ftype = "*"+ftype
        if(!ftype.startsWith("*.")) ftype = "*."+ftype
        return path.join(srcPath,"**",ftype)
    })
    folders.push(`!${path.join(srcPath,entry,"**")}`)
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

    options.outputPath = path.join(srcPath,entry)
    gulp.src(folders)
        .pipe(extractor(options))
        .pipe(gulp.dest(options.outputPath))
}


/**
 * 读取语言配置，命令行优先
 * @param {*} options 
 */
function getLanguageSettings(options){    
    // 从本地package.json读取合并配置
    let opts = Object.assign({},getSettingsFromPackageJson(options.srcPath))
    // 如果本地settings存在
    const settingsFile = path.join(options.srcPath,opts.entry,"settings.json")
    if(fs.existsSync(settingsFile)){
        Object.assign(opts,require(settingsFile))
    }
    // 命令行优先参数
    Object.assign(opts,options)
    return opts
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
    .option('-u, --updateMode <value>', t('本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并'), 'sync')
    .option('-f, --filetypes <values...> ', t('要扫描的文件类型'),[])
    .argument('[location]', t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        await i18nScope.change(getCliLanguage())
    })
    .action(async (location,options) => {
        options.srcPath =getProjectSourceFolder(location)
        if(options.languages){
            options.languages = options.languages.map(l=>({name:l,title:l}))
        }
        options = getLanguageSettings(options) 

        logger.log(t("工程目录：{}"), options.srcPath)
        logger.log(t("语言目录：{}"),options.entry)
        extract(options.srcPath,options)
    });


program.parseAsync(process.argv);
