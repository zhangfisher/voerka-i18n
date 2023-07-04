import { VoerkaI18nScope } from '@voerkai18n/runtime'; 

export interface VoerkaI18nVue2Options {
    i18nScope:VoerkaI18nScope
}
export default {
    install:function (Vue:any, options:VoerkaI18nVue2Options) { 
        const { i18nScope } = Object.assign({},options)
        if(!i18nScope){
            throw new Error('i18nScope is required')
        }
        const state = Vue.observable({ langauge : i18nScope.activeLanguage })

        Vue.prototype.t = (message:string,...args:any[])=>{
            state.langauge 
            return i18nScope.t(message,...args)
        }        
        i18nScope.on("change",(language:string)=>{
            state.langauge = language
        })
        Vue.prototype.activeLanguage = function () {
            i18nScope.change(this.$data.language)
        }

    }
} 