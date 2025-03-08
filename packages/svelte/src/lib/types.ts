import type { VoerkaI18nTranslateComponentBuilder } from "@voerkai18n/runtime";
import type { SvelteComponent } from "svelte";

export type CreateTranslateComponentOptions = {
    tagName?: string;
    attrs?: Record<string, string>;
    class?: string;
    style?: string;
    loading?: any;
};

export type VoerkaI18nSvelteTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<SvelteComponent>;
