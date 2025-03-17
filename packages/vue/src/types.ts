import type { VoerkaI18nTranslate, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { Component } from "vue"

declare module 'vue' {
    interface ComponentCustomProperties { 
        t: VoerkaI18nTranslate
    }
    interface GlobalComponents {
        Translate: Component<VoerkaI18nTranslateProps> 
    }
}

export {}