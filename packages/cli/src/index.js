#!/usr/bin/env node
const { MixCli } = require("mixcli");
const InitCommand = require("./commands/init");
const { getCliLanguage } = require("./oslocale");
const {  isVoerkaI18nInstalled, getVoerkaI18nSettings } = require("@voerkai18n/utils");
    
global.OSLanguage = getCliLanguage()
global.VoerkaI18nSettings = getVoerkaI18nSettings()
global.isVoerkaI18nInstalled = isVoerkaI18nInstalled() 

const cli = new MixCli({
  name: "Voerkai18n",
  version: "1.0.0",
  logo: String.raw`
      __     __        _         ___ _  ___        
      \ \   / /__ _ __| | ____ _|_ _/ |( _ ) _ __  
       \ \ / / _ \ '__| |/ / _\` || || |/ _ \| '_ \ 
        \ V /  __/ |  |   < (_| || || | (_) | | | |
         \_/ \___|_|  |_|\_\__,_|___|_|\___/|_| |_|`
  });

cli.register(InitCommand);
cli.run();
