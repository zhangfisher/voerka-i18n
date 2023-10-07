import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {i18nScope} from '../src/languages'
import i18nPlugin from '@voerkai18n/vue'
i18nScope.ready(null).then(res=>{
  createApp(App).use(i18nPlugin,{i18nScope}).mount('#app')
})
