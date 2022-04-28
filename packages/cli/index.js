const { Command } = require('commander');
const createLogger =  require("logsets")
const bannerPluin = require("logsets/plugins/banner")

const path = require("path")
const fs = require("fs-extra")
const logger = createLogger()
const { i18nScope ,t }  = require("./i18nProxy")
const { getProjectSourceFolder }  = require("@voerkai18n/utils"); 
 
logger.use(bannerPluin)

const program = new Command();
program
    .name("voerkai18n")
    .option("-v, --version", "当前版本号")
    .helpOption('-h, --help', '显示帮助')
    .action((options) => {
        const banner = logger.banner()
        banner.add("VoerkaI18n CLI")
        banner.add("VoerkaI18n command line interactive tools",{style:"darkGray"})
        banner.add()
        banner.add("版本号：",`${require("./package.json").version}`,{style:["","yellow"]})
        banner.render()
    })


program
    .command('init')
    .argument('[location]', t('工程项目所在目录'))
    .description(t('初始化项目国际化配置'))
    .option('-D, --debug', t('输出调试信息'))
    .option('-r, --reset', t('重新生成当前项目的语言配置'))
    .option('-lngs, --languages <languages...>', t('支持的语言列表'), ['zh','en'])     
    .option('-d, --defaultLanguage <name>', t('默认语言'), 'zh')  
    // .option('-i, --installRuntime', t('自动安装默认语言'),true)  
    .option('-a, --activeLanguage <name>', t('激活语言'), 'zh')  
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
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
    .option('-lngs, --languages <languages...>', t('支持的语言'), ['zh','en'])  
    .option('-d, --defaultLanguage', t('默认语言'), 'zh')  
    .option('-a, --activeLanguage', t('激活语言'), 'zh')  
    .option('-ns, --namespaces', t('翻译名称空间'))  
    .option('-e, --exclude <folders>', t('排除要扫描的文件夹，多个用逗号分隔'))
    .option('-u, --updateMode', t('本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并'), 'sync')  
    .option('-f, --filetypes', t('要扫描的文件类型'), 'js,vue,html,jsx,ts,mjs,cjs')  
    .argument('[location]', t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
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
            logger.log(t("语言配置文件<{}>已存在,将优先使用此配置文件中参数来提取文本"),"./languages/settings.json")
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
    .option('-D, --debug', t('输出调试信息')) 
    .option('--no-inline-runtime', t('不嵌入运行时源码')) 
    .option('-m, --moduleType [types]', t('输出模块类型,取值auto,esm,cjs'), 'esm')     
    .argument('[location]',  t('工程项目所在目录'),"./")
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
         await i18nScope.change(lang)      
    })
    .action(async (location,options) => { 
        location = getProjectSourceFolder(location)
        const langFolder = path.join(location,"languages")
        if(!fs.existsSync(langFolder)){
            logger.error(t("语言包文件夹<{}>不存在",langFolder))
            return
        }         
        let compile = require("./compile.command")
        compile(langFolder,options)
    });
 
program
    .command('translate')
    .argument('[location]', t('工程项目所在目录'))
    .description(t('调用在线翻译服务商的API翻译译指定项目的语言包,如使用百度云翻译服务'))
    .option('--no-backup', t('备份原始文件'))
    .option('--mode', t('翻译模式，取值auto=仅翻译未翻译的,full=全部翻译'), 'auto')
    .option('-p, --provider <value>', t('在线翻译服务提供者名称或翻译脚本文件'), 'baidu')
    .option('-m, --max-package-size <value>', t('将多个文本合并提交的最大包字节数'), 200)
    .option('--appkey [key]', t('API密钥'))
    .option('--appid [id]', t('API ID'))
    .option('-q, --qps <value>', t('翻译速度限制,即每秒可调用的API次数'), 1)  
    .hook("preAction",async function(location){
        const lang= process.env.LANGUAGE || "zh"
        await i18nScope.change(lang)     
    })
    .action((location,options) => { 
        location = getProjectSourceFolder(location)
        const translate = require("./translate.command")
        translate(location,options)
    });




program.parseAsync(process.argv);

const options = program.opts(); 
 