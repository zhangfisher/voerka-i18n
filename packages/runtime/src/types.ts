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

export type VoerkaI18nLanguageMessagePack = Record<LanguageName, VoerkaI18nLanguageMessages | VoerkaI18nLanguageLoader> 

export type VoerkaI18nDynamicLanguageMessages = Record<string, string | string[]> & {
    $config?: VoerkaI18nFormatterConfig
}   

export interface VoerkaI18nLanguagePack {
    [language: string]: VoerkaI18nLanguageMessages
}

export type Voerkai18nIdMap = Record<string, number>

export interface VoerkaI18nLanguageDefine {
    name     : ISO630LanguageCodes        // 语言代码
    title?   : string               // 语言标题
    default? : boolean              // 是否默认语言
    active?  : boolean              // 是否激活      
    fallback?: string               // 回退语言
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
    init            : undefined                                          // 当第一个应用Scope注册时触发
    ready           : string                                             // 当初始化切换完成后触发
    change          : string                                             // 当语言切换后时, payload=language
    restore         : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}
    patched         : { scope:string,language:string }                   // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}    
    error           : Error                                              // 当有错误发生时    
    "scope/change"  : { scope:string,language:string }                   //  
    "scope/fallback": { scope:string,from:string,to:string}             // 当切换到无效的语言或者加载失败时，进行回退
} 
    
export type Dict<T=any> = Record<string,T>

