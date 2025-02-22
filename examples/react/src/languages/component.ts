import type { VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import { createTranslateComponent } from '@voerkai18n/react';
import type { ComponentType } from 'react';

export const component = createTranslateComponent() 
export type TranslateComponentType = ComponentType<VoerkaI18nTranslateProps>