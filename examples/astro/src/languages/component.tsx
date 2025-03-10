import type { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import translate from './component.astro'; 

 
export type CreateTranslateComponentOptions = {}

export function createTranslateComponent(options?:CreateTranslateComponentOptions) {
    return (scope: VoerkaI18nScope) => {
        return translate
    }
}