import { VoerkaI18nLanguageDefine, VoerkaI18nScope, VoerkaI18nTranslate } from "@voerkai18n/runtime"
import React, { useCallback, useEffect, useState } from "react"


export type VoerkaI18nContextProps = {
    changeLanguage : (newLanguage:string)=>Promise<void> 
    defaultLanguage: string   
    activeLanguage : string   
    languages      : VoerkaI18nLanguageDefine[]
    t              : VoerkaI18nTranslate
    changing       : boolean
}

export const VoerkaI18nContext = React.createContext<VoerkaI18nContextProps>({
    languages:[],
    activeLanguage:'zh-CN',
    defaultLanguage:'zh-CN',
    changeLanguage:async () =>{},
    t:()=>'',
    changing: false
})

VoerkaI18nContext.displayName = 'VoerkaI18nProvider'

export type VoerkaI18nProviderProps = React.PropsWithChildren<{ 
    scope     : VoerkaI18nScope
    fallback? : React.ReactNode
}>

export function VoerkaI18nProvider(props:VoerkaI18nProviderProps){
    const { scope,fallback }       = props
    const [language, setLanguage ] = useState(VoerkaI18n.activeLanguage); 
    const [ready, setReady ]       = useState(false);
    const [changing, setChanging]  = useState(false)
    
    useEffect(() => { 
        const onChangeLanguage = (newLanguage:string) => setLanguage(newLanguage) 
        VoerkaI18n.ready(()=>{            
            setReady(true)
        })
        const listener = VoerkaI18n.on("change",onChangeLanguage) as any
        return () => listener.off()
    },[]);

    
    const changeLanguage = useCallback((newLanguage:string) => {
        setChanging(true)
        return VoerkaI18n.change(newLanguage).then((lng) => {
            setLanguage(lng) 
            setChanging(false)
        })
    },[ language ])

    const value ={
        changeLanguage,
        activeLanguage : language,    
        defaultLanguage: VoerkaI18n.scope.defaultLanguage,
        languages      : VoerkaI18n.languages,        
        changing       : changing,
        t              : scope.t
    }

    return ( <><VoerkaI18nContext.Provider value={value}>
            { (!ready && fallback) ? props.fallback : props.children }
        </VoerkaI18nContext.Provider> </>)
}