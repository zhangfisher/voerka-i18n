/**
    
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { t,i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })
    app.mount('#app')


 */

import { computed,reactive,ref,inject} from "vue"


export const VoerkaI18nProvider = Symbol('VoerkaI18nProvider')


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
     
    
    VoerkaI18n.on((newLanguage)=>{
        activeLanguage.value = newLanguage
    })

    return {
        t:VoerkaI18n.t

    }
}
 
export default {
    install: (app, opts={}) => {
        let options = Object.assign({
            i18nScope:null,                 // 当前作用域实例
        }, opts)               
        
        let i18nScope = options.i18nScope
        if(i18nScope===null){
            console.warn("@voerkai18n/vue: i18nScope is not provided, use default i18nScope")
            i18nScope = {change:()=>{}}
        }

        // 插件只需要安装一次实例
        if(app.voerkai18n){
            return
        } 
        app.voerkai18n =  i18nScope.global

        let activeLanguage = ref(i18nScope.global.activeLanguage)        

        app.mixin({
            computed:{
                $activeLanguage:{
                    get: () =>activeLanguage.value,
                    set: (value) =>i18nScope.change(value).then((newLanguage)=>activeLanguage.value=newLanguage)
                }        
            }
        })

        // 注入一个全局可用的t方法
        app.config.globalProperties.t = function(...args){
            // 通过访问计算属性activeLanguage来实现当activeLanguage变更时的重新渲染
            // 有没有更好的办法？
            this.$activeLanguage
            return i18nScope.t(...args)
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