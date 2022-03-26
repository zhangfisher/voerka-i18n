const { Command } = require('commander');
const createLogger =  require("logsets")
const path = require("path")
const fs = require("fs-extra")
const deepmerge = require('deepmerge');
const logger = createLogger()
const { getCurrentProjectRootFolder,i18nScope ,t }  = require("./utils")

 

const program = new Command();

/**
 * 根据当前输入的文件夹位置自动确定源码文件夹位置
 * 
 * - 如果没有指定，则取当前文件夹
 * - 如果指定是非绝对路径，则以当前文件夹作为base
 * - 查找pack
 * - 如果该文件夹中存在src，则取src下的文件夹
 * -
 * 
 * @param {*} location 
 * @returns 
 */
function getProjectSourceFolder(location){
    if(!location) {
        location = process.cwd()
    }else{
        if(!path.isAbsolute(location)){
            location = path.join(process.cwd(),location)
        }
    }
    let projectRoot = getCurrentProjectRootFolder(location)
    // 如果当前工程存在src文件夹，则自动使用该文件夹作为源文件夹
    if(fs.existsSync(path.join(projectRoot,"src"))){
        projectRoot = path.join(projectRoot,"src")
    }
    return projectRoot
}

program
    .command('init')
    .argument('[location]', t('工程项目所在目录'))
    .description(t('初始化项目国际化配置'))
    .option('-D, --debug', t('输出调试信息'))
    .option('-r, --reset', t('重新生成当前项目的语言配置'))
    .option('-lngs, --languages <languages...>', t('支持的语言列表'), ['cn','en'])     
    .option('-d, --defaultLanguage <name>', t('默认语言'), 'cn')  
    // .option('-i, --installRuntime', t('自动安装默认语言'),true)  
    .option('-a, --activeLanguage <name>', t('激活语言'), 'cn')  
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "cn"
        await i18nScope.change(lang)     
    })
    .action((location,options) => { 
        location = getProjectSourceFolder(location)
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
    .option('-D, --debug', t('输出调试信息')) 
    .option('-lngs, --languages <languages...>', t('支持的语言'), ['cn','en'])  
    .option('-d, --defaultLanguage', t('默认语言'), 'cn')  
    .option('-a, --activeLanguage', t('激活语言'), 'cn')  
    .option('-ns, --namespaces', t('翻译名称空间'))  
    .option('-e, --exclude <folders>', t('排除要扫描的文件夹，多个用逗号分隔'))
    .option('-u, --updateMode', t('本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并'), 'sync')  
    .option('-f, --filetypes', t('要扫描的文件类型'), 'js,vue,html,jsx,ts,mjs,cjs')  
    .argument('[location]', t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "cn"
         await i18nScope.change(lang)     
    })
    .action(async (location,options) => {
        location = getProjectSourceFolder(location)
        if(options.languages){
            options.languages = options.languages.map(l=>({name:l,title:l}))
        }
        logger.log(t("工程目录：{}"),location)
        const langSettingsFile = path.join(location,"languages","settings.json")
        if(fs.existsSync(langSettingsFile)){
            logger.log(t("语言配置文件<{}>已存在,将优先使用此配置文件中参数来提取文本","./languages/settings.json"))
            let lngOptions  = fs.readJSONSync(langSettingsFile)
            options.languages = lngOptions.languages
            options.defaultLanguage = lngOptions.defaultLanguage
            options.activeLanguage = lngOptions.activeLanguage
            options.namespaces = lngOptions.namespaces
        }
        const extractor = require('./extract.command');
        extractor(location,options)
    });


program
    .command('compile')
    .description(t('编译指定项目的语言包'))
    .option('-d, --debug', t('输出调试信息')) 
    .option('--no-inline-runtime', t('不嵌入运行时源码')) 
    .option('-m, --moduleType [types]', t('输出模块类型,取值auto,esm,cjs'), 'esm')     
    .argument('[location]',  t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "cn"
         await i18nScope.change(lang)      
    })
    .action(async (location,options) => { 
        location = getProjectSourceFolder(location)
        const langFolder = path.join(location,"languages")
        if(!fs.existsSync(langFolder)){
            logger.error(t("语言包文件夹<{}>不存在",langFolder))
            return
        }         
        compile = require("./compile.command")
        compile(langFolder,options)
    });
 

program.parseAsync(process.argv);

const options = program.opts(); 
 