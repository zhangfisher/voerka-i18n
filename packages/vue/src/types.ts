import type { VoerkaI18nScope, VoerkaI18nTranslate } from "@voerkai18n/runtime"

export declare interface VoerkaI18nVuePluginOptions{
    i18nScope:VoerkaI18nScope
}
  
declare module 'vue' { 
    interface ComponentCustomProperties  {
        $activeLanguage:string
        t: VoerkaI18nTranslate 
    } 
  }
   