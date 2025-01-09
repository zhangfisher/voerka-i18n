import { VoerkaI18nManager, VoerkaI18nScope, VoerkaI18nScopeOptions,VoerkaI18nLanguageLoader } from '@voerkai18n/runtime'
import { deepMerge } from 'flex-tools/object/deepMerge'

export function createVoerkaI18nScope<T extends VoerkaI18nScopeOptions = VoerkaI18nScopeOptions>(opts?:Partial<T>,useDeepMerge?:boolean): VoerkaI18nScope {
    const merge = useDeepMerge ? deepMerge : Object.assign
    return new VoerkaI18nScope<T>(merge({
        id       : 'test-scope',
        debug    : false,
        library  : false,
        languages: {
            zh: { name: 'Chinese', title: '中文', active: true,default: true },
            en: { name: 'English', title: 'English'} 
        }, 
        messages: {
          en: { message: 'Hello' },
          zh: { message: '你好' } 
        },
        idMap     : {},
        storage   : undefined,
        formatters: [],
        ready     : () => {},    
      }, opts) as T)
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


export function getTestStorage(initial?:Record<string,string>){
  let values:Record<string,string> = Object.assign({},initial)
  return {
      get(key:string) { 
        return values[key]
      },
      set(key:string,value:string){
        values[key] = value
      },
      remove(key:string){ 
        delete values[key]
      },
      getAll(){
        return values
      }
  }

}


export function getTestLanguageLoader(callback?: VoerkaI18nLanguageLoader):VoerkaI18nLanguageLoader{
  return async (language:string,scope:VoerkaI18nScope)=>{
    return callback && await callback(language,scope)
  }
}