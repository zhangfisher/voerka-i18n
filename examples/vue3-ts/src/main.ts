import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { t, i18nScope } from './languages'
import {i18nPlugin,type VoerkaI18nPluginOptions} from '@voerkai18n/vue'  

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})

console.log("main.ts",t('hello'))

i18nScope.ready(()=>{
    const app = createApp(App)
    app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
        i18nScope
    })
    app.mount('#app') 
})

