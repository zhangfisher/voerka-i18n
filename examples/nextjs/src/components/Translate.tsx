import { useEffect, useState } from "react"


export function Translate(props: { message: string }) {    
    const [lang, setLang ] = useState(I18n.activeLangauge)
    useEffect(()=>{
        const unsubscribe = I18n.on((lang:string)=>{
            setLang(lang)
        })
        return ()=>{
            unsubscribe()
        }
    },[lang])
    return <span className="vt-msg vt-ssr">{I18n.t(props.message)}</span>
}   