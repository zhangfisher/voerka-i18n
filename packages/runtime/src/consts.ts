import { LocalStorage } from "./storage"
export const DefaultFallbackLanguage = 'en'    


export const DefaultLanguageSettings =  [
    {name: "zh",title: "中文",default:true,active:true},
    {name: "en",title: "英文"}
] 

export const DataTypes =  ["String","Number","Boolean","Object","Array","Function","Error","Symbol","RegExp","Date","Null","Undefined","Set","Map","WeakSet","WeakMap"]

export const VOERKAI18N_FORMATTER = Symbol("VoerkaI18nFormatter")


export const VOERKAI18N_FORMATTER_BUILDER = Symbol("VoerkaI18nFormatterBuilder")
// 默认语言配置
export const defaultLanguageSettings = {  
    debug          : true,
    storage        : LocalStorage,
    languages      : [
        { name: "zh", title: "中文", default: true, active: true },
        { name: "en", title: "英文" }
    ]
}  


export const TEleClassName   = "vt-msg"
export const TEleMsgIdAttr   = "data-id"
export const TEleScopeIdAttr = "data-scope"