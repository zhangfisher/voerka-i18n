import messageIds from "./messageIds"
import { translate,i18n  } from "voerka-i18n"
import defaultMessages from "./{{defaultLanguage}}.js"  
import i18nSettings from "./settings.js"
import formatters from "voerka-i18n/formatters" 

// 自动创建全局VoerkaI18n实例
if(!globalThis.VoerkaI18n){
    globalThis.VoerkaI18n = new i18n(i18nSettings)
}

let scopeContext = {
    messages : defaultMessages,                 // 当前语言的消息
    ids:messageIds,
    formatters:{
        ...formatters,
        ...i18nSettings.formatters || {}
    },
    languageLoaders:{}
}

let supportedlanguages = {}  

messages["{{defaultLanguage}}"]= defaultMessages
{{each languages}}{{if $value.name !== defaultLanguage}}
scopeContext.languageLoaders["{{$value.name}}"] = ()=>import("./{{$value.name}}.js")
{{/if}}{{/each}}

const t = ()=> translate.bind(scopeContext)(...arguments)


// 侦听语言切换事件
VoerkaI18n.on(async function(lang)=>{

    if(lang === defaultLanguage){
        scopeContext.messages = defaultMessages
        return 
    }
    const loader = scopeContext.languageLoaders[lang]

    if(typeof(loader) === "function"){
        try{
            scopeContext.messages = await loader()
        }catch(e){
            console.warn(`Error loading  language ${lang} : ${e.message}`)
            scopeContext.messages = defaultMessages
        }       
    }else if(typeof(loader) === "object"){
        scopeContext.messages = loader
    }else{
        scopeContext.messages = defaultMessages
    }

})

export t