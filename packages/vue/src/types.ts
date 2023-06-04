import type { VoerkaI18nScope, VoerkaI18nTranslate } from "@Voerkai18n/runtime"

export declare interface VoerkaI18nVuePluginOptions{
    i18nScope:VoerkaI18nScope
}
 

// export declare type VoerkaI18nProvider = InjectionKey<VoerkaI18nProviderType>
// export declare  function injectVoerkaI18n():VoerkaI18nProviderType

//@vue/runtime-core'

  
declare module 'vue' { 
    interface ComponentCustomProperties  {
        $activeLanguage:string
        t: VoerkaI18nTranslate 
    } 
  }
   