import { VoerkaI18nLanguageLoader } from '@/types'
import { VoerkaI18nScope, VoerkaI18nScopeOptions } from '../scope'  
import { VoerkaI18nManager } from "@/manager"


export function createVoerkaI18nScope(opts?:Partial<VoerkaI18nScopeOptions>): VoerkaI18nScope {
    return new VoerkaI18nScope(Object.assign({
        id: 'test-scope',
        debug: false,
        library: false,
        languages: {
            zh: { name: 'Chinese', title: '中文', fallback: 'en', active: true,default: true },
            en: { name: 'English', title: 'English'}        
        },
        fallback: "en",
        messages: {
          en: { message: 'Hello' },
          zh: { message: '你好' }
        },
        idMap: {},
        storage: undefined,
        formatters: {},
        ready: () => {},    
      }, opts))
}


export function resetVoerkaI18n() {
  try{
    
    if(globalThis.VoerkaI18n){
      globalThis.VoerkaI18n.clearLanguage()
    }

    // @ts-ignore
    delete globalThis.__VoerkaI18nScopes__ 
    // @ts-ignore
    delete globalThis.VoerkaI18n         
    VoerkaI18nManager.instance = undefined

  }catch{}
}


export function getTestStorage(init?:string){
  let saveLanguage:string | undefined= init
  return {
      get() { return saveLanguage},
      set(_:string,value:string){saveLanguage = value},
      remove(){ saveLanguage = undefined }
  }

}


export function getTestLanguageLoader(patchMsgs?:Record<string,any>):VoerkaI18nLanguageLoader{
  return async (language:string,scope:VoerkaI18nScope)=>{
   return Object.assign({},patchMsgs)
  }
}