import { createTranslateComponent,ReactTranslateComponentType } from "@voerkai18n/react";
import Loading from '@/components/Loading';
export const component = createTranslateComponent({loading:Loading})
export type TranslateComponentType = ReactTranslateComponentType

