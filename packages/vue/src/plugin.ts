import { VoerkaI18nManager, VoerkaI18nScope } from "@voerkai18n/runtime"
import {App, Plugin, ref } from "vue"

export type VoerkaI18nVuePluginOptions = {
    scope?: VoerkaI18nScope
}

export const i18nPlugin: Plugin<VoerkaI18nVuePluginOptions> =   {
    install: (app:App, options?:VoerkaI18nVuePluginOptions) => { 
        const { scope } = Object.assign({
            scope: undefined
        },options)
        const manager:VoerkaI18nManager = globalThis.VoerkaI18n;
        const curScope = scope || manager.scope
        if (!manager || !curScope) {
            throw new Error('VoerkaI18n is not installed');
        }
        
        let activeLanguage = ref(curScope.activeLanguage)                

        curScope.on("change", ()=>{
            activeLanguage.value = curScope.activeLanguage;
        })

        // 注入一个全局可用的t方法，在组件模块中可以直接使用
        app.config.globalProperties.t = function(message:string,...args:any[]){
            // 由于t函数依赖于activeLanguage.value,所以当activeLanguage.value变化时会触发重新渲染
            activeLanguage.value
            return curScope.t(message,...args)
        } 

        app.component('Translate',curScope.Translate)
    }
}