export type ISO630LanguageCodes = 
    // 阿法尔语 | 阿布哈兹语 | 阿维斯陀语 | 南非荷兰语 | 阿坎语 | 阿姆哈拉语 | 阿拉贡语 | 阿拉伯语 | 阿萨姆语 | 阿瓦尔语 | 艾马拉语 | 阿塞拜疆语
    'aa' | 'ab' | 'ae' | 'af' | 'ak' | 'am' | 'an' | 'ar' | 'as' | 'av' | 'ay' | 'az' 
    // 巴什基尔语 | 白俄罗斯语 | 保加利亚语 | 比哈尔语 | 比斯拉马语 | 班巴拉语 | 孟加拉语 | 藏语 | 布列塔尼语 | 波斯尼亚语
    | 'ba' | 'be' | 'bg' | 'bh' | 'bi' | 'bm' | 'bn' | 'bo' | 'br' | 'bs' 
    // 加泰罗尼亚语 | 车臣语 | 查莫罗语 | 科西嘉语 | 克里语 | 捷克语 | 教会斯拉夫语 | 楚瓦什语 | 威尔士语
    | 'ca' | 'ce' | 'ch' | 'co' | 'cr' | 'cs' | 'cu' | 'cv' | 'cy' 
    // 丹麦语 | 德语 | 迪维希语 | 宗喀语
    | 'da' | 'de' | 'dv' | 'dz' 
    // 埃维语 | 希腊语 | 英语 | 世界语 | 西班牙语 | 爱沙尼亚语 | 巴斯克语
    | 'ee' | 'el' | 'en' | 'eo' | 'es' | 'et' | 'eu' 
    // 波斯语 | 富拉语 | 芬兰语 | 斐济语 | 法罗语 | 法语 | 西弗里西亚语
    | 'fa' | 'ff' | 'fi' | 'fj' | 'fo' | 'fr' | 'fy' 
    // 爱尔兰语 | 苏格兰盖尔语 | 加利西亚语 | 瓜拉尼语 | 古吉拉特语 | 马恩语
    | 'ga' | 'gd' | 'gl' | 'gn' | 'gu' | 'gv' 
    // 豪萨语 | 希伯来语 | 印地语 | 希里莫图语 | 克罗地亚语 | 海地克里奥尔语 | 匈牙利语 | 亚美尼亚语 | 赫雷罗语
    | 'ha' | 'he' | 'hi' | 'ho' | 'hr' | 'ht' | 'hu' | 'hy' | 'hz' 
    // 国际语 | 印度尼西亚语 | 西方国际语 | 伊博语 | 四川彝语 | 依努皮克语 | 伊多语 | 冰岛语 | 意大利语 | 因纽特语
    | 'ia' | 'id' | 'ie' | 'ig' | 'ii' | 'ik' | 'io' | 'is' | 'it' | 'iu' 
    // 日语 | 爪哇语
    | 'ja' | 'jv' 
    // 格鲁吉亚语 | 刚果语 | 基库尤语 | 宽亚玛语 | 哈萨克语 | 格陵兰语 | 高棉语 | 卡纳达语 | 韩语 | 卡努里语 | 克什米尔语 | 库尔德语 | 科米语 | 康沃尔语 | 吉尔吉斯语
    | 'ka' | 'kg' | 'ki' | 'kj' | 'kk' | 'kl' | 'km' | 'kn' | 'ko' | 'kr' | 'ks' | 'ku' | 'kv' | 'kw' | 'ky' 
    // 拉丁语 | 卢森堡语 | 卢干达语 | 林堡语 | 林加拉语 | 老挝语 | 立陶宛语 | 卢巴-卡坦加语 | 拉脱维亚语
    | 'la' | 'lb' | 'lg' | 'li' | 'ln' | 'lo' | 'lt' | 'lu' | 'lv' 
    // 马尔加什语 | 马绍尔语 | 毛利语 | 马其顿语 | 马拉雅拉姆语 | 蒙古语 | 马拉地语 | 马来语 | 马耳他语 | 缅甸语
    | 'mg' | 'mh' | 'mi' | 'mk' | 'ml' | 'mn' | 'mr' | 'ms' | 'mt' | 'my' 
    // 瑙鲁语 | 挪威博克马尔语 | 北恩德贝勒语 | 尼泊尔语 | 恩敦加语 | 荷兰语 | 挪威尼诺斯克语 | 挪威语 | 南恩德贝勒语 | 纳瓦霍语 | 齐切瓦语
    | 'na' | 'nb' | 'nd' | 'ne' | 'ng' | 'nl' | 'nn' | 'no' | 'nr' | 'nv' | 'ny' 
    // 奥克语 | 奥吉布瓦语 | 奥罗莫语 | 奥里亚语 | 奥塞梯语
    | 'oc' | 'oj' | 'om' | 'or' | 'os' 
    // 旁遮普语 | 巴利语 | 波兰语 | 普什图语 | 葡萄牙语
    | 'pa' | 'pi' | 'pl' | 'ps' | 'pt' 
    // 克丘亚语
    | 'qu' 
    // 罗曼什语 | 基隆迪语 | 罗马尼亚语 | 俄语 | 基尼亚卢旺达语
    | 'rm' | 'rn' | 'ro' | 'ru' | 'rw' 
    // 梵语 | 撒丁语 | 信德语 | 北萨米语 | 桑戈语 | 僧伽罗语 | 斯洛伐克语 | 斯洛文尼亚语 | 萨摩亚语 | 修纳语 | 索马里语 | 阿尔巴尼亚语 | 塞尔维亚语 | 斯瓦蒂语 | 南索托语 | 巽他语 | 瑞典语 | 斯瓦希里语
    | 'sa' | 'sc' | 'sd' | 'se' | 'sg' | 'si' | 'sk' | 'sl' | 'sm' | 'sn' | 'so' | 'sq' | 'sr' | 'ss' | 'st' | 'su' | 'sv' | 'sw' 
    // 泰米尔语 | 泰卢固语 | 塔吉克语 | 泰语 | 提格利尼亚语 | 土库曼语 | 塔加路语 | 茨瓦纳语 | 汤加语 | 土耳其语 | 聪加语 | 鞑靼语 | 特威语 | 塔希提语
    | 'ta' | 'te' | 'tg' | 'th' | 'ti' | 'tk' | 'tl' | 'tn' | 'to' | 'tr' | 'ts' | 'tt' | 'tw' | 'ty' 
    // 维吾尔语 | 乌克兰语 | 乌尔都语 | 乌兹别克语
    | 'ug' | 'uk' | 'ur' | 'uz' 
    // 文达语 | 越南语 | 沃拉普克语
    | 've' | 'vi' | 'vo' 
    // 瓦隆语 | 沃洛夫语
    | 'wa' | 'wo' 
    // 科萨语
    | 'xh' 
    // 意第绪语 | 约鲁巴语
    | 'yi' | 'yo' 
    // 壮语 | 中文 | 祖鲁语
    | 'za' | 'zh' | 'zu'
 
