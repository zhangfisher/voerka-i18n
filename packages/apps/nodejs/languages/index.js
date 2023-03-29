
const messageIds =require("./idMap.js")                                             // 语言ID映射文件
const runtime = require("../../../runtime/index.js");
const { translate,VoerkaI18nScope  } = runtime
const defaultFormatters =require("./formatters/zh")
const activeFormatters = defaultFormatters
const defaultMessages =require("./zh.js")
const activeMessages = defaultMessages
 
 
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
const formatters = {
    'zh' :  defaultFormatters,
    'en' : require("./formatters/en.js"),
	'de' : require("./formatters/de.js")
}
// 语言包加载器
const loaders = { 
    "en" : ()=>import("./en.js"),
    "de" : ()=>import("./de.js") 
}

// 语言作用域
const scope = new VoerkaI18nScope({
    ...scopeSettings,                               // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id          : "vueapp",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出高度信息
    default     : defaultMessages,                  // 默认语言包
    messages    : activeMessages,                   // 当前语言包
    idMap       : messageIds,                       // 消息id映射列表    
    formatters,                                     // 扩展自定义格式化器    
    loaders                                         // 语言包加载器
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 

module.exports = { 
    t:scopedTtranslate , 
    i18nScope:scope 
}

