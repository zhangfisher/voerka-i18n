import classnames from "classnames"
import { useVoerkaI18n } from "@voerkai18n/lynx";


export function LanguageBar(){

    const { languages,activeLanguage,changeLanguage } = useVoerkaI18n() 

    return (<view className="languagebar">ss
        { languages.map(lang=>{
            return <button 
                type="button" 
                key={ lang.name }
                onClick={()=>changeLanguage(lang.name) }             
                className={classnames(
                    "language",
                    {
                        "active": lang.name===activeLanguage
                    })
                }>
                {lang.name}
            </button>

        })}
    </view>)
}