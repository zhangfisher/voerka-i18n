/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap.js"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "@voerkai18n/runtime"
import defaultFormatters from "./formatters/zh.js"             // 默认语言格式化器
import defaultMessages from "./zh.js"  

const messages = {
    'zh' :  defaultMessages,
    'en' : ()=>import("./en.js")
}

const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>import("./formatters/en.js")
}

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

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "voerkai18n-nodejs-module",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出调试信息   
    idMap,                                          // 消息id映射列表    
    messages,                                       // 语言包
    formatters,                                     // 扩展自定义格式化器    
    ...scopeSettings
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
export { 
    scopedTtranslate as t, 
    scope as i18nScope
}