import type { VoerkaI18nManager } from "./manager"
import { VoerkaI18nFormatterConfig } from "./formatter/types"
import type { VoerkaI18nScope } from "./scope" 

export type SupportedDateTypes = "String" | "Number" | "Boolean" | "Object" | "Array" | "Function" | "Error" | "Symbol" | "RegExp" | "Date" | "Null" | "Undefined" | "Set" | "Map" | "WeakSet" | "WeakMap"

// 语言包
export type VoerkaI18nLanguageMessages = {
    $config?: VoerkaI18nFormatterConfig
    $remote?: boolean
}  & {
    [key in string]?: string | string[]
}  

export type VoerkaI18nLanguageMessagePack = Record<LanguageName, VoerkaI18nLanguageMessages | VoerkaI18nMessageLoader> 

export type VoerkaI18nDynamicLanguageMessages = Record<string, string | string[]> & {
    $config?: VoerkaI18nFormatterConfig
}   

export interface VoerkaI18nLanguagePack {
    [language: string]: VoerkaI18nLanguageMessages
}

export type Voerkai18nIdMap = Record<string, number>

export interface VoerkaI18nLanguageDefine {
    name     : LanguageCodes
    title?   : string
    default? : boolean           // 是否默认语言
    active?  : boolean           // 是否激活      
    fallback?: string            // 回退语言
}

 
// 提供一个简单的KV存储接口,用来加载相关的存储
export interface IVoerkaI18nStorage{ 
    get(key:string):any
    set(key:string,value:any):void
    remove(key:string):any
}



export type VoerkaI18nMessageLoader = () => Awaited<Promise<any>>
export interface VoerkaI18nMessageLoaders {
    [key: string]: VoerkaI18nMessageLoader
} 

export type VoerkaI18nDefaultMessageLoader = (this:VoerkaI18nScope,newLanguage:string,scope:VoerkaI18nScope)=>Promise<VoerkaI18nLanguageMessages>

export type TranslateMessageVars = number | boolean | string | Function | Date
export interface VoerkaI18nTranslate {
    (message: string, ...vars: TranslateMessageVars[]): string
    (message: string, vars: TranslateMessageVars[]): string
    (message: string, vars?: Record<string, TranslateMessageVars>): string
}


export interface VoerkaI18nSupportedLanguages {
    [key: string]: VoerkaI18nLanguageDefine
}

 

export type Primitive = string | number | boolean | null | undefined

export type LanguageName = string
declare global {   
    export var VoerkaI18n: VoerkaI18nManager
    export var __VoerkaI18nScopes__: VoerkaI18nScope[]
}

   
  
export type VoerkaI18nEvents = {
    log       : { level: string, message:string }                  // 当有日志输出时，data={level
    ready     : string                                             // 当初始化切换完成后触发
    change    : string                                             // 当语言切换后时, payload=language
    registered: string                                             // 当Scope注册时触发, payload=scopeId
    restore   : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}
    patched   : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}               
    error     : Error                                              // 当有错误发生时
}      
    
export type Dict<T=any> = Record<string,T>

export type LanguageCodes = 'aa' | 'ab' | 'ae' | 'af' | 'ak' | 'am' | 'an' | 'ar' | 'as' | 'av' | 'ay' | 'az' 
    | 'ba' | 'be' | 'bg' | 'bh' | 'bi' | 'bm' | 'bn' | 'bo' | 'br' | 'bs' 
    | 'ca' | 'ce' | 'ch' | 'co' | 'cr' | 'cs' | 'cu' | 'cv' | 'cy' 
    | 'da' | 'de' | 'dv' | 'dz' 
    | 'ee' | 'el' | 'en' | 'eo' | 'es' | 'et' | 'eu' 
    | 'fa' | 'ff' | 'fi' | 'fj' | 'fo' | 'fr' | 'fy' 
    | 'ga' | 'gd' | 'gl' | 'gn' | 'gu' | 'gv' 
    | 'ha' | 'he' | 'hi' | 'ho' | 'hr' | 'ht' | 'hu' | 'hy' | 'hz' 
    | 'ia' | 'id' | 'ie' | 'ig' | 'ii' | 'ik' | 'io' | 'is' | 'it' | 'iu' 
    | 'ja' | 'jv' 
    | 'ka' | 'kg' | 'ki' | 'kj' | 'kk' | 'kl' | 'km' | 'kn' | 'ko' | 'kr' | 'ks' | 'ku' | 'kv' | 'kw' | 'ky' 
    | 'la' | 'lb' | 'lg' | 'li' | 'ln' | 'lo' | 'lt' | 'lu' | 'lv' 
    | 'mg' | 'mh' | 'mi' | 'mk' | 'ml' | 'mn' | 'mr' | 'ms' | 'mt' | 'my' 
    | 'na' | 'nb' | 'nd' | 'ne' | 'ng' | 'nl' | 'nn' | 'no' | 'nr' | 'nv' | 'ny' 
    | 'oc' | 'oj' | 'om' | 'or' | 'os' 
    | 'pa' | 'pi' | 'pl' | 'ps' | 'pt' 
    | 'qu' 
    | 'rm' | 'rn' | 'ro' | 'ru' | 'rw' 
    | 'sa' | 'sc' | 'sd' | 'se' | 'sg' | 'si' | 'sk' | 'sl' | 'sm' | 'sn' | 'so' | 'sq' | 'sr' | 'ss' | 'st' | 'su' | 'sv' | 'sw' 
    | 'ta' | 'te' | 'tg' | 'th' | 'ti' | 'tk' | 'tl' | 'tn' | 'to' | 'tr' | 'ts' | 'tt' | 'tw' | 'ty' 
    | 'ug' | 'uk' | 'ur' | 'uz' 
    | 've' | 'vi' | 'vo' 
    | 'wa' | 'wo' 
    | 'xh' 
    | 'yi' | 'yo' 
    | 'za' | 'zh' | 'zu'



