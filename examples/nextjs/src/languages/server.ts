'use server'

import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./idMap.json"
import settings from "./settings.json"
import defaultMessages from "./zh-CN"  
import { component,TranslateComponentType } from "./component"

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./en-US"),
    'ja-JP'    : ()=>import("./ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "react_0_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    component,                                          // 翻译组件
    ...settings
}) 

export const t = i18nScope.t
export const Translate = i18nScope.Translate

import {cache} from 'react';
import { userAgent } from "next/server"


let invalidFlag:number = 0

i18nScope.on("change",()=>invalidFlag++)


// 缓存版本的翻译函数，当语言变化时会自动刷新
const tCache =cache((message,vars,options,invalidFlag)=>i18nScope.t(message,vars,options)

const sc = ((message,vars,options)=>{
    return tCache(message,vars,options,invalidFlag)
})


/**
 * 
 * const t = useTranslate(request)
 * 
 * @param request 

 */
function useTranslate(request){
    const { device,browser } = userAgent(request)
    

}