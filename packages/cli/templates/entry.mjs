/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
import idMap from "./idMap"                                             // 语言ID映射文件
import { translate,VoerkaI18nScope  } from "@voerkai18n/runtime"
import defaultFormatters from "./formatters/{{defaultLanguage}}"             // 默认语言格式化器
import defaultMessages from "./{{defaultLanguage}}"  

const messages = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultMessages{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':activeFormatters{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>import("./{{$value.name}}"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}

const formatters = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultFormatters{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':activeFormatters{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>import("./formatters/{{$value.name}}"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}

// 语言配置文件
const scopeSettings = {{@ settings}}

// 语言作用域
const scope = new VoerkaI18nScope({    
    id          : "{{scopeId}}",                    // 当前作用域的id，自动取当前工程的package.json的name
    debug       : false,                            // 是否在控制台输出调试信息   
    idMap,                                          // 消息id映射列表    
    messages,                                       // 语言包
    formatters,                                     // 扩展自定义格式化器    
    ...scopeSettings
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
export { 
    scopedTtranslate as t, 
    scope as VoerkaI18nScope
}