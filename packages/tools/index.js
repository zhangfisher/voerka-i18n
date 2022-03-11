const { Command } = require('commander');
const createLogger =  require("logsets")
const path = require("path")
const fs = require("fs");
const { importModule } = require('./utils');
const deepmerge = require('deepmerge');
const logger = createLogger()
const program = new Command();


program
    .option('-d, --debug', '输出调试信息') 

program
    .command('init')
    .argument('[location]', '工程项目所在目录')
    .description('初始化项目国际化配置')    
    .option('-r, --reset', '重新生成当前项目的语言配置')
    .option('-m, --moduleType [type]', '生成的js模块类型,默认esm',"esm")   
    .option('-lngs, --languages <languages...>', '支持的语言列表', ['cn','en']) 
    .action((location,options) => { 
        if(!location) {
            location = process.cwd()
        }else{
            location = path.join(process.cwd(),location)
        }
        logger.log("工程目录：{}",location)
        const initializer = require("./init.command")
        options.debug=true
        initializer(location,options)
    });


program
    .command('extract')
    .description('扫描并提取所有待翻译的字符串到<languages/translates>文件夹中')
    .option('-d, --debug', '输出调试信息') 
    .option('-lngs, --languages', '支持的语言', 'cn,en,de,fr,es,it,jp')  
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
            logger.log("语言配置文件<{}>已存在.将优先使用此配置文件中参数来提取文本",langSettingsFile)
            let lngOptions  = (await importModule("file:///"+langSettingsFile)).default
            options.languages = lngOptions.languages
            options.defaultLanguage = lngOptions.defaultLanguage
            options.activeLanguage = lngOptions.activeLanguage
            options.namespaces = lngOptions.namespaces
        }

        const extractor = require('./extract.command');
        extractor(location,options)
    });



program.parse(process.argv);

const options = program.opts(); 