

export var useVoerkaI18n:()=>{
    activeLanguage:string
    changeLanguage:(newLanguage:string)=>Promise<void>
    languages:VoerkaI18nSupportedLanguages
}