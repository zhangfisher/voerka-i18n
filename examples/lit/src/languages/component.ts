
// --- React ---
// import { createTranslateComponent } from "@voerkai18n/react";
// import { VoerkaI18nTranslateProps } from "@voerkai18n/runtime";
// import { ComponentType } from "react";
// export const component = createTranslateComponent()
// export type TranslateComponentType = ComponentType<VoerkaI18nTranslateProps>

// --- Vue3 ---
// import { createTranslateComponent, type VueTranslateComponentType } from "@voerkai18n/vue";
// export const component = createTranslateComponent({loading:false})
// export type TranslateComponentType = VueTranslateComponentType

// --- Vue2 ---

// import { createTranslateComponent, type VueTranslateComponentType } from "@voerkai18n/vue2";
// export const component = createTranslateComponent({loading:true})
// export type TranslateComponentType = VueTranslateComponentType

// --- Svelte ---
// import { createTranslateComponent,type SvelteTranslateComponent } from "@voerkai18n/svelte";
// export const component  = createTranslateComponent()
// export type TranslateComponentType = SvelteTranslateComponent


// --- 无组件 ---

export const component = undefined
export type TranslateComponentType = any


// 自定义组件
// export const component = (scope:VoerkaI18nScope)=>{
//      return (props:VoerkaI18nTranslateProps)=>{
//          ....
//      }
// }
// export type TranslateComponentType = ReturnType<typeof component>
