import { Suspense, createSignal, Component, onCleanup, onMount } from "solid-js";
import { VoerkaI18nManager } from "@voerkai18n/runtime";

function getInitReady(manager: VoerkaI18nManager) {
    return (
        manager.activeLanguage === manager.defaultLanguage ||
        typeof manager.scope.messages[manager.activeLanguage] !== "function"
    );
}

export type VoerkaI18nSolidProviderProps = {
    fallback?: JSX.Element;
    children: any;
};

export function VoerkaI18nSolidProvider(props: VoerkaI18nSolidProviderProps) {
    const { fallback, children } = props;
    const manager = globalThis.VoerkaI18n;
    const [ready, setReady] = createSignal(getInitReady(manager));
    
    let listener:any
    listener = manager.on("ready", () => { 
        setReady(true);
    })  
    onCleanup(() => listener && listener.off()); 

    return <>{
        ready() ? (
            <Suspense fallback={null}> 
                {children}
            </Suspense>
        ) : (
            fallback
        )}
    </>
}