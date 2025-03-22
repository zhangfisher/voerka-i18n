import { createSignal, createEffect, onCleanup } from "solid-js";
import { VoerkaI18nManager, VoerkaI18nScope } from "@voerkai18n/runtime";

export function useVoerkaI18n(scope?: VoerkaI18nScope) {
    const manager: VoerkaI18nManager = globalThis.VoerkaI18n;
    const curScope = scope || manager.scope;
    if (!manager || !curScope) {
        throw new Error('VoerkaI18n is not defined');
    }

    const [activeLanguage, setActiveLanguage] = createSignal(curScope.activeLanguage);
    const [first, setFirst] = createSignal(true);

    createEffect(() => {
        if (first()) {
            curScope.ready(() => {
                setActiveLanguage(curScope.activeLanguage);
            });
            setFirst(false);
        }

        const listener = manager.on("change", (newLanguage: string) => {
            setActiveLanguage(newLanguage);
        });

        return () => {
            if (listener) {
                (listener as any).off();
            }
        };
    }, []);

    return {
        scope: curScope,
        manager,
        activeLanguage,
        defaultLanguage: curScope.defaultLanguage,
        languages: curScope.languages,
        changeLanguage: curScope.change.bind(curScope),
        t: curScope.t,
    };
}
