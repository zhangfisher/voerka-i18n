#!/usr/bin/env node
const { Command } = require('commander');
const createLogger =  require("logsets")
const semver = require('semver')
const logger = createLogger()
const { t }  = require("./i18nProxy")
const { getPackageReleaseInfo }  = require("@voerkai18n/utils"); 
 

const program = new Command();
program
    .name("voerkai18n")
    .option("-v, --version", "当前版本号")
    .helpOption('-h, --help', '显示帮助')
    .action(async (options) => {
        const currentVersion = require("./package.json").version
        const newVersion = (await getPackageReleaseInfo("@voerkai18n/cli")).latestVersion
        const banner = logger.banner()
        banner.add("VoerkaI18n")
        banner.add("VoerkaI18n command line interactive tools",{style:"darkGray"})
        banner.add() 
        banner.add("installed: {} latest: {}",[currentVersion,newVersion])
        if(!semver.gt(newVersion,currentVersion)){
            banner.add("Run <{#yellow}> to upgrade","npm upgrade -g @voerkai18n/cli")
        }
        banner.render() 
    })

program
    .command('init',t('初始化项目国际化配置'),{executableFile:"./init.command.js"})
    .command('extract',t('扫描并提取待翻译的文本到<languages/translates>'),{executableFile:"./extract.command.js"})
    .command('compile',t('编译指定项目的语言包'),{executableFile:"./compile.command.js"})
    .command('translate',t('在线翻译语言包,如使用百度云翻译服务'),{executableFile:"./translate.command.js"})

program.parseAsync(process.argv);
   