/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "../../../../packages/runtime/src/index"
import defaultFormatters from "./formatters/zh"             // 默认语言格式化器
import defaultMessages from "./zh"  
import storage  from "./storage"

const messages = {
    'zh' :  defaultMessages,
    'en' : ()=>import("./en"),
	'jp' : ()=>import("./jp"),
	'cht' : ()=>import("./cht")
}

const formatters = {
    'zh' :  defaultFormatters,
    'en' : ()=>import("./formatters/en"),
	'jp' : ()=>import("./formatters/jp"),
	'cht' : ()=>import("./formatters/cht")
}

// 语言配置文件
const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "zh",
            "default": true,
            "active": true  
        },
        {
            "name": "en",
            "title": "en"
        },
        {
            "name": "jp",
            "title": "jp"
        },
        {
            "name": "cht",
            "title": "繁体中文",
            "fallback": "zh"
        }
    ], 
    "namespaces": {}
}

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "voerkai18n-nodejs",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出调试信息   
    idMap,                                          // 消息id映射列表    
    messages,                                       // 语言包
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