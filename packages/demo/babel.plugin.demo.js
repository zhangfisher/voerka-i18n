const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const i18nPlugin = require("@voerkai18n/tools/babel-plugin-voerkai18n");


const code = fs.readFileSync(path.join(__dirname, "./apps/app/index.js"), "utf-8");
babel.transform(code, {
    plugins: [
        [
            i18nPlugin,
            {
                location:"./languages"              // 指定语言文件存放的目录，即保存编译后的语言文件的文件夹
            }            
        ]
    ]
}, function(err, result) { 
    console.log(result.code)
});