import type { VoerkaI18nManager,VoerkaI18nTranslate, VoerkaI18nScope } from '@voerkai18n/runtime';
import { ref, onMounted, onUnmounted } from 'vue'; 


export function useVoerkaI18n(scope?:VoerkaI18nScope) {
    const manager:VoerkaI18nManager = globalThis.VoerkaI18n;
    const curScope = scope || manager.scope
    if (!manager || !curScope) {
        throw new Error('VoerkaI18n is not defined');
    }

    const activeLanguage = ref(manager.activeLanguage);


    let listener:any

    onMounted(() => {
        listener = manager.on("change", ()=>{
            activeLanguage.value = manager.activeLanguage;
        });
    });

    onUnmounted(() => listener && listener.off()); 

    return {
        manager,
        scope:curScope,
        activeLanguage,
        defaultLanguage: curScope.defaultLanguage,
        languages      : curScope.languages,
        changeLanguage : curScope.change,
        t              : ((...args:any)=>{
            activeLanguage.value
            return curScope.t.apply(curScope,args)
        }) as VoerkaI18nTranslate
,
    }; 

}