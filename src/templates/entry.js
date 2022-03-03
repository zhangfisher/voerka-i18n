{{if moduleTye === "esm"}}
import messageIds from "./idMap.js"
import { translate,i18n  } from "voerka-i18n"
import defaultMessages from "./{{defaultLanguage}}.js"  
import scopeSettings from "./settings.js"
import formatters from "../formatters" 
{{else}}
const messageIds = require("./idMap")
const { translate,i18n  } =  require("voerka-i18n")
const defaultMessages =  require("./{{defaultLanguage}}.js")  
const scopeSettings =  require("./settings.js")
const formatters = require("../formatters") 
{{/if}} 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new i18n(scopeSettings)
}

let scope = {
    defaultLanguage: "{{defaultLanguage}}",     // 默认语言名称
    default:   defaultMessages,                 // 默认语言包
    messages : defaultMessages,                 // 当前语言包
    idMap:messageIds,                           // 消息id映射列表
    formatters,                                 // 当前作用域的格式化函数列表
    loaders:{},                                 // 异步加载语言文件的函数列表
    global:{}                                   // 引用全局VoerkaI18n配置，注册后自动引用
}

let supportedlanguages = {}  

messages["{{defaultLanguage}}"]= defaultMessages
{{each languages}}{{if $value.name !== defaultLanguage}}
scope.loaders["{{$value.name}}"] = ()=>import("./{{$value.name}}.js")
{{/if}}{{/each}}

const t = ()=> translate.bind(scope)(...arguments)

// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)

{{if moduleTye === "esm"}}
export scope
export t
{{else}}
module.exports.scope = scope
module.exports.t = t
{{/if}}
