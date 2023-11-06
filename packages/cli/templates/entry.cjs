/**
 * 注意：执行compile命令会重新生成本文件，所以请不要修改本文件
 */
const idMap = require("./idMap")
const { translate,VoerkaI18nScope  } =  require("@voerkai18n/runtime")
const defaultFormatters = require("./formatters/{{defaultLanguage}}.js")
const activeFormatters= {{if activeLanguage == defaultLanguage}}defaultFormatters{{else}}require("./formatters/{{activeLanguage}}.js"){{/if}}
const defaultMessages =  require("./{{defaultLanguage}}.js")      
const activeMessages = {{if activeLanguage == defaultLanguage}}defaultMessages{{else}}require("./{{activeLanguage}}.js"){{/if}}
const storage = require("./storage.js")

const formatters = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultFormatters{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':defaultFormatters{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>require("./formatters/{{$value.name}}.js"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}
 
const messages = {
    {{each languages}}{{if $value.name == defaultLanguage}}'{{defaultLanguage}}' :  defaultMessages{{if $index !== languages.length - 1}},{{/if}}
    {{else if $value.name == activeLanguage}}{{if defaultLanguage !== activeLanguage}}'{{activeLanguage}}':defaultMessages{{/if}}{{if $index !== languages.length - 1}},{{/if}}
    {{else}}'{{$value.name}}' : ()=>require("./{{$value.name}}.js"){{if $index !== languages.length - 1}},{{'\n\t'}}{{/if}}{{/if}}{{/each}}
}
 

// 语言配置文件
const scopeSettings = {{@ settings}}
// 语言作用域
const scope = new VoerkaI18nScope({    
    // 当前作用域的id，自动取当前工程的package.json的name
    id          : "{{scopeId}}",                    
    debug       : false,                            // 是否在控制台输出高度信息
    messages,                                       // 当前语言包
    idMap ,                                         // 消息id映射列表    
    library     : {{library}},                      // 开发库时设为true
    formatters,                                     // 扩展自定义格式化器    
    storage,                                        // 语言配置存储器
    ...scopeSettings                             
}) 
// 翻译函数
const scopedTtranslate = translate.bind(scope) 
module.exports.t = scopedTtranslate
module.exports.i18nScope = scope 