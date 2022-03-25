{{if moduleType === "esm"}}
import messageIds from "./idMap.js"
import { translate,I18nManager,i18nScope  } from "@voerkai18n/runtime"
import formatters from "./formatters.js"
import defaultMessages from "./{{defaultLanguage}}.js"  
{{if defaultLanguage === activeLanguage}}const activeMessages = defaultMessages
{{else}}import activeMessages  from "./{{activeLanguage}}.js"{{/if}} 
{{else}}
const messageIds = require("./idMap")
const { translate,I18nManager,i18nScope  } =  require("@voerkai18n/runtime")
const formatters = require("./formatters.js")
const defaultMessages =  require("./{{defaultLanguage}}.js")  
{{if defaultLanguage === activeLanguage}}const activeMessages = defaultMessages
{{else}}const activeMessages = require("./{{activeLanguage}}.js"){{/if}} 
{{/if}} 
// 语言配置文件
const scopeSettings = {{@ settings}}

// 语言作用域
const scope = new i18nScope({
    ...scopeSettings,                           // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id: "{{scopeId}}",                          // 当前作用域的id，自动取当前工程的package.json的name
    default:   defaultMessages,                 // 默认语言包
    messages : activeMessages,                  // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters,                                  // 当前作用域的格式化函数列表
    loaders:{ {{each languages}}{{if $value.name !== defaultLanguage}}
        {{if $value.name == activeLanguage}}"{{$value.name}}" : ()=>activeMessages{{else}}"{{$value.name}}" : ()=>import("./{{$value.name}}.js"){{/if}}{{if $index !== languages.length - 1}},{{/if}}{{/if}}{{/each}} 
    }
}) 
// 翻译函数
const t = translate.bind(scope) 
{{if moduleType === "esm"}}
export { 
    t, 
    i18nScope:scope,
    i18nManager:VoerkaI18n, 
}
{{else}}
module.exports.t = t
module.exports.i18nScope = scope
module.exports.i18nManager = VoerkaI18n
{{/if}}
