import type {VoerkaI18nSupportedLanguages,VoerkaI18nTranslate,VoerkaI18nScope} from "@voerkai18n/runtime"
import type React  from "react"

export type useVoerkaI18n = ()=>{
    language:string
    changeLanguage:(newLanguage:string)=>Promise<void>
    defaultLanguage:string,  // 默认语言
    languages:VoerkaI18nSupportedLanguages,
    t:VoerkaI18nTranslate
}

export type VoerkaI18nProviderProps = React.PropsWithChildren & { 
    scope:VoerkaI18nScope
    fallback:React.ReactNode
}

export type VoerkaI18nProvider = React.FC<VoerkaI18nProviderProps>