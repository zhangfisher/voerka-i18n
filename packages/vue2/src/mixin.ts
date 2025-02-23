import { VoerkaI18nScope } from "@voerkai18n/runtime"
import Vue, { VueConstructor } from 'vue'
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
export type WithI18nMixin = {
    activeLanguage : string
    defaultLanguage: string
    languages      : string[]
    changeLanguage(language: string): Promise<void>
}
  

export function withI18n(options: Parameters<typeof Vue.extend>[0], scope?:VoerkaI18nScope ){
    if(options){
        if(!Array.isArray(options.mixins)) options.mixins= []
        options.mixins.push(i18nMixin)
    }
    const i18nMixinInst = i18nMixin(scope)
    return (Vue as VueConstructor<Vue & InstanceType<typeof i18nMixinInst>>).extend(options)
 
} 