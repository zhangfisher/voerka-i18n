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
            i18nScope:null,
        }, opts)        
        
        let translate = options.t
        if(typeof(translate)!=="function"){
            console.warn("@voerkai18n/vue: t function is not provided, use default t function")
            translate = message=>message
        }

        // 全局翻译函数
        app.config.globalProperties.t = function(){
            return options.t(...arguments)
        }

    }
  }