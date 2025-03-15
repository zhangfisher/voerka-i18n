import type { VoerkaI18nScope } from '@voerkai18n/runtime';
import { computed, ComputedRef,getCurrentInstance } from 'vue'; 

export function createTranslateTransform(){
    return (scope:VoerkaI18nScope) => {        
        return (result:string)=>{             
            const instance = getCurrentInstance()
            return computed(()=>{
                instance?.appContext.config.globalProperties.$$activeLanguage.value
                return scope.t(result)
            });                
        }
    }    
}

export type VueTransformResultType = ComputedRef<string>