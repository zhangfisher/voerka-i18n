import { createTranslateComponent, type VueTranslateComponentType } from "@voerkai18n/vue2";
import Loading from "@/components/Loading.vue";
export const component = createTranslateComponent({loading:Loading})
export type TranslateComponentType = VueTranslateComponentType