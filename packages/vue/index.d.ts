export {}
import type { VoerkaI18nSupportedLanguages, VoerkaI18nTranslate } from "@Voerkai18n/runtime"
import type { InjectionKey,Plugin } from "vue"


export const defaultPlugin:Plugin
export default defaultPlugin

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

export type VoerkaI18nProvider = InjectionKey<VoerkaI18nProviderType>
export function injectVoerkaI18n():VoerkaI18nProviderType


declare module 'vue' {
    interface ComponentCustomProps  {
      
    } 
    interface ComponentCustomProperties  {
        $activeLanguage:string
        t: VoerkaI18nTranslate 
    } 
  }