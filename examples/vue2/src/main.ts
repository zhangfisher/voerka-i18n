import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  {i18nPlugin } from '@voerkai18n/vue2'
Vue.config.productionTip = false

Vue.use(i18nPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
