import type { VoerkaI18nTranslatedComponentProps } from '@voerkai18n/runtime';
import { createTranslateComponent } from '@voerkai18n/vue';
import type { Component } from 'vue';

export const component = createTranslateComponent() 
export type TranslateComponentType = Component<VoerkaI18nTranslatedComponentProps>