import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { t } from "./languages"

Vue.config.productionTip = false

console.log(t("hello"))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
