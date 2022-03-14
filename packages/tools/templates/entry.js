{{if moduleType === "esm"}}
import messageIds from "./idMap.js"
import { translate,I18nManager  } from "@voerkai18n/runtime"
import defaultMessages from "./{{defaultLanguage}}.js"  
import scopeSettings from "./settings.js"
{{else}}
const messageIds = require("./idMap")
const { translate,I18nManager  } =  require("@voerkai18n/runtime")
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
    global:{},                                   // 引用全局VoerkaI18n配置，注册后自动引用
    // 主要用来缓存格式化器的引用，当使用格式化器时可以直接引用，避免检索
    $cache:{
        activeLanguage:null,
        typedFormatters:{},
        formatters:{},
    }
}

let supportedlanguages = {}  

{{each languages}}{{if $value.name !== defaultLanguage}}
scope.loaders["{{$value.name}}"] = ()=>import("./{{$value.name}}.js")
{{/if}}{{/each}}

const t = translate.bind(scope) 
const languages =  {{@ JSON.stringify(languages,null,4) }}
// 注册当前作用域到全局VoerkaI18n实例
VoerkaI18n.register(scope)

{{if moduleType === "esm"}}
export { t, languages,scope,i18nManager:VoerkaI18n, changeLanguage:VoerkaI18n.change.bind(VoerkaI18n),addLanguageListener:VoerkaI18n.on.bind(VoerkaI18n),removeLanguageListener:VoerkaI18n.off.bind(VoerkaI18n) }
{{else}}
module.exports.languages = languages
module.exports.scope = scope
module.exports.t = t
module.exports.changeLanguage = VoerkaI18n.change.bind(VoerkaI18n)
module.exports.addLanguageListener = VoerkaI18n.on.bind(VoerkaI18n)
module.exports.removeLanguageListener = VoerkaI18n.off.bind(VoerkaI18n) 
module.exports.i18nManager = VoerkaI18n
{{/if}}
