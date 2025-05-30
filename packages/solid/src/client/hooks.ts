import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import { VoerkaI18nManager, VoerkaI18nScope } from "@voerkai18n/runtime";

export function useVoerkaI18n(scope?: VoerkaI18nScope) {
    const manager: VoerkaI18nManager = globalThis.VoerkaI18n;
    const curScope = scope || manager.scope;

    if (!manager || !curScope) {
        throw new Error('VoerkaI18n is not defined');
    }

    const [activeLanguage, setActiveLanguage] = createSignal(curScope.activeLanguage);

    let subscriber: any;
    
    curScope.ready(() => {
        setActiveLanguage(curScope.activeLanguage);
    });

    onMount(() => {
        subscriber = manager.on("change", (newLanguage: string) => {
            setActiveLanguage(newLanguage);
        });
    });
    onCleanup(() =>subscriber &&  subscriber.off()); 
 

    return {
        scope: curScope,
        manager,
        activeLanguage,
        defaultLanguage: curScope.defaultLanguage,
        languages      : curScope.languages,
        changeLanguage : curScope.change.bind(curScope),
        t              : curScope.t,
    };
}
