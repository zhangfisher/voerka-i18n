const { VoerkaI18nScope } = require("@voerkai18n/runtime")
const storage = require("./storage")
const formatters = require("@voerkai18n/formatters")
const paragraphs = require("./paragraphs")
const idMap = require("./messages/idMap.json")
const { component } = require("./component")
const settings = require("./settings.json")
const defaultMessages = require("./messages/zh-CN")

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>require("./messages/en-US.js"),
}


const i18nScope = new VoerkaI18nScope({    
    id: "@voerkai18n-examples/nodejs_",                                  // 当前作用域的id
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