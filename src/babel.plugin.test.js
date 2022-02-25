const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const i18nPlugin = require("./babel-plugin-voerkai18n");


const code = fs.readFileSync(path.join(__dirname, "../demodata/index.js"), "utf-8");
babel.transform(code, {
    plugins: [
        [
            i18nPlugin,
            {a:1,b:2}
        ]]
}, function(err, result) { 
    console.log(result.code)
});