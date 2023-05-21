/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
const idMap = require("./idMap")
const { translate,VoerkaI18nScope  } =  require("@voerkai18n/runtime")
const defaultFormatters = require("./formatters/zh.js")
const defaultMessages =  require("./zh.js")      
const storage = require("./storage.js")

const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>require("./formatters/en.js"),
	'de' : ()=>require("./formatters/de.js")
}
 
const messages = {
    'zh' :  defaultMessages,
    'en' : ()=>require("./en.js"),
	'de' : ()=>require("./de.js")
}
 

// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "中文"
        },
        {
            "name": "en",
            "title": "英文"
        },
        {
            "name": "de",
            "title": "德语"
        }
    ],
    "defaultLanguage": "zh",
    "activeLanguage": "zh",
    "namespaces": {}
}
// 语言作用域
const scope = new VoerkaI18nScope({    
    // 当前作用域的id，自动取当前工程的package.json的name
    id          : "@voerkai18n/cli",                    
    debug       : false,                            // 是否在控制台输出高度信息
    messages,                                       // 当前语言包
    idMap ,                                         // 消息id映射列表    
    formatters,                                     // 扩展自定义格式化器    
    storage,                                        // 语言配置存储器
    ...scopeSettings                             
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
module.exports.t = scopedTtranslate
module.exports.i18nScope = scope 