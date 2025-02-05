const { VoerkaI18nScope } = require("@voerkai18n/runtime")
const storage = require("./storage")
const formatters = require("./formatters")
const idMap = require("./idMap")
const settings = require("./settings.json")
const defaultMessages = require("./zh-CN")

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./en-US"),
    'es-ES'    : ()=>import("./es-ES"),
    'ar-EG'    : ()=>import("./ar-EG"),
    'pt-PT'    : ()=>import("./pt-PT"),
    'ru-RU'    : ()=>import("./ru-RU"),
    'ja-JP'    : ()=>import("./ja-JP"),
    'de-DE'    : ()=>import("./de-DE"),
    'fr-FR'    : ()=>import("./fr-FR"),
    'ko-KR'    : ()=>import("./ko-KR"),
    'it-IT'    : ()=>import("./it-IT"),
    'nl-NL'    : ()=>import("./nl-NL"),
}


const i18nScope = new VoerkaI18nScope({    
    id: "@voerkai18n/cli_2_1_13",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 扩展自定义格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    ...settings
}) 


const t = i18nScope.t


module.exports = {
    i18nScope,
    t
}