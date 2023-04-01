import type { VoerkaI18nManager } from "./manager"
import type { VoerkaI18nScope } from "./scope"

declare global {    
    export var VoerkaI18n: VoerkaI18nManager
}




export type VoerkaI18nLanguageMessages = Record<string, string | string[]>       
export interface VoerkaI18nLanguagePack {
    [language: string]: VoerkaI18nLanguageMessages
}

export type Voerkai18nIdMap = Record<string, number>

export interface VoerkaI18nLanguage {
    name: string
    title?: string
    default?: boolean
    fallback?: string
}


export type VoerkaI18nFormatter = (value: string, ...args: any[]) => string
export type VoerkaI18nFormatterConfigs = Record<string, any>

export type VoerkaI18nFormatters = Record<string, ({
    $types?: Record<string, VoerkaI18nFormatter>
    $config?: Record<string, string>
} & {
    [key: string]: VoerkaI18nFormatter
})> //| (() => Promise<any>)>

export type VoerkI18nLoader = () => Awaited<Promise<any>>
export interface VoerkI18nLoaders {
    [key: string]: VoerkI18nLoader
} 
export type VoerkI18nMessageLoader = (this:VoerkaI18nScope,newLanguage:string,scope:VoerkaI18nScope)=>Promise<VoerkaI18nLanguageMessages>

export interface VoerkaI18nScopeCache{
    activeLanguage? : null,
    typedFormatters?: {},
    formatters?     : {},
}
export type TranslateMessageVars = number | boolean | string | Function | Date
export interface VoerkaI18nTranslate {
    (message: string, ...args: TranslateMessageVars[]): string
    (message: string, vars?: Record<string, TranslateMessageVars>): string
}
export interface VoerkaI18nSupportedLanguages {
    [key: string]: VoerkaI18nLanguage
}


// export class VoerkaI18nScope {
//     constructor(options: VoerkaI18nScopeOptions, callback?: Function)
//     get id(): string                                                            // 作用域唯一id	
//     get debug(): boolean                                                        // 调试开关	
//     get defaultLanguage(): string                                               // 默认语言名称	
//     get activeLanguage(): string                                                // 默认语言名称	
//     get default(): VoerkaI18nLanguageMessages                                       // 默认语言包	
//     get messages(): VoerkaI18nLanguageMessages                                      // 当前语言包	
//     get idMap(): Voerkai18nIdMap                                                // 消息id映射列表	
//     get languages(): VoerkaI18nSupportedLanguages                               // 当前作用域支持的语言列表[{name,title,fallback}]	
//     get loaders(): VoerkI18nLoaders                                             // 异步加载语言文件的函数列表	
//     get global(): VoerkaI18nManager                                                   // 引用全局VoerkaI18n配置，注册后自动引用    
//     get formatters(): VoerkI18nFormatters                                       // 当前作用域的所有格式化器定义 {<语言名称>: {$types,$config,[格式化器名称]: ()          = >{},[格式化器名称]: () => {}}}    
//     get activeFormatters(): VoerkI18nFormatters                                 // 当前作用域激活的格式化器定义 {$types,$config,[格式化器名称]: ()                       = >{},[格式化器名称]: ()          = >{}}   
//     get activeFormatterConfig(): VoerkI18nFormatterConfigs                      // 当前格式化器合并后的配置参数，参数已经合并了全局格式化器中的参数
//     get t(): VoerkaI18nTranslate
//     get translate(): VoerkaI18nTranslate
//     /**
//      * 在全局注册作用域当前作用域
//      * @param {*} callback   注册成功后的回调
//      */
//     register(callback: Function): void
//     /**
//      * 注册格式化器
//      */
//     registerFormatter(name: string, formatter: VoerkI18nFormatter, { language, global }: { language: string | string[], global: boolean }): void
//     /**
//      * 注册多种格式化器
//      */
//     registerFormatters(formatters: VoerkI18nFormatters, asGlobal?: boolean): void
//     /**
//      * 注册默认文本信息加载器
//      */
//     registerDefaultLoader(fn: Function): void
//     /**
//      * 获取指定语言信息
//      * @param {*} language
//      * @returns
//      */
//     getLanguage(language: string): VoerkaI18nLanguageMessages
//     hasLanguage(language: string): boolean
//     refresh(newLanguage: string): Promise<void>
//     on(): void
//     off(): void
//     offAll(): void
//     change(language: string): Promise<void>
// }
export type VoerkI18nFormatterConfigs = Record<string, any>
// 翻译函数
export var translate: {
    (message: string, ...args: (string | Function)[]): string
    (message: string, vars?: Record<string, any>): string
}
export interface CreateFormatterOptions {
    normalize?: (value: any) => any          // 对输入值进行规范化处理，如进行时间格式化时，为了提高更好的兼容性，支持数字时间戳/字符串/Date等，需要对输入值进行处理，如强制类型转换等
    params?: string[] | null            // 可选的，声明参数顺序，如果是变参的，则需要传入null
    configKey?: string                      // 声明该格式化器在$config中的路径，支持简单的使用.的路径语法
}

export type Primitive = string | number | boolean | null | undefined

export interface FormatterDefine {
    (this: VoerkI18nFormatterConfigs, value: any, ...args: Primitive[]): string
    (this: VoerkI18nFormatterConfigs, value: any, arg1: Primitive, $config: VoerkI18nFormatterConfigs): string
    (this: VoerkI18nFormatterConfigs, value: any, arg1: Primitive, arg2: Primitive, $config: VoerkI18nFormatterConfigs): string
    (this: VoerkI18nFormatterConfigs, value: any, arg1: Primitive, arg2: Primitive, arg3: Primitive, $config: VoerkI18nFormatterConfigs): string
    configurable?: boolean
}
// 创建格式化器
export type CreateFormatterType = (fn: Function, options: CreateFormatterOptions, defaultParams: Record<string, any>) => FormatterDefine
export var createFormatter: CreateFormatterType
export var Formatter: CreateFormatterType

export type CreateFlexFormatterType = (fn: Function, options: CreateFormatterOptions, defaultParams: Record<string, any>) => FormatterDefine
export var createFlexFormatter: CreateFlexFormatterType
export var FlexFormatter: CreateFlexFormatterType
export var getDataTypeName: (value: any) => string
export var toDate: (value: any) => Date | number
export var toNumber: (value: any, defaultValue: number) => number
export var toBoolean: (value: any) => boolean

