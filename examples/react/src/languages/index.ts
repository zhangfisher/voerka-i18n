import { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./messages/idMap.json"
import { component,type TranslateComponentType } from "./component"
import paragraphs from "./paragraphs"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"  

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"),
    'ja-JP'    : ()=>import("./messages/ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "@voerkai18n-examples/react__1_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    component,                                          // 翻译组件
    paragraphs,
    ...settings
}) 


export const t = i18nScope.t
export const Translate = i18nScope.Translate  as React.FC<VoerkaI18nTranslateProps>

