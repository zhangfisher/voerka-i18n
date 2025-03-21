#!/usr/bin/env node
require("flex-tools/string")
const { MixCli }                                    = require("mixcli");
const InitCommand                                   = require("./commands/init");
const ExtractCommand                                = require("./commands/extract");
const CompileCommand                                = require("./commands/compile");
const wrapCommand                                   = require("./commands/wrap");
const TranslateCommand                              = require("./commands/translate");
const inspectCommand                                = require("./commands/inspect");
const applyCommand                                 = require("./commands/apply");
const { getCliLanguage }                            = require("./oslocale");
const {  isVoerkaI18nInstalled, getProjectContext } = require("@voerkai18n/utils"); 
const { i18nScope }                                 = require("./i18n");
const replaceAll                                    = require('string.prototype.replaceall');
replaceAll.shim()
 
getProjectContext().then(async ()=>{
    const cliLanguage = getCliLanguage()
    global.OSLanguage = cliLanguage 
    await i18nScope.change(cliLanguage) 
    global.isVoerkaI18nInstalled = isVoerkaI18nInstalled() 

    const cli = new MixCli({
      name: "voerkai18n",
      version: require("../package.json").version,
      logo: String.raw`
        __     __        _         ___ _  ___        
        \ \   / /__ _ __| | ____ _|_ _/ |( _ ) _ __  
         \ \ / / _ \ '__| |/ / _\` || || |/ _ \| '_ \ 
          \ V /  __/ |  |   < (_| || || | (_) | | | |
           \_/ \___|_|  |_|\_\__,_|___|_|\___/|_| |_|`
      })    

    cli.register(InitCommand)
    cli.register(ExtractCommand)
    cli.register(CompileCommand)
    cli.register(TranslateCommand)
    cli.register(wrapCommand)
    cli.register(inspectCommand)
    cli.register(applyCommand)
    cli.run();       
  })

