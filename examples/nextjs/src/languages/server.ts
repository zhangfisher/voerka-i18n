'use server'
import { createServerTranslateComponent }  from "@voerkai18n/nextjs/server"
import { VoerkaI18nScope, type VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import formatters from "@voerkai18n/formatters"
import type { ComponentType } from 'react'; 
import storage  from "./storage"
import idMap from "./idMap.json"
import settings from "./settings.json"
import zhCNMessages from "./zh-CN"    
import enUSMessages from "./en-US";
import jaJPMessages from "./ja-JP";
  
const component = createServerTranslateComponent() 
export type TranslateComponentType = ComponentType<VoerkaI18nTranslateProps>

 
const messages = { 
    'zh-CN'    : zhCNMessages,
    'en-US'    : enUSMessages,
    'ja-JP'    : jaJPMessages
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "nextjs_server",                                 // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    component,                                          // 翻译组件
    ...settings
}) 

export const t = i18nScope.t
export const Translate = i18nScope.Translate