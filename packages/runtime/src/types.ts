import type { VoerkaI18nManager } from "./manager"
import { VoerkaI18nFormatterConfig } from "./formatter/types"
import type { VoerkaI18nScope, VoerkaI18nScopeOptions } from "./scope" 
import type { BCP47LanguageTagName } from "bcp47-language-tags" 

export type SupportedDateTypes = "String" | "Number" | "Boolean" | "Object" | "Array" | "Function" | "Error" | "Symbol" | "RegExp" | "Date" | "Null" | "Undefined" | "Set" | "Map" | "WeakSet" | "WeakMap"

// 语言包
export type VoerkaI18nLanguageMessages = Record<
    string, 
    string | string[] | VoerkaI18nFormatterConfig | boolean
>

export type VoerkaI18nLanguageMessagePack = Record<LanguageName, 
    VoerkaI18nLanguageMessages 
    | VoerkaI18nLanguageLoader
    | VoerkaI18nLanguageAsyncChunk

> 

export type VoerkaI18nLanguageAsyncChunk = ()=> Promise<any>

export type VoerkaI18nDynamicLanguageMessages = Record<string, string | string[]> & {
    $config?: VoerkaI18nFormatterConfig
}   

export interface VoerkaI18nLanguagePack {
    [language: string]: VoerkaI18nLanguageMessages
}

export type Voerkai18nIdMap = Record<string, number>

export interface VoerkaI18nLanguageDefine {
    name        : string               // 语言代码
    title?      : string               // 语言标题
    nativetitle?: string               // 用原语言表达的标题
    default?    : boolean              // 是否默认语言
    active?     : boolean              // 是否激活      
    fallback?   : string               // 回退语言
}

// 提供一个简单的KV存储接口,用来加载相关的存储
export interface IVoerkaI18nStorage{
    get(key:string):any
    set(key:string,value:any):void
    remove(key:string):any
}

 
export type VoerkaI18nLanguageLoader = (newLanguage:string,scope:VoerkaI18nScope)=>Promise<VoerkaI18nLanguageMessages | undefined | void>

export type TranslateMessageVars = number | boolean | string | Function | Date

export interface VoerkaI18nTranslate {
    (message: string, ...vars: TranslateMessageVars[]): string
    (message: string, vars: TranslateMessageVars[]): string
    (message: string, vars?: Record<string, TranslateMessageVars>): string
}


export interface VoerkaI18nSupportedLanguages {
    [key: string]: VoerkaI18nLanguageDefine
}


export type LanguageName = string
declare global {   
    export var VoerkaI18n: VoerkaI18nManager
    export var __VoerkaI18nScopes__: VoerkaI18nScope[]
}

   
  
export type VoerkaI18nEvents = {
    log             : { level: string, message:string }                  // 当有日志输出时
    init            : ()=>string                                             // 当第一个应用Scope注册时触发
    ready           : string                                             // 当初始化切换完成后触发
    change          : string                                             // 当语言切换后时, payload=language
    restore         : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}
    patched         : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}    
    error           : Error                                              // 当有错误发生时    
    "scope/change"  : { scope:string,language:string }                   //  
    "scope/fallback": { scope:string,from:string,to:string}             // 当切换到无效的语言或者加载失败时，进行回退
} 
    
export type Dict<T=any> = Record<string,T>

export type LanguageCodes = BCP47LanguageTagName

 
export interface VoerkaI18nPackageJsonSettings {
    entry?:string
}
 
export type VoerkaI18nSettings ={
    entry?     : string
    namespaces?: Record<string,string>
    languages? : LanguageCodes[]
} & Omit<VoerkaI18nScopeOptions, 
    'storage' | 'idMap' | 'formatters' | 'log' | 'attached' | 'loader' | 'messages' | 'languages'>  
