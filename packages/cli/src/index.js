#!/usr/bin/env node
const MixCli = require("mixcli");
const InitCommand = require("./commands/init");
const osLocale = require("os-locale");


osLocale()
  .then((locale) => {
    // @ts-ignore
    global.OSLanguage = locale;
  })
  .finally(() => {
    const cli = new MixCli({
      name: "Voerkai18n",
      version: "1.0.0",
      logo: String.raw`
    __     __        _         ___ _  ___        
    \ \   / /__ _ __| | ____ _|_ _/ |( _ ) _ __  
    \ \ / / _ \ '__| |/ / _\` || || |/ _ \| '_ \ 
    \ V /  __/ |  |   < (_| || || | (_) | | | |
    \_/ \___|_|  |_|\_\__,_|___|_|\___/|_| |_|
    `,
    });
    cli.register(InitCommand);
    cli.run();
  });
