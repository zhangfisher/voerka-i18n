import messageIds from "./messageIds"
import { translate,i18n  } from "voerka-i18n"
import defaultMessages from "./cn.js"  
import i18nSettings from "./settings.js"
import formatters from "voerka-i18n/formatters" 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new i18n(i18nSettings)
}

let scope = {
    defaultLanguage: "cn",     // 默认语言名称
    default:   defaultMessages,                 // 默认语言包
    messages : defaultMessages,                 // 当前语言包
    ids:messageIds,                             // 消息id映射列表
    formatters:{
        ...formatters,
        ...i18nSettings.formatters || {}
    },
    loaders:{},      // 异步加载语言文件的函数列表
    settings:{}      // 引用全局VoerkaI18n实例的配置
}

let supportedlanguages = {}  

messages["cn"]= defaultMessages

scope.loaders["en"] = ()=>import("./en.js")

scope.loaders["de"] = ()=>import("./de.js")

scope.loaders["jp"] = ()=>import("./jp.js")


const t = ()=> translate.bind(scope)(...arguments)

// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)

export scope
export t