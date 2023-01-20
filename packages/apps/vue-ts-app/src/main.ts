import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18nPlugin from '@voerkai18n/vue'
import { i18nScope } from './languages'



const app = createApp(App)
app.use(i18nPlugin,{i18nScope})
app.mount('#app')
