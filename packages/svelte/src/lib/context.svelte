<script lang="ts">

import { onDestroy, onMount, setContext } from 'svelte';
import type { VoerkaI18nEventSubscriber } from '@voerkai18n/runtime';

const { scope = VoerkaI18n.scope,children } = $props() 
let activeLanguage = $state(VoerkaI18n.activeLanguage);
let ready = $state(false);

let subscriber:VoerkaI18nEventSubscriber | undefined;

scope.on("ready",()=>{
    ready = true
})


onMount(()=>{    

    subscriber = scope.on('change', (newLanguage:string) => {
        activeLanguage = newLanguage
    })
});

onDestroy(()=>{
    subscriber && subscriber.off()
});
 


setContext('Voerkai18nContext', {
    activeLanguage,
    defaultLanguage: VoerkaI18n.defaultLanguage,
    changeLanguage : scope.change.bind(scope),
    languages      : VoerkaI18n.languages,  
    t              : scope.t,   
    manager        : VoerkaI18n,
    scope,
   
});

</script>

{#if ready}
    {@render children?.()}
{/if}


