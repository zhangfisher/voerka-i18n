import type { VoerkaI18nTranslate } from "@voerkai18n/runtime"
declare module 'vue' {
    interface ComponentCustomProperties { 
        t: VoerkaI18nTranslate
    }
}

export {}