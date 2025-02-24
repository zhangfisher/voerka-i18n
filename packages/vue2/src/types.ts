export {}

import type { VoerkaI18nLanguageDefine } from '@voerkai18n/runtime'
 
declare module 'vue/types/vue' {    
    interface Vue {
        t(message:string,...args:any[]):string 
        activeLanguage: string
        defaultLanguage: string
        languages: VoerkaI18nLanguageDefine[]
        changeLanguage(language: string): Promise<void>

    } 
}