import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./messages/idMap.json"
import paragraphs from "./paragraphs"
import { component,type TranslateComponentType } from "./component"
import settings from "./settings.json"
import zhCNMessages from "./messages/zh-CN"    
import enUSMessages from "./messages/en-US";
import jaJPMessages from "./messages/ja-JP";

const messages = { 
    'zh-CN'    : zhCNMessages,
    'en-US'    : enUSMessages,
    'ja-JP'    : jaJPMessages
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "svelte__0_0_1",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    ...settings
}) 




export const t = i18nScope.t
export const Translate = i18nScope.Translate
