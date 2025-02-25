import { createApp,h } from 'vue'
import './style.css'
import App from './App.vue'
import { i18nScope } from "./languages"
import { router } from "./router"
import { i18nPlugin } from '@voerkai18n/vue'
import "@voerkai18n/patch"

i18nScope.ready(()=>{
    createApp(App)
        .use(i18nPlugin,{})
        .use(router)
        .mount('#app')
})
