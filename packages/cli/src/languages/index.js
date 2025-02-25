const { VoerkaI18nScope } = require("@voerkai18n/runtime")
const storage = require("./storage")
const formatters = require("./formatters")
const idMap = require("./idMap.json")
const settings = require("./settings.json")
const defaultMessages = require("./zh-CN")

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>require("./en-US.js"),
    'es-ES'    : ()=>require("./es-ES.js"),
    'ar-EG'    : ()=>require("./ar-EG.js"),
    'pt-PT'    : ()=>require("./pt-PT.js"),
    'ru-RU'    : ()=>require("./ru-RU.js"),
    'ja-JP'    : ()=>require("./ja-JP.js"),
    'de-DE'    : ()=>require("./de-DE.js"),
    'fr-FR'    : ()=>require("./fr-FR.js"),
    'ko-KR'    : ()=>require("./ko-KR.js"),
    'it-IT'    : ()=>require("./it-IT.js"),
    'nl-NL'    : ()=>require("./nl-NL.js"),
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