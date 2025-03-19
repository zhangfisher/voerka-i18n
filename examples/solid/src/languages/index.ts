import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import loader from "./loader"
import paragraphs from "./paragraphs"
import idMap from "./messages/idMap.json"
import { component,type TranslateComponentType } from "./component"
import { transform, type TransformResultType } from "./transform"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"  

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"),
    'ja-JP'    : ()=>import("./messages/ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType,TransformResultType>({    
    id: "@voerkai18n-examples/solid__1_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    loader,                                            // 语言包加载器
    transform,
    ...settings
}) 


export const t = i18nScope.t
export const $t = i18nScope.$t
export const Translate = i18nScope.Translate
