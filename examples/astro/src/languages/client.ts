import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import paragraphs from "./paragraphs"
import idMap from "./messages/idMap.json"
import {createTranslateComponent} from "./component.tsx"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"  

const component = createTranslateComponent()

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"),
    'ja-JP'    : ()=>import("./messages/ja-JP"),
}


export const i18nScope = new VoerkaI18nScope({    
    id: "nextjs_client",                                // 当前作用域的id
    idMap,                                              // 消息id映射列表    
    injectLangAttr:false,                               // 不注入lang属性
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    ...settings
}) 

export const t = i18nScope.t
export const Translate = i18nScope.Translate 
 