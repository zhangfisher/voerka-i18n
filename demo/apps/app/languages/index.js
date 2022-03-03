
const messageIds = require("./idMap")
const { translate,i18n  } =  require("voerka-i18n")
const defaultMessages =  require("./cn.js")  
const i18nSettings =  require("./settings.js")
const formatters = require("../formatters") 
 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new i18n(i18nSettings)
}

let scope = {
    defaultLanguage: "cn",     // 默认语言名称
    default:   defaultMessages,                 // 默认语言包
    messages : defaultMessages,                 // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters,                                 // 当前作用域的格式化函数列表
    loaders:{},                                 // 异步加载语言文件的函数列表
    global:{}                                   // 引用全局VoerkaI18n配置
}

let supportedlanguages = {}  

messages["cn"]= defaultMessages

scope.loaders["en"] = ()=>import("./en.js")

scope.loaders["de"] = ()=>import("./de.js")

scope.loaders["jp"] = ()=>import("./jp.js")


const t = ()=> translate.bind(scope)(...arguments)

// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)


module.exports.scope = scope
module.exports.t = t

