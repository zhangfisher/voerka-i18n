const { Command } = require('commander');
const createLogger =  require("logsets")
const path = require("path")
const fs = require("fs");
const { importModule } = require('./utils');
const deepmerge = require('deepmerge');
const logger = createLogger()
require('dotenv').config()

const { t, changeLanguage } = require("./languages")
const program = new Command();
 
program
    .command('init')
    .argument('[location]', t('工程项目所在目录'))
    .description('初始化项目国际化配置')    
    .option('-d, --debug', '输出调试信息') 
    .option('-r, --reset', '重新生成当前项目的语言配置')
    .option('-m, --moduleType [type]', '生成的js模块类型,取值auto,esm,cjs',"auto")   
    .option('-lngs, --languages <languages...>', '支持的语言列表', ['cn','en']) 
    .action((location,options) => { 
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        logger.log("工程目录：{}",location)
        //
        if(options.debug){
            logger.format(options,{compact:true})
        }
        const initializer = require("./init.command")
        initializer(location,options)
    });


program
    .command('extract')
    .description('扫描并提取所有待翻译的字符串到<languages/translates>文件夹中')
    .option('-d, --debug', '输出调试信息') 
    .option('-lngs, --languages', '支持的语言', 'cn,en')  
    .option('-d, --defaultLanguage', '默认语言', 'cn')  
    .option('-a, --activeLanguage', '激活语言', 'cn')  
    .option('-ns, --namespaces', '翻译名称空间')  
    .option('-e, --exclude <folders>', '排除要扫描的文件夹，多个用逗号分隔')
    .option('-u, --updateMode', '本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并', 'sync')  
    .option('-f, --filetypes', '要扫描的文件类型', 'js,vue,html,jsx,ts')  
    .argument('[location]', '工程所在目录',"./")
    .action(async (location,options) => {
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        if(options.languages){
            options.languages = options.languages.split(",").map(l=>({name:l,title:l}))
        }
        //options = Object.assign({},options)
        logger.log("工程目录：{}",location)
        const langSettingsFile = path.join(location,"languages","settings.js")
        if(fs.existsSync(langSettingsFile)){
            logger.log("语言配置文件<{}>已存在,将优先使用此配置文件中参数来提取文本","./languages/settings.js")
            let lngOptions  = (await importModule("file:///"+langSettingsFile)).default
            options.languages = lngOptions.languages
            options.defaultLanguage = lngOptions.defaultLanguage
            options.activeLanguage = lngOptions.activeLanguage
            options.namespaces = lngOptions.namespaces
        }
        //
        if(options.debug){
            logger.format(options,{compact:true})
        }
        const extractor = require('./extract.command');
        extractor(location,options)
    });


program
    .command('compile')
    .description('编译语言包文件<languages>文件夹中')
    .option('-d, --debug', '输出调试信息') 
    .option('-m, --moduleType [types]', '输出模块类型,取值auto,esm,cjs', 'auto')     
    .argument('[location]',  t('工程项目所在目录'),"./")
    .hook("preAction",async (location,options) => {
        console.log("process.env.language",process.env.language)
        await changeLanguage("en")
    })
    .action(async (location,options) => { 
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        const langFolder = path.join(location,"languages")
        if(!fs.existsSync(langFolder)){
            logger.error("语言包文件夹<{}>不存在",langFolder)
            return
        }        
        if(options.debug){
            logger.format(options,{compact:true})
        }
        compile = require("./compile.command")
        compile(langFolder,options)
    });
 

program.parseAsync(process.argv);

const options = program.opts(); 
 