
const messageIds = require("./idMap")
const { translate,i18nScope  } =  require("./runtime.js")

const formatters = require("./formatters.js")
const defaultMessages =  require("./zh.js")  
const activeMessages = defaultMessages
 
 
// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "zh"
        },
        {
            "name": "en",
            "title": "en"
        },
        {
            "name": "de",
            "title": "de"
        }
    ],
    "defaultLanguage": "zh",
    "activeLanguage": "zh",
    "namespaces": {}
}

// 语言作用域
const scope = new i18nScope({
    ...scopeSettings,                           // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id: "@voerkai18n/cli",                          // 当前作用域的id，自动取当前工程的package.json的name
    default:   defaultMessages,                 // 默认语言包
    messages : activeMessages,                  // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters,                                  // 当前作用域的格式化函数列表
    loaders:{ 
        "en" : ()=>import("./en.js"),
        "de" : ()=>import("./de.js") 
    }
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 

module.exports.t = scopedTtranslate
module.exports.i18nScope = scope 

