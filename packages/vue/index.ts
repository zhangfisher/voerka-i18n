/**
    
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { t,i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })
    app.mount('#app')


 */

import type { VoerkaI18nScope } from "@voerkai18n/runtime"
import { computed,reactive,ref,inject} from "vue"
import type { App } from "vue"

export const VoerkaI18nProvider = Symbol('VoerkaI18nProvider')
export interface VoerkaI18nVuePluginOptions{
    i18nScope:VoerkaI18nScope
}


const defaultInject ={
    activeLanguage:"",
    languages:[],
    defaultLanguage:""
}


export function injectVoerkaI18n(){
    return inject(VoerkaI18nProvider,defaultInject)
}


export function useVoerkaI18n(){
    let activeLanguage = ref(VoerkaI18n.activeLanguage)  
    VoerkaI18n.on("change",(newLanguage:string)=>{
        activeLanguage.value = newLanguage
    })
    return {
        t:VoerkaI18n.t
    }
}
 
export default {
    install: (app:App, options:VoerkaI18nVuePluginOptions) => {      
        const i18nScope = options.i18nScope 
        if(i18nScope===null){
            console.warn("@voerkai18n/vue: i18nScope is not provided, use default i18nScope") 
        }
 
        let activeLanguage = ref(i18nScope.global.activeLanguage)        

        app.mixin({
            computed:{
                $activeLanguage:{
                    get: () =>activeLanguage.value,
                    set: (value:string) =>{
                        i18nScope.change(value).then((newLanguage:string)=>activeLanguage.value=newLanguage)
                    }
                }        
            }
        })

        // 注入一个全局可用的t方法
        app.config.globalProperties.t = function(message:string,...args:any[]){
            // 通过访问计算属性activeLanguage来实现当activeLanguage变更时的重新渲染
            // 有没有更好的办法？
            this.$activeLanguage
            return i18nScope.t(message,...args)
        } 

        

        app.provide(VoerkaI18nProvider, reactive({
            activeLanguage: computed({
                get: () => activeLanguage,
                set: (value) => i18nScope.global.change(value).then(()=>{
                    activeLanguage.value = value 
                })
            }),
            languages:i18nScope.global.languages,
            defaultLanguage:i18nScope.global.defaultLanguage,
        })) 

     }
  }