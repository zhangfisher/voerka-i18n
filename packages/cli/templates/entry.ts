import messageIds from "./idMap"                                             // 语言ID映射文件
import runtime from "@voerkai18n/runtime"
const { translate,VoerkaI18nScope  } = runtime
import defaultFormatters from "./formatters/{{defaultLanguage}}"             // 默认语言格式化器
{{if defaultLanguage === activeLanguage}}const activeFormatters = defaultFormatters{{else}}import activeFormatters from "@voerkai18n/runtime/formatters/{{activeLanguage}}"{{/if}}
import defaultMessages from "./{{defaultLanguage}}"  
{{if defaultLanguage === activeLanguage}}const activeMessages = defaultMessages{{else}}import activeMessages  from "./{{activeLanguage}}"{{/if}}
 
// 语言配置文件
const scopeSettings = {{@ settings}}
const formatters = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultFormatters{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':activeFormatters{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>import("./formatters/{{$value.name}}"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}
// 语言包加载器
const loaders = { {{each languages}}{{if $value.name !== defaultLanguage}}
    {{if $value.name == activeLanguage}}"{{$value.name}}" : activeMessages{{else}}"{{$value.name}}" : ()=>import("./{{$value.name}}"){{/if}}{{if $index !== languages.length - 1}},{{/if}}{{/if}}{{/each}} 
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
export { 
    scopedTtranslate as t, 
    scope as i18nScope
}