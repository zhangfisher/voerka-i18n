import type { VoerkaI18nScope, VoerkaI18nTranslateComponentBuilder } from "@voerkai18n/runtime";
import type { Component } from "svelte";
import type { ClassValue } from 'svelte/elements';


export type CreateTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : ClassValue
    style?    : string
    loading?  : Component
}
export type TranslateComponentContext = CreateTranslateComponentOptions & {
    scope: VoerkaI18nScope
}
 
export type VoerkaI18nSvelteTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<Component>;
