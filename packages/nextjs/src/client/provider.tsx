'use client'

import { Suspense, useEffect, useState } from "react";
import { useVoerkaI18n } from "@voerkai18n/react";
import { usePathname, useSearchParams } from "next/navigation";
import { applyTranslate } from "../utils";
import { VoerkaI18nManager } from "@voerkai18n/runtime";



export function NavigationEvents() {
    const pathname = usePathname()
    const searchParams = useSearchParams() 
    useEffect(() => {
      applyTranslate()
    }, [pathname, searchParams])
    return null
}
  

function getInitReady(manager:VoerkaI18nManager){
    return manager.activeLanguage === manager.defaultLanguage
        || typeof(manager.scope.messages[manager.activeLanguage])!=='function'
}   

/**
 *  
 */
export type VoerkaI18nNextjsProviderProps= React.PropsWithChildren<{
    fallback?: React.ReactNode;
}>

export function VoerkaI18nNextjsProvider(props: VoerkaI18nNextjsProviderProps){
    const { fallback, children }  = props
    const { manager } = useVoerkaI18n()
    const [ ready,setReady ] = useState(getInitReady(manager))

    useEffect(()=>{
        if(ready) return
        const listener = manager.on('ready',()=>{
            setReady(true)
        })
        return ()=> { typeof(listener)==='object' && listener.off() }
    },[])
    
    return (<>
        {  ready || (!ready && !fallback)? 
            (
                <Suspense fallback={null}>
                    <NavigationEvents />
                    {children}
                </Suspense>
            ) : fallback }
    </>)  
}