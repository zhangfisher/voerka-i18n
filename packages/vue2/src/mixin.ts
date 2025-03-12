import { VoerkaI18nScope } from "@voerkai18n/runtime"
import Vue, { ComponentOptions } from 'vue'
import mixins from 'vue-typed-mixins'

export function i18nMixin(scope?:VoerkaI18nScope){
    const curScope = scope || globalThis.VoerkaI18n.scope
    return Vue.extend({
        data:()=>{
            return {
                activeLanguage : curScope.activeLanguage, 
                defaultLanguage: curScope.defaultLanguage,
                languages      : curScope.languages
            }
        },
        methods:{
            async changeLanguage(language:string){
                await VoerkaI18n.change(language)
                // @ts-ignore                
                this.activeLanguage = language
            }
        }
    })
} 

 
export function withI18n<T extends ComponentOptions<Vue>>(options: T,scope?:VoerkaI18nScope){
    return mixins(i18nMixin(scope)).extend(options) 
}