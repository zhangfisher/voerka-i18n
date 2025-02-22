export {}

import type { VoerkaI18nLanguageDefine } from '@voerkai18n/runtime'
import Vue from 'vue'

declare module 'vue/types/vue' {    
    interface Vue {
        t(message:string,...args:any[]):string 
        activeLanguage: string
        defaultLanguage: string
        languages: VoerkaI18nLanguageDefine[]
        changeLanguage(language: string): Promise<void>

    } 
}

function withI18n(options?:Parameters<typeof Vue.extend>[0]){
    options && options.mixins = options.mixins || []
    return Vue.extend(options)
}


Vue.extend()

export type WithI18nMixin = Vue & {
    activeLanguage: string
    defaultLanguage: string
    languages: string[]
    changeLanguage(language: string): Promise<void>
}