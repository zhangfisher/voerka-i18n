import type { VoerkaI18nTranslate, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { Component, Ref } from "vue"

declare module 'vue' {
    interface ComponentCustomProperties { 
        t: VoerkaI18nTranslate
        $activeLanguage: Ref<string>

    }
    interface GlobalComponents {
        Translate: Component<VoerkaI18nTranslateProps> 
    }
}

export {}