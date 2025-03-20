import { Suspense, createEffect, createSignal, Component, onCleanup } from "solid-js";
import { useLocation, useSearchParams } from "@solidjs/router";
import { applyTranslate } from "../utils";
import { VoerkaI18nManager } from "@voerkai18n/runtime";

export function NavigationEvents() {
    const location = useLocation();
    const searchParams = useSearchParams();

    createEffect(() => {
        applyTranslate();
    }, [location, searchParams]);

    return null;
}

function getInitReady(manager: VoerkaI18nManager) {
    return (
        manager.activeLanguage === manager.defaultLanguage ||
        typeof manager.scope.messages[manager.activeLanguage] !== "function"
    );
}

/**
 *  
 */
export type VoerkaI18nSolidProviderProps = {
    fallback?: Component;
    children: any;
};

export function VoerkaI18nNextjsProvider(props: VoerkaI18nSolidProviderProps) {
    const { fallback, children } = props;
    const manager = globalThis.VoerkaI18n;
    const [ready, setReady] = createSignal(getInitReady(manager));

    createEffect(() => {
        if (ready()) return;
        const listener = manager.on("ready", () => {
            setReady(true);
        }) as any
        onCleanup(() =>listener &&  listener.off());
 
    });

    return (<>
            {ready() || (!ready() && !fallback) ? (
                <Suspense fallback={null}>
                    <NavigationEvents />
                    {children}
                </Suspense>
            ) : (
                fallback
            )}
        </>);
}