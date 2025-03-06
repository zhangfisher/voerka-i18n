<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { VoerkaI18nScope, loadAsyncModule } from '@voerkai18n/runtime';

  export let message: string | ((language: string, vars: any[], options: any) => Promise<string>);
  export let vars: any[] = [];
  export let options: any = {}; 
  export let loading: boolean | string | typeof Loading = false;
  export let id: string = '';
  export let tag: string = '';
  export let scope: VoerkaI18nScope;

  const result = writable('');
  const isLoading = writable(false);
  const isFirst = writable(false);
  const dispatch = createEventDispatcher();

  const delay = (ms: number = 2000) => new Promise(resolve => setTimeout(resolve, ms));

  function isReactComponent(component: any): boolean {
    return typeof component === 'function' || (typeof component === 'object' && component !== null && typeof component.type === 'function');
  }

  const loadMessage = async (language: string) => {
    const loader = typeof message === 'function' ? () => message(language, vars, options) : () => message;
    const resultMessage = await loader();
    result.set(scope.translate(resultMessage, vars, options));
  };

  const loadParagraph = async () => {
    if (id) {
      const loader = scope.activeParagraphs[id];
      if (!loader) return;
      isLoading.set(true);
      try {
        await delay();
        const paragraphText = await loadAsyncModule(loader);
        result.set(paragraphText);
      } catch (e: any) {
        console.error(e);
      } finally {
        isLoading.set(false);
      }
    }
  };

  const refresh = async (language: string) => {
    if (id) {
      await loadParagraph();
    } else {
      await loadMessage(language);
    }
  };

  onMount(() => {
    if (!isFirst) {
      refresh(scope.activeLanguage);
      isFirst.set(true);
    }
    const listener = scope.on('change', loadMessage);
    return () => listener.off();
  });
</script>

{#if $isLoading && isReactComponent(loading)}
  <svelte:component this={loading} tips="Loading..." />
{/if}

{#if tag}
  {@html $result}
{:else}
  <>{ $result }</>
{/if}

<style>
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1em;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  }
</style>