<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { loadAsyncModule,type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder } from "@voerkai18n/runtime";
import type { CreateTranslateComponentOptions, VoerkaI18nSvelteTranslateComponentBuilder } from './lib/types.js';

let props = $props();

let { id: paragraphId, message, vars, options: tOptions, default: tDefault = '' } = props;
let isParagraph: boolean = typeof paragraphId === 'string' && paragraphId.length > 0;

let result = isParagraph ? props.children : typeof message === 'function' ? tDefault : scope.translate(message!, vars, tOptions);
let loading = false;
let tag = props.tag || tagName;
let msgId = scope.getMessageId(props.message);

                const loadMessage = async (language: string) => {
                    const loader = typeof message === 'function' ? () => message(language, vars, tOptions) : () => message;
                    const result = await loader();
                    result = scope.translate(result!, vars, tOptions);
                };

                const loadParagraph = async () => {
                    if (paragraphId) {
                        const loader = scope.activeParagraphs[paragraphId];
                        if (!loader) return;
                        if (hasLoading) loading = true;
                        try {
                            const paragraphText = await loadAsyncModule(loader);
                            result = paragraphText;
                        } catch (e: any) {
                            console.error(e);
                        } finally {
                            if (hasLoading) loading = false;
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

                onMount(() => {
                    if (typeof message === 'function' || isParagraph) {
                        refresh(scope.activeLanguage);
                    }
                    const listener = scope.on('change', refresh) as any;
                    return () => listener.off();
                });

                if (msgId) attrs['data-id'] = msgId;
                if (paragraphId) attrs['data-id'] = paragraphId;
                if (scope.library) attrs['data-scope'] = String(scope.$id);

                return {
                    tag,
                    attrs,
                    className,
                    gStyle,
                    result,
                    loading,
                    LoadingComponent,
                    hasLoading,
                };
            };
</script>

{#if loading && hasLoading}
    <svelte:component this={LoadingComponent} />
{/if}
{@html result}
