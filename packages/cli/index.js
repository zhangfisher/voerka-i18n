const { Command } = require('commander');
const createLogger =  require("logsets")
const path = require("path")
const fs = require("fs");
const { importModule,t } = require('./utils');
const deepmerge = require('deepmerge');
const logger = createLogger()
const { scope } = require('./languages');

const program = new Command();

program
    .command('init')
    .argument('[location]', t('工程项目所在目录'))
    .description(t('初始化项目国际化配置'))
    .option('-d, --debug', t('输出调试信息'))
    .option('-r, --reset', t('重新生成当前项目的语言配置'))
    .option('-m, --moduleType [type]', t('生成的js模块类型,取值auto,esm,cjs'),"auto")   
    .option('-lngs, --languages <languages...>', t('支持的语言列表'), ['cn','en'])     
    .option('-default, --defaultLanguage <name>', t('默认语言'), 'cn')  
    .option('-active, --activeLanguage <name>', t('激活语言'), 'cn')  
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE
        if(lang){
            await scope.change(lang)      
        }
    })
    .action((location,options) => { 
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        logger.log(t("工程目录：{}"),location)
        //
        if(options.debug){
            logger.format(options,{compact:true})
        }
        const initializer = require("./init.command")
        initializer(location,options)
    });


program
    .command('extract')
    .description(t('扫描并提取所有待翻译的字符串到<languages/translates>文件夹中'))
    .option('-d, --debug', t('输出调试信息')) 
    .option('-lngs, --languages', t('支持的语言'), 'cn,en')  
    .option('-default, --defaultLanguage', t('默认语言'), 'cn')  
    .option('-active, --activeLanguage', t('激活语言'), 'cn')  
    .option('-ns, --namespaces', t('翻译名称空间'))  
    .option('-e, --exclude <folders>', t('排除要扫描的文件夹，多个用逗号分隔'))
    .option('-u, --updateMode', t('本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并'), 'sync')  
    .option('-f, --filetypes', t('要扫描的文件类型'), 'js,vue,html,jsx,ts')  
    .argument('[location]', t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE
        if(lang){
            await scope.change(lang)      
        }
    })
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
        logger.log(t("工程目录：{}"),location)
        const langSettingsFile = path.join(location,"languages","settings.js")
        if(fs.existsSync(langSettingsFile)){
            logger.log(t("语言配置文件<{}>已存在,将优先使用此配置文件中参数来提取文本","./languages/settings.js"))
            let lngOptions  = (await importModule("file:///"+langSettingsFile)).default
            options.languages = lngOptions.languages
            options.defaultLanguage = lngOptions.defaultLanguage
            options.activeLanguage = lngOptions.activeLanguage
            options.namespaces = lngOptions.namespaces
        }
        //
        // if(options.debug){
        //     logger.format(options,{compact:true})
        // }
        const extractor = require('./extract.command');
        extractor(location,options)
    });


program
    .command('compile')
    .description(t('编译指定项目的语言包'))
    .option('-d, --debug', t('输出调试信息')) 
    .option('-m, --moduleType [types]', t('输出模块类型,取值auto,esm,cjs'), 'auto')     
    .argument('[location]',  t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE
        if(lang){
            await scope.change(lang)      
        }
    })
    .action(async (location,options) => { 
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        const langFolder = path.join(location,"languages")
        if(!fs.existsSync(langFolder)){
            logger.error(t("语言包文件夹<{}>不存在",langFolder))
            return
        }        
        // if(options.debug){
        //     logger.format(options,{compact:true})
        // }
        compile = require("./compile.command")
        compile(langFolder,options)
    });
 

program.parseAsync(process.argv);

const options = program.opts(); 
 