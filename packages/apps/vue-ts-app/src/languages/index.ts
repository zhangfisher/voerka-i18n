import messageIds from "./idMap"                                             // 语言ID映射文件
import runtime from "@voerkai18n/runtime"
const { translate,VoerkaI18nScope  } = runtime
import defaultFormatters from "./formatters/zh"             // 默认语言格式化器
const activeFormatters = defaultFormatters
import defaultMessages from "./zh"  
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
        }
    ],
    "defaultLanguage": "zh",
    "activeLanguage": "zh",
    "namespaces": {}
}
const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>import("./formatters/en")
}
// 语言包加载器
const loaders = { 
    "en" : ()=>import("./en") 
}

// 语言作用域
const scope = new VoerkaI18nScope({
    ...scopeSettings,                               // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id          : "vue-ts-app",                    // 当前作用域的id，自动取当前工程的package.json的name
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