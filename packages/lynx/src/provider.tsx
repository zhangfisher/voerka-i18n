import { useEffect, useState } from "@lynx-js/react";
import { useVoerkaI18n } from "./hooks";
import { VoerkaI18nManager } from "@voerkai18n/runtime";

function getInitReady(manager:VoerkaI18nManager){
    return manager.activeLanguage === manager.defaultLanguage
        || typeof(manager.scope.messages[manager.activeLanguage])!=='function'
}   
/**
 *  
 */
export type VoerkaI18nProviderProps= React.PropsWithChildren<{
    fallback?: React.ReactNode;
}>

export function VoerkaI18nProvider(props: VoerkaI18nProviderProps){
    const { fallback, children }  = props
    const { manager } = useVoerkaI18n()
    const [ ready,setReady ] = useState(getInitReady(manager))
    useEffect(()=>{
        const listener = manager.on('ready',()=>{
            setReady(true)
        })
        return ()=> { typeof(listener)==='object' && listener.off() }
    },[])
    return <>
        { ready || (!ready && !fallback) ? children : fallback }
    </>  
}