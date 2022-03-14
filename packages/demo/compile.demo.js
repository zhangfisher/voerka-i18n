

const compile = require('@voerkai18n/tools/compile.command');
const path = require("path")


compile(path.resolve(__dirname,"./apps/app/languages")).then(()=>{})