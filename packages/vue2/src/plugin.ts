import type { VoerkaI18nScope } from '@voerkai18n/runtime';  



export interface VoerkaI18nVue2Options {
    i18nScope:VoerkaI18nScope
}

export const i18nPlugin = {
    install:function (Vue:any, options:VoerkaI18nVue2Options) { 
        const { i18nScope } = Object.assign({},options)
        if(!i18nScope){
            throw new Error('Parameter<i18nScope> is required for VoerkaI18n Vue2 Plugin')
        }        
        const state = Vue.observable({ langauge : i18nScope.activeLanguage })
        Vue.prototype.t = (message:string,...args:any[])=>{
            state.langauge 
            return i18nScope.t(message,...args)
        }         
        i18nScope.on("change",(language:string)=>{
            state.langauge = language
        })
    }
} 