export type BCP47LanguageCodes = 
    // 简体中文 | 繁体中文(香港) | 繁体中文(澳门) | 简体中文(新加坡) | 繁体中文(台湾) | 简体中文(中国) | 繁体中文(中国)
    | "zh-CN" | "zh-HK" | "zh-MO" | "zh-SG" | "zh-TW" | "zh-CHS" | "zh-CHT"
    // 英语(美国) | 英语(英国) | 英语(加拿大) | 英语(澳大利亚) | 英语(印度) | 英语(南非) | 英语(新西兰)
    | "en-US" | "en-GB" | "en-CA" | "en-AU" | "en-IN" | "en-ZA" | "en-NZ" 
    // 英语(爱尔兰) | 英语(菲律宾) | 英语(津巴布韦) | 英语(伯利兹) | 英语(加勒比) | 英语(牙买加) | 英语(特立尼达和多巴哥)
    | "en-IE" | "en-PH" | "en-ZW" | "en-BZ" | "en-CB" | "en-JM" | "en-TT"
    // 印地语(印度)
    | "hi-IN"
    // 西班牙语(西班牙) | 西班牙语(墨西哥) | 西班牙语(阿根廷) | 西班牙语(哥伦比亚) | 西班牙语(秘鲁) | 西班牙语(委内瑞拉) | 西班牙语(智利)
    | "es-ES" | "es-MX" | "es-AR" | "es-CO" | "es-PE" | "es-VE" | "es-CL"
    // 西班牙语(厄瓜多尔) | 西班牙语(危地马拉) | 西班牙语(古巴) | 西班牙语(玻利维亚) | 西班牙语(多米尼加) | 西班牙语(洪都拉斯) | 西班牙语(巴拉圭)
    | "es-EC" | "es-GT" | "es-CU" | "es-BO" | "es-DO" | "es-HN" | "es-PY"
    // 西班牙语(萨尔瓦多) | 西班牙语(尼加拉瓜) | 西班牙语(波多黎各) | 西班牙语(乌拉圭) | 西班牙语(巴拿马) | 西班牙语(哥斯达黎加)
    | "es-SV" | "es-NI" | "es-PR" | "es-UY" | "es-PA" | "es-CR"
    // 阿拉伯语(埃及) | 阿拉伯语(沙特) | 阿拉伯语(阿尔及利亚) | 阿拉伯语(摩洛哥) | 阿拉伯语(伊拉克) | 阿拉伯语(苏丹) | 阿拉伯语(也门)
    | "ar-EG" | "ar-SA" | "ar-DZ" | "ar-MA" | "ar-IQ" | "ar-SD" | "ar-YE"
    // 阿拉伯语(叙利亚) | 阿拉伯语(突尼斯) | 阿拉伯语(利比亚) | 阿拉伯语(约旦) | 阿拉伯语(黎巴嫩) | 阿拉伯语(科威特) | 阿拉伯语(阿联酋)
    | "ar-SY" | "ar-TN" | "ar-LY" | "ar-JO" | "ar-LB" | "ar-KW" | "ar-AE"
    // 阿拉伯语(巴林) | 阿拉伯语(卡塔尔) | 阿拉伯语(阿曼)
    | "ar-BH" | "ar-QA" | "ar-OM"
    // 葡萄牙语(巴西) | 葡萄牙语(葡萄牙)
    | "pt-BR" | "pt-PT"
    // 俄语(俄罗斯)
    | "ru-RU"
    // 日语(日本)
    | "ja-JP"
    // 德语(德国) | 德语(奥地利) | 德语(瑞士)
    | "de-DE" | "de-AT" | "de-CH"
    // 法语(法国) | 法语(加拿大) | 法语(比利时) | 法语(瑞士) | 法语(卢森堡) | 法语(摩纳哥)
    | "fr-FR" | "fr-CA" | "fr-BE" | "fr-CH" | "fr-LU" | "fr-MC"
    // 韩语(韩国)
    | "ko-KR"
    // 意大利语(意大利) | 意大利语(瑞士)
    | "it-IT" | "it-CH"
    // 荷兰语(荷兰) | 荷兰语(比利时)
    | "nl-NL" | "nl-BE"
    // 波兰语(波兰)
    | "pl-PL"
    // 越南语(越南)
    | "vi-VN"
    // 土耳其语(土耳其)
    | "tr-TR"
    // 泰语(泰国)
    | "th-TH"
    // 希腊语(希腊)
    | "el-GR"
    // 捷克语(捷克)
    | "cs-CZ"
    // 瑞典语(瑞典) | 瑞典语(芬兰)
    | "sv-SE" | "sv-FI"
    // 匈牙利语(匈牙利)
    | "hu-HU"
    // 芬兰语(芬兰)
    | "fi-FI"
    // 丹麦语(丹麦)
    | "da-DK"
    // 挪威博克马尔语(挪威) | 挪威尼诺斯克语(挪威)
    | "nb-NO" | "nn-NO"
    // 希伯来语(以色列)
    | "he-IL"
    // 印度尼西亚语(印度尼西亚)
    | "id-ID"
    // 马来语(马来西亚) | 马来语(文莱)
    | "ms-MY" | "ms-BN"
    // 罗马尼亚语(罗马尼亚)
    | "ro-RO"
    // 保加利亚语(保加利亚)
    | "bg-BG"
    // 乌克兰语(乌克兰)
    | "uk-UA"
    // 斯洛伐克语(斯洛伐克)
    | "sk-SK"
    // 斯洛文尼亚语(斯洛文尼亚)
    | "sl-SI"
    // 克罗地亚语(克罗地亚)
    | "hr-HR"
    // 加泰罗尼亚语(西班牙)
    | "ca-ES"
    // 立陶宛语(立陶宛)
    | "lt-LT"
    // 拉脱维亚语(拉脱维亚)
    | "lv-LV"
    // 爱沙尼亚语(爱沙尼亚)
    | "et-EE"
    // 阿尔巴尼亚语(阿尔巴尼亚)
    | "sq-AL"
    // 马其顿语(马其顿)
    | "mk-MK"
    // 白俄罗斯语(白俄罗斯)
    | "be-BY"
    // 冰岛语(冰岛)
    | "is-IS"
    // 加利西亚语(西班牙)
    | "gl-ES"
    // 巴斯克语(西班牙)
    | "eu-ES"
    // 南非荷兰语(南非)
    | "af-ZA"
    // 斯瓦希里语(肯尼亚)
    | "sw-KE"
    // 泰米尔语(印度) | 泰卢固语(印度) | 卡纳达语(印度) | 马拉地语(印度) | 古吉拉特语(印度) | 旁遮普语(印度) | 孔卡尼语(印度) | 梵语(印度)
    | "ta-IN" | "te-IN" | "kn-IN" | "mr-IN" | "gu-IN" | "pa-IN" | "kok-IN" | "sa-IN"
    // 乌尔都语(巴基斯坦)
    | "ur-PK"
    // 波斯语(伊朗)
    | "fa-IR"
    // 叙利亚语(叙利亚)
    | "syr-SY"
    // 迪维希语(马尔代夫)
    | "div-MV"
    // 格鲁吉亚语(格鲁吉亚)
    | "ka-GE"
    // 亚美尼亚语(亚美尼亚)
    | "hy-AM"
    // 阿塞拜疆语(西里尔文,阿塞拜疆) | 阿塞拜疆语(拉丁文,阿塞拜疆)
    | "Cy-az-AZ" | "Lt-az-AZ"
    // 哈萨克语(哈萨克斯坦) | 吉尔吉斯语(哈萨克斯坦)
    | "kk-KZ" | "ky-KZ"
    // 蒙古语(蒙古)
    | "mn-MN"
    // 鞑靼语(俄罗斯)
    | "tt-RU"
    // 塞尔维亚语(西里尔文,塞尔维亚) | 塞尔维亚语(拉丁文,塞尔维亚)
    | "Cy-sr-SP" | "Lt-sr-SP"
    // 乌兹别克语(西里尔文,乌兹别克斯坦) | 乌兹别克语(拉丁文,乌兹别克斯坦)
    | "Cy-uz-UZ" | "Lt-uz-UZ"
    // 法罗语(法罗群岛)
    | "fo-FO";