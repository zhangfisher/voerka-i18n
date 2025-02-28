'use client'
import { useEffect, useState } from "react";
import classnames from "classnames"
import "@/utils/scope"


export function LanguageBar(){
    const [lang, setLang ] = useState(I18n.activeLangauge)
    useEffect(()=>{
        const unsubscribe = I18n.on((lang:string)=>{
            setLang(lang)
        })
        return ()=>{
            unsubscribe()
        }
    },[lang])
    return (<>
        <button 
            onClick={()=>{ I18n.activeLangauge="cn" }} type="button" 
            className={classnames("cursor-pointerfocus:ring-4 focus:outline-none focus:ring-blue-300 font-medium mr-4 rounded-lg text-sm px-4 py-2 text-center ",{
                "bg-emerald-800 hover:bg-emerald-600  text-white ": lang==="cn"                        
            })}>
        zh-CN
        </button>
        <button 
            onClick={()=>{ I18n.activeLangauge="en" }} type="button" 
            className={classnames("cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium mr-4 rounded-lg text-sm px-4 py-2 text-center ",{
                "bg-emerald-800 hover:bg-emerald-600 text-white  ": lang==="en"                        
            })}>
        en-US
        </button>
    </>)
}