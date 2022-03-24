

const compile = require('@voerkai18n/cli/compile.command');
const path = require("path")


compile(path.resolve(__dirname,"./apps/app/languages")).then(()=>{})