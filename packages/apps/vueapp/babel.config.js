const i18nPlugin =require("@voerkai18n/babel")
module.exports = {
    presets: [ 
        "@babel/preset-env",
        {
            corejs: { 
                useBuiltIns: 'entry',
                version: "3.8", 
                proposals: true 
            }
        }
    ],
    plugins: [
        [
            i18nPlugin,
            {
                // 可选，指定语言文件存放的目录，即保存编译后的语言文件的文件夹
                // 可以指定相对路径，也可以指定绝对路径
                // location:"",
                autoImport:"/src/languages/index.js"  
            }            
        ]
    ]
}