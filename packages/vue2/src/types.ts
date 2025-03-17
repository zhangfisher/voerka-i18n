export {}

import type { VoerkaI18nTranslateOptions, VoerkaI18nTranslateProps, VoerkaI18nTranslateVars } from '@voerkai18n/runtime'
import type { Component } from 'vue';

declare module 'vue/types/vue' {    
    interface Vue {
        t(message: string,vars?:VoerkaI18nTranslateVars,options?:VoerkaI18nTranslateOptions):string            
        $activeLanguage: { value:string }
        Translate: Component<any,any,any,VoerkaI18nTranslateProps> 
    } 
} 