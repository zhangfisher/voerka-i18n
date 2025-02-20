import type { VoerkaI18nManager,VoerkaI18nScope } from "@voerkai18n/runtime";
import { useEffect, useRef, useState } from "react";

export function useVoerkaI18n(scope?:VoerkaI18nScope) {
    const manager:VoerkaI18nManager = globalThis.VoerkaI18n;
    const curScope = scope || manager.scope
    if (!manager || !curScope) {
        throw new Error('VoerkaI18n is not defined');
    }
    const [activeLanguage,setActiveLanguage ] = useState(curScope.activeLanguage);
    const isFirst = useRef(true)
    
    useEffect(() => {
        if(isFirst.current){
            curScope.ready(()=>{
                setActiveLanguage(curScope.activeLanguage)
            })
            isFirst.current = false
        }
        const listener:any = manager.on("change", (newLangauge:string)=>{
            setActiveLanguage(newLangauge)
        });
        return () =>  listener && listener.off()
    },[]);


    return {
        activeLanguage,
        defaultLanguage: curScope.defaultLanguage,
        languages      : curScope.languages,
        changeLanguage : curScope.change,
        t              : curScope.t
    };
} 