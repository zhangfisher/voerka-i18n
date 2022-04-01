import { createApp } from 'vue'
import App from './App.vue'
import i18nPlugin from '@voerkai18n/vue'
import { t,i18nScope } from './languages'
const app = createApp(App)
app.use(i18nPlugin,{ t,i18nScope })
app.mount('#app') 

