'use client'
import classnames from "classnames"
import { useVoerkaI18n } from "@voerkai18n/nextjs/client";


export function LanguageBar(){

    const { languages,activeLanguage,changeLanguage } = useVoerkaI18n() 

    return (<>
        { languages.map(lang=>{
            return <button 
                type="button" 
                key={ lang.name }
                onClick={()=>changeLanguage(lang.name) }             
                className={classnames("cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium mr-4 rounded-lg text-sm px-4 py-2 text-center ",
                    {
                        "bg-emerald-800 hover:bg-emerald-600 text-white ": lang.name===activeLanguage,
                        "border-1 border-gray-400" : lang.name!=activeLanguage
                    })
                }>
                {lang.name}
            </button>

        })}
    </>)
}