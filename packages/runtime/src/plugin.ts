import type { VoerkaI18nPlugin } from "./types"


export function definePlugin(plugin:VoerkaI18nPlugin){    
    const manager = globalThis.VoerkaI18n
    if(manager){
        manager.registerPlugin(plugin)
    }else{
        if(!globalThis.__VoerkaI18nPlugins__) globalThis.__VoerkaI18nPlugins__ = []
        globalThis.__VoerkaI18nPlugins__.push(plugin)
    }
}