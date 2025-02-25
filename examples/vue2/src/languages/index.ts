import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./idMap.json"
import { component,TranslateComponentType } from "./component"
import settings from "./settings.json"
import defaultMessages from "./zh-CN"    

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./en-US"),
    'ja-JP'    : ()=>import("./ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "@voerkai18n-examples/vue2_0_1_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    component,                                          // 翻译组件
    ...settings
}) 


export const t = i18nScope.t
export const Translate= i18nScope.Translate 
