
const messageIds = require("./idMap")
const { translate,I18nManager  } =  require("@voerkai18n/runtime")
const defaultMessages =  require("./cn.js")  
const scopeSettings =  require("./settings.js") 
 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new I18nManager(scopeSettings)
}

let scope = {
    defaultLanguage: "cn",     // 默认语言名称
    default:   defaultMessages,                 // 默认语言包
    messages : defaultMessages,                 // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters:{},                              // 当前作用域的格式化函数列表
    loaders:{},                                 // 异步加载语言文件的函数列表
    global:{},                                   // 引用全局VoerkaI18n配置，注册后自动引用
    // 主要用来缓存格式化器的引用，当使用格式化器时可以直接引用，避免检索
    $cache:{
        activeLanguage:null,
        typedFormatters:{},
        formatters:{},
    }
}

let supportedlanguages = {}  


scope.loaders["en"] = ()=>import("./en.js")


const t = translate.bind(scope) 
const languages =  [
    {
        "name": "cn",
        "title": "中文"
    },
    {
        "name": "en",
        "title": "英文"
    }
]
// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)


module.exports.languages = languages
module.exports.scope = scope
module.exports.t = t
module.exports.changeLanguage = VoerkaI18n.change.bind(VoerkaI18n)
module.exports.addLanguageListener = VoerkaI18n.on.bind(VoerkaI18n)
module.exports.removeLanguageListener = VoerkaI18n.off.bind(VoerkaI18n) 
module.exports.i18nManager = VoerkaI18n

