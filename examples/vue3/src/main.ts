import { createApp,h } from 'vue'
import './style.css'
import App from './App.vue'
import { i18nScope } from "./languages"
import { router } from "./router"

i18nScope.ready(()=>{
    createApp(App)
        .use(router)
        .mount('#app')
})
