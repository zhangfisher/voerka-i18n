/**
    
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { t,i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })
    app.mount('#app')


 */

import { cat } from "shelljs"
import { computed,reactive,ref } from "vue"

function forceUpdate(app){
    function updateComponent(inst){
        if(inst && inst.update) inst.update()
        if(inst.subTree && inst.subTree.children){
            inst.subTree.children.forEach( vnode=>{
                if(vnode && vnode.component) updateComponent(vnode.component)
            })           
        }
    }
    try{
        renderComponent(app._instance.root)
    }catch(e){
        console.warn("forceUpdate error: ",e.message)
    }    
}

export default {
    install: (app, opts={}) => {
        let options = Object.assign({
            i18nScope:null,                 // 当前作用域实例
            forceUpdate:true,               // 当语言切换时是否强制重新渲染
        }, opts)               

        let i18nScope = options.i18nScope
        if(i18nScope===null){
            console.warn("@voerkai18n/vue: i18nScope is not provided, use default i18nScope")
            i18nScope = {change:()=>{}}
        }

        // 插件只需要安装一次实例
        if(app.voerkai18n){
            return
        }
        
        let activeLanguage = ref(i18nScope.global.activeLanguage)        
        
        // 当语言包发生变化时，强制重新渲染组件树
        i18nScope.global.on((newLanguage)=>{
            app._instance.update()
            activeLanguage.value = newLanguage
        })      

        // 全局i18n对象
        app.voerkai18n = options.i18nScope.global
        app.provide('i18n', reactive({
            activeLanguage: computed({
                get: () => activeLanguage,
                set: (value) => i18nScope.global.change(value).then(()=>{
                    if(options.forceUpdate){
                        //app._instance.update()
                        forceUpdate(app)
                    }
                })
            }),
            languages:i18nScope.global.languages,
            defaultLanguage:i18nScope.global.defaultLanguage,
        })) 
     }
  }