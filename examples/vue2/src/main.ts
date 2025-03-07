import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  { i18nPlugin } from '@voerkai18n/vue2'
import { i18nScope } from "./languages"

Vue.config.productionTip = false

Vue.use(i18nPlugin,{
  i18nScope
})

i18nScope.ready(()=>{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
