const { VoerkaI18nScope } = require("@voerkai18n/runtime")
const storage = require("./storage")
const formatters = require("@voerkai18n/formatters")
const idMap = require("./idMap.json")
const settings = require("./settings.json")
const defaultMessages = require("./zh-CN")

 

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>require("./en-US.js"),
}


const i18nScope = new VoerkaI18nScope({    
    id: "voerkai18n-example-nodejs",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    ...settings
}) 


const t = i18nScope.t


module.exports = {
    i18nScope,
    t
}