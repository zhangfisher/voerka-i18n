/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap.js"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "@voerkai18n/runtime"
import defaultFormatters from "./formatters/en.js"             // 默认语言格式化器
import defaultMessages from "./en.js"  
import storage  from "./storage.js"

const messages = {
    'zh' : ()=>import("./zh.js"),
	'en' :  defaultMessages,
    'th' : ()=>import("./th.js"),
	'jp' : ()=>import("./jp.js"),
	'de' : ()=>import("./de.js")
}

const formatters = {
    'zh' : ()=>import("./formatters/zh.js"),
	'en' :  defaultFormatters,
    'th' : ()=>import("./formatters/th.js"),
	'jp' : ()=>import("./formatters/jp.js"),
	'de' : ()=>import("./formatters/de.js")
}

// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "Chinese"
        },
        {
            "name": "en",
            "title": "English",
            "default":true, 
        },
        {
            "name": "th",
            "title": "th"
        },
        {
            "name": "jp",
            "title": "Japanese"
        },
        {
            "name": "de",
            "title": "German"
        }
    ],
    "namespaces": {}
}

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "voerkai18n",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出调试信息   
    idMap,                                          // 消息id映射列表        
    library     : false,                      // 开发库时设为true
    messages,                                       // 语言包+
    formatters,                                     // 扩展自定义格式化器    
    storage,                                        // 语言配置存储器
    ...scopeSettings
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
export { 
    scopedTtranslate as t, 
    scope as i18nScope
}