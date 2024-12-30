import { VoerkaI18nScope, VoerkaI18nScopeOptions } from '../scope'  

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
        storage: {},
        formatters: {},
        ready: () => {},    
      }, opts))
}
