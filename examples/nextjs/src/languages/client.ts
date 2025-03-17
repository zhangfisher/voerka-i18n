'use client'
import { createClientTranslateComponent,ReactTranslateComponentType }  from "@voerkai18n/nextjs/client"
import { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import formatters from "@voerkai18n/formatters" 
import storage  from "./storage"
import loader from "./loader"
import {transform, type TransformResultType} from "./transform"
import idMap from "./messages/idMap.json"
import paragraphs from "./paragraphs"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"    
  
const component = createClientTranslateComponent()  
 
const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"),
    'ja-JP'    : ()=>import("./messages/ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<ReactTranslateComponentType,TransformResultType>({    
    id: "nextjs_client",                                // 当前作用域的id
    idMap,                                              // 消息id映射列表    
    injectLangAttr:false,                               // 不注入lang属性
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    loader,
    transform,
    ...settings
}) 

export const t = i18nScope.t
export const $t = i18nScope.$t
export const Translate = i18nScope.Translate as React.FC<VoerkaI18nTranslateProps>
export { VoerkaI18nNextjsProvider } from "@voerkai18n/nextjs/client"
