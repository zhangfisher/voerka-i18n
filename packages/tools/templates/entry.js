{{if moduleType === "esm"}}
import messageIds from "./idMap.js"
import { translate,I18nManager  } from "@voerkai18n/runtime"
import defaultMessages from "./{{defaultLanguage}}.js"  
import scopeSettings from "./settings.js"
{{else}}
const messageIds = require("./idMap")
const { translate,i18n  } =  require("@voerkai18n/runtime")
const defaultMessages =  require("./{{defaultLanguage}}.js")  
const scopeSettings =  require("./settings.js") 
{{/if}} 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new I18nManager(scopeSettings)
}

let scope = {
    defaultLanguage: "{{defaultLanguage}}",     // 默认语言名称
    default:   defaultMessages,                 // 默认语言包
    messages : defaultMessages,                 // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters:{},                              // 当前作用域的格式化函数列表
    loaders:{},                                 // 异步加载语言文件的函数列表
    global:{}                                   // 引用全局VoerkaI18n配置，注册后自动引用
}

let supportedlanguages = {}  

messages["{{defaultLanguage}}"]= defaultMessages
{{each languages}}{{if $value.name !== defaultLanguage}}
scope.loaders["{{$value.name}}"] = ()=>import("./{{$value.name}}.js")
{{/if}}{{/each}}

const t = ()=> translate.bind(scope)(...arguments)
const languages =  {{@ JSON.stringify(languages,null,4) }}
// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)

{{if moduleType === "esm"}}
export languages 
export scope
export t
{{else}}
module.exports.languages = languages
module.exports.scope = scope
module.exports.t = t
{{/if}}
