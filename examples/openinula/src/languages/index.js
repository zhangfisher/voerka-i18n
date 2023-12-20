/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap.js"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "@voerkai18n/runtime"
import defaultFormatters from "./formatters/zh.js"             // 默认语言格式化器
import defaultMessages from "./zh.js"  
import storage  from "./storage.js"



const messages = {
    'zh' :  defaultMessages,
    'en' : ()=>import("./en.js"),
	'de' : ()=>import("./de.js"),
	'jp' : ()=>import("./jp.js"),
	'fra' : ()=>import("./fra.js")
}

const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>import("./formatters/en.js"),
	'de' : ()=>import("./formatters/de.js"),
	'jp' : ()=>import("./formatters/jp.js"),
	'fra' : ()=>import("./formatters/fra.js")
}

// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "中文",
            "default": true,
            "active": true
        },
        {
            "name": "en",
            "title": "英语"
        },
        {
            "name": "de",
            "title": "德语"
        },
        {
            "name": "jp",
            "title": "日语"
        },
        {
            "name": "fra",
            "title": "法语"
        }
    ],
    "namespaces": {}
}

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "voerkai18n-example-openinula",                    // 当前作用域的id，自动取当前工程的package.json的name
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