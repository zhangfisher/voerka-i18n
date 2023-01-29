/**
 * 注意：执行compile命令会生新后成本文件，所以请不要修改本文件
 */
{{if moduleType === "esm"}}
import messageIds from "./idMap.js"                                             // 语言ID映射文件
import runtime from "@voerkai18n/runtime"
const { translate,VoerkaI18nScope  } = runtime
import defaultFormatters from "./formatters/{{defaultLanguage}}"
{{if defaultLanguage === activeLanguage}}const activeFormatters = defaultFormatters{{else}}import activeFormatters from "@voerkai18n/runtime/formatters/{{activeLanguage}}.js"{{/if}}
import defaultMessages from "./{{defaultLanguage}}.js"  
{{if defaultLanguage === activeLanguage}}const activeMessages = defaultMessages{{else}}import activeMessages  from "./{{activeLanguage}}.js"{{/if}}
{{else}}
const messageIds = require("./idMap")
const { translate,VoerkaI18nScope  } =  require("@voerkai18n/runtime")
const defaultFormatters = require("./formatters/{{defaultLanguage}}.js")
{{if defaultLanguage === activeLanguage}}const activeFormatters = defaultFormatters{{else}}const activeFormatters = require("@voerkai18n/runtime/formatters/{{activeLanguage}}.js"){{/if}}
const defaultMessages =  require("./{{defaultLanguage}}.js")        // 默认语言包
{{if defaultLanguage === activeLanguage}}const activeMessages = defaultMessages{{else}}const activeMessages = require("./{{activeLanguage}}.js"){{/if}} 
{{/if}} 
 
// 语言配置文件
const scopeSettings = {{@ settings}}
const formatters = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultFormatters{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':activeFormatters{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>import("./formatters/{{$value.name}}.js"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}
// 语言包加载器
const loaders = { {{each languages}}{{if $value.name !== defaultLanguage}}
    {{if $value.name == activeLanguage}}"{{$value.name}}" : activeMessages{{else}}"{{$value.name}}" : ()=>import("./{{$value.name}}.js"){{/if}}{{if $index !== languages.length - 1}},{{/if}}{{/if}}{{/each}} 
}

// 语言作用域
const scope = new VoerkaI18nScope({
    ...scopeSettings,                               // languages,defaultLanguage,activeLanguage,namespaces,formatters
    id          : "{{scopeId}}",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出高度信息
    default     : defaultMessages,                  // 默认语言包
    messages    : activeMessages,                   // 当前语言包
    idMap       : messageIds,                       // 消息id映射列表    
    formatters,                                     // 扩展自定义格式化器    
    loaders                                         // 语言包加载器
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
{{if moduleType === "esm"}}
export { 
    scopedTtranslate as t, 
    scope as i18nScope
}
{{else}}
module.exports.t = scopedTtranslate
module.exports.i18nScope = scope 
{{/if}}
