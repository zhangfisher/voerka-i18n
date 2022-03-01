const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const i18nPlugin = require("./babel-plugin-voerkai18n");


const code = fs.readFileSync(path.join(__dirname, "../demodata/index.js"), "utf-8");
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