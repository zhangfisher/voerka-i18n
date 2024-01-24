import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { t ,i18nScope} from "./languages"
import { i18nPlugin } from "../../../packages/vue2/dist"

Vue.config.productionTip = false

console.log(t("hello"))
Vue.use(i18nPlugin,{i18nScope})
i18nScope.on('ready',()=>{
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')  
})
