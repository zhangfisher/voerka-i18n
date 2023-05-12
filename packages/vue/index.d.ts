import type { VoerkaI18nSupportedLanguages,VoerkaI18nScope, VoerkaI18nTranslate } from "@Voerkai18n/runtime"
import type { InjectionKey,Plugin } from "vue"

export declare interface VoerkaI18nVuePluginOptions{
    i18nScope:VoerkaI18nScope
}

export const defaultPlugin: Plugin<VoerkaI18nVuePluginOptions>
export default  defaultPlugin

export type useVoerkaI18n = ()=>{
    language:string
    defaultLanguage:string,  // 默认语言
    languages:VoerkaI18nSupportedLanguages 
}
export interface VoerkaI18nProviderType{
    activeLanguage:string
    defaultLanguage:string  // 默认语言
    languages:VoerkaI18nSupportedLanguages 
}

export declare type VoerkaI18nProvider = InjectionKey<VoerkaI18nProviderType>
export declare  function injectVoerkaI18n():VoerkaI18nProviderType


declare module '@vue/runtime-core' {
    interface ComponentCustomProps  {
      
    } 
    interface ComponentCustomProperties  {
        $activeLanguage:string
        t: VoerkaI18nTranslate 
    } 
  }