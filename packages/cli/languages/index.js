
import messageIds from "./idMap.js"                                             // 语言ID映射文件
import  runtime from "./runtime.js"                           // 运行时
const { translate,i18nScope  } = runtime
import defaultFormatters from "./formatters/zh.js"             // 默认语言格式化器
const activeFormatters = defaultFormatters                 // 激活语言格式化器

import defaultMessages from "./zh.js"  
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
    'en' : ()=>import("./formatters/en.js"),
	'de' : ()=>import("./formatters/de.js")
}
// 语言包加载器
const loaders = { 
    "en" : ()=>import("./en.js"),
    "de" : ()=>import("./de.js") 
}

// 语言作用域
const scope = new i18nScope({
    ...scopeSettings,                               // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id          : "@voerkai18n/cli",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出高度信息
    default     : defaultMessages,                  // 默认语言包
    messages    : activeMessages,                   // 当前语言包
    idMap       : messageIds,                       // 消息id映射列表    
    formatters,                                     // 扩展自定义格式化器    
    loaders                                         // 语言包加载器
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 

export { 
    scopedTtranslate as t, 
    scope as i18nScope
}

