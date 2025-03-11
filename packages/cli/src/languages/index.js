const { VoerkaI18nScope } = require("@voerkai18n/runtime")
const storage = require("./storage")
const formatters = require("@voerkai18n/formatters")
import paragraphs from "./paragraphs"
const idMap = require("./messages/idMap.json")
const { component } = require("./component")
const settings = require("./settings.json")
const defaultMessages = require("./messages/zh-CN")

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>require("./messages/en-US.js"),
    'es-ES'    : ()=>require("./messages/es-ES.js"),
    'ar-EG'    : ()=>require("./messages/ar-EG.js"),
    'pt-PT'    : ()=>require("./messages/pt-PT.js"),
    'ru-RU'    : ()=>require("./messages/ru-RU.js"),
    'ja-JP'    : ()=>require("./messages/ja-JP.js"),
    'de-DE'    : ()=>require("./messages/de-DE.js"),
    'fr-FR'    : ()=>require("./messages/fr-FR.js"),
    'ko-KR'    : ()=>require("./messages/ko-KR.js"),
    'it-IT'    : ()=>require("./messages/it-IT.js"),
    'nl-NL'    : ()=>require("./messages/nl-NL.js"),
}


const i18nScope = new VoerkaI18nScope({    
    id: "@voerkai18n/cli__3_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    ...settings
}) 


const t = i18nScope.t
const Translate = i18nScope.Translate

module.exports = {
    i18nScope,
    t
}