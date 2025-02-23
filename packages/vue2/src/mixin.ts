import { VoerkaI18nScope } from "@voerkai18n/runtime"
import Vue, { ComponentOptions, VueConstructor } from 'vue'
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

// 定义一个辅助类型来扩展组件的类型定义
export type WithI18nMixin = Vue & {
    activeLanguage: string
    defaultLanguage: string
    languages: string[]
    changeLanguage(language: string): Promise<void>
}

type VueC = ReturnType<typeof Vue.extend>

export function withI18n<T extends ComponentOptions<Vue>>(options: T,scope?:VoerkaI18nScope){
    // if (options) {
    //     if (!Array.isArray(options.mixins)) options.mixins = []
    //     options.mixins.push(i18nMixin())
    // }
    
    return mixins(i18nMixin(scope)).extend(options) 
}