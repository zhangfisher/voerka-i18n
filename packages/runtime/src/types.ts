import type { VoerkaI18nManager } from "./manager"
import type { VoerkaI18nScope } from "./scope"

declare global {    
    export var VoerkaI18n: VoerkaI18nManager
}


export type SupportedDateTypes = "String" | "Number" | "Boolean" | "Object" | "Array" | "Function" | "Error" | "Symbol" | "RegExp" | "Date" | "Null" | "Undefined" | "Set" | "Map" | "WeakSet" | "WeakMap"

// 语言包
export type VoerkaI18nLanguageMessages = Record<string, string | string[]> | {
    $config?: VoerkaI18nTypesFormatterConfigs
    $remote?: boolean
}       

export type VoerkaI18nLanguageMessagePack = Record<string, VoerkaI18nLanguageMessages | VoerkaI18nMessageLoader> 

export type VoerkaI18nDynamicLanguageMessages = Record<string, string | string[]> & {
    $config?: VoerkaI18nTypesFormatterConfigs
}   
export interface VoerkaI18nLanguagePack {
    [language: string]: VoerkaI18nLanguageMessages
}

export type Voerkai18nIdMap = Record<string, number>

export interface VoerkaI18nLanguageDefine {
    name: string
    title?: string
    default?: boolean           // 是否默认语言
    active?: boolean                 
    fallback?: string
}


export type VoerkaI18nFormatterConfigs = Record<string, any>
export type VoerkaI18nFormatter = ((value: any,args: any[],config: VoerkI18nFormatterConfigs) => string) 
export type VoerkaI18nTypesFormatters=Partial<Record<SupportedDateTypes, VoerkaI18nFormatter>>
export type VoerkaI18nTypesFormatterConfig= Partial<Record<string, any>>
export type VoerkaI18nTypesFormatterConfigs= Partial<Record<SupportedDateTypes | string, Record<string,any>>>
export type VoerkaI18nFormattersLoader =  (()=>Promise<VoerkaI18nFormatters>)
// 每一个语言的格式化器定义={$types:{...},$config:{...},[格式化器名称]: () => {},[格式化器名称]: () => {}
// 在formatters/xxxx.ts里面进行配置
export type VoerkaI18nFormatters = {
    global?: boolean | Omit<VoerkaI18nFormatters,'global'>                                                // 是否全局格式化器
    $types?:VoerkaI18nTypesFormatters
    $config?: VoerkaI18nTypesFormatterConfigs
} | {
    [key: string]: VoerkaI18nFormatter
}

// 包括语言的{"*":{...},zh:{...},en:{...}} 
// 声明格式化器
export type VoerkaI18nLanguageFormatters =  Record<string,VoerkaI18nFormatters | VoerkaI18nMessageLoader>


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


export type VoerkI18nFormatterConfigs = Record<string, any>
 

export type Primitive = string | number | boolean | null | undefined
