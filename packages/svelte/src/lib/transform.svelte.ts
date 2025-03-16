import type { VoerkaI18nEventSubscriber, VoerkaI18nScope } from '@voerkai18n/runtime';
import { onMount,onDestroy  } from 'svelte';

export function createTranslateTransform(){
    return (scope:VoerkaI18nScope) => {       
        
        return (result:string)=>{       
            let subscriber:VoerkaI18nEventSubscriber
            let text = $state(result)
            onMount(() => {
                subscriber = scope.on('change',(lang:string)=>{
                    text = scope.t(result)
                }) 
            });
            onDestroy(() => {
                subscriber && subscriber.off()
            });                  
            return text
        }
    }    
}

export type SvelteTransformResultType = string 