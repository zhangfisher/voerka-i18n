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
import type { VoerkaI18nSupportedLanguages } from "@Voerkai18n/runtime"
 
export const VoerkaI18nProvider = Symbol('VoerkaI18nVueProvider')
export interface VoerkaI18nPluginOptions{
    i18nScope:VoerkaI18nScope
}
 
export interface VoerkaI18nProviderType{
    activeLanguage:string
    defaultLanguage:string  // 默认语言
    languages:VoerkaI18nSupportedLanguages 
}

export function injectVoerkaI18n(){
    return inject<VoerkaI18nProviderType>(VoerkaI18nProvider,{activeLanguage:"",defaultLanguage:"",languages:{}})
}


export default {
    install: (app:App<any>, options:VoerkaI18nPluginOptions)=> {      
        const i18nScope = options.i18nScope 
        if(i18nScope===null){
            console.warn("@voerkai18n/vue: i18nScope is not provided, use default i18nScope") 
        }
 
        let activeLanguage = ref(i18nScope.global.activeLanguage)        
        app.mixin({
            computed:{
                $activeLanguage:{
                    get: ():string =>activeLanguage.value,
                    set: (value:string) =>{
                        i18nScope.change(value).then((newLanguage:string)=>activeLanguage.value=newLanguage)
                    }
                }        
            }
        }) 
        // 注入一个全局可用的t方法，在组件模块中可以直接使用
        app.config.globalProperties.t = function(message:string,...args:any[]){
            // 通过访问计算属性activeLanguage来实现当activeLanguage变更时的重新渲染,有没有更好的办法？
            this.$activeLanguage
            return i18nScope.t(message,...args)
        } 

        app.provide(VoerkaI18nProvider, reactive({
            activeLanguage: computed({
                get: () => activeLanguage,
                set: (value) => i18nScope.global.change(value as unknown as string).then(()=>{
                    activeLanguage.value = value as any
                })
            }),
            languages:i18nScope.global.languages,
            defaultLanguage:i18nScope.global.defaultLanguage,
        }))  
     }
  } 

  export * from "./types"