import { createApp } from 'vue'
import App from './App.vue'
import i18nPlugin from '@voerkai18n/vue'
import { i18nScope} from './languages'

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})

console.log(t("VoerkaI18n应用启动"))
 
const app = createApp(App)
app.use(i18nPlugin,{ i18nScope })
app.mount('#app') 

