/**
    
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { t, i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ t,i18nScope })
    app.mount('#app')


 */


export default {
    install: (app, opts={}) => {
        let options = Object.assign({
            t:message=>message,
        }, opts)
        
        // 全局翻译函数
        app.config.globalProperties.t = function(){
            return options.t(...arguments)
        }

    }
  }