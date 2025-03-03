'use client'
import { createClientTranslateComponent,ReactTranslateComponentType }  from "@voerkai18n/nextjs/client"
import { VoerkaI18nScope } from '@voerkai18n/runtime';
import formatters from "@voerkai18n/formatters" 
import storage  from "./storage"
import idMap from "./idMap.json"
import settings from "./settings.json"
import defaultMessages from "./zh-CN"    
  
const component = createClientTranslateComponent()  
 
const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./en-US"),
    'ja-JP'    : ()=>import("./ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<ReactTranslateComponentType>({    
    id: "nextjs_client",                                // 当前作用域的id
    idMap,                                              // 消息id映射列表    
    injectLangAttr:false,                               // 不注入lang属性
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    component,                                          // 翻译组件
    ...settings
}) 

export const t = i18nScope.t
export const Translate = i18nScope.Translate as ReactTranslateComponentType
export { VoerkaI18nNextjsProvider } from "@voerkai18n/nextjs/client"
