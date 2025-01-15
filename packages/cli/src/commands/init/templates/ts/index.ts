import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "./formatters"
import idMap from "./idMap"
import settings from "./settings.json"
import defaultMessages from "./zh-CN"

const messages = {
    'zh-CN' :  defaultMessages,
    'en-US' : ()=>import("./en-US")
}
 
// 语言作用域
export const i18nScope = new VoerkaI18nScope({    
    id: "{scopeId}",                                // 当前作用域的id
    idMap,                                          // 消息id映射列表
    formatters,                                     // 扩展自定义格式化器
    storage,                                        // 语言配置存储器
    messages,                                       // 语言包
    ...settings
}) 

// 翻译函数
export const t = i18nScope.t

