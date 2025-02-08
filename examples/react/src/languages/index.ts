import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./idMap"
import settings from "./settings.json"
import defaultMessages from "./zh-CN"  

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./en-US"),
    'ja-JP'    : ()=>import("./ja-JP"),
}


export const i18nScope = new VoerkaI18nScope({    
    id: "react_0_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    ...settings
}) 


export const t = i18nScope.t

