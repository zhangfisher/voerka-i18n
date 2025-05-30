<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { loadAsyncModule,type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nEventSubscriber } from "@voerkai18n/runtime";
import type { TranslateComponentContext } from './types';


    let props:VoerkaI18nTranslateProps & { $context?:TranslateComponentContext }= $props();
     
    let { id: paragraphId, message, vars, options, default:defaultMessage  } = props;
    const { tagName,attrs,class:className, style, loading:LoadingComponent  } = props.$context as TranslateComponentContext

    const scope = (props.$context?.scope || VoerkaI18n.scope ) as VoerkaI18nScope;

    let isParagraph: boolean = typeof paragraphId === 'string' && paragraphId.length > 0;

    let result = $state(isParagraph ? props.children : typeof message === 'function' ? defaultMessage : scope.translate(message!, vars, options))

    let msgId = scope.getMessageId(props.message);

    const loadMessage = async (language: string) => {
        const loader = typeof message === 'function' ? () => message(language, vars, options) : () => message;
        const msg = await loader();
        result = scope.translate(msg!, vars, options);
    };

    const loadParagraph = async () => {
        if (paragraphId) {
            const loader = scope.activeParagraphs[paragraphId];
            if (!loader) return; 
            try {
                const paragraphText = await loadAsyncModule(loader);
                result = paragraphText;
            } catch (e: any) {
                console.error(e);
            }  
        }
    };

    const refresh = (language: string) => {
        if (isParagraph) {
            loadParagraph();
        } else {
            loadMessage(language);
        }
    };

    let subscriber:VoerkaI18nEventSubscriber | undefined;

    onMount(() => {
        if (typeof message === 'function' || isParagraph) {
            refresh(scope.activeLanguage);
        }
        subscriber = scope.on('change', refresh) as any; 
    });

    onDestroy(() => {        
        subscriber && subscriber.off();
    });
        
</script>

{#if tagName || isParagraph} 
    <svelte:element this={tagName || 'div'} 
        data-id={ paragraphId || msgId } 
        data-scope={scope.$id} 
        class={className}
        style={style}
        {...attrs}
    >
        {result} 
        {#if LoadingComponent}
            <LoadingComponent />
        {/if} 
    </svelte:element>
{:else}
    { result}
{/if}
