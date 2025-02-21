import { VoerkaI18nScope } from "@voerkai18n/runtime"


export function i18nMixin(scope?:VoerkaI18nScope){
    const curScope = scope || globalThis.VoerkaI18n.scope
    return {
        data:()=>{
            return {
                activeLanguage:curScope.activeLanguage, 
                defaultLanguage:curScope.defaultLanguage,
                languages:curScope.languages
            }
        },
        methods:{
            changeLanguage(language:string){
                VoerkaI18n.change(language)
            }
        }
    }
} 