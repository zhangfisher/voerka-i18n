import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {i18nScope} from './languages'
import i18nPlugin from 'packages/vue3/src'
i18nScope.ready(null).then(res=>{
  createApp(App).use(i18nPlugin,{i18nScope}).mount('#app')
})
