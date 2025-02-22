import type { VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import { createTranslateComponent } from '@voerkai18n/vue2';
import type { Component } from 'vue';

export const component = createTranslateComponent() 
export type TranslateComponentType = Component<VoerkaI18nTranslateProps>