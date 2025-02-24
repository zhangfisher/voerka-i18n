import { VoerkaI18nManager, VoerkaI18nScope } from "@voerkai18n/runtime"
import {App, Plugin } from "vue"

export type VoerkaI18nVuePluginOptions = {
    scope?: VoerkaI18nScope
}

export const i18nPlugin: Plugin<VoerkaI18nVuePluginOptions> =   {
    install: (app:App, options?:VoerkaI18nVuePluginOptions) => { 
        const { scope } = Object.assign({
            scope: undefined
        },options)
        const manager:VoerkaI18nManager = globalThis.VoerkaI18n;
        const curScope = scope || manager.scope
        if (!manager || !curScope) {
            throw new Error('VoerkaI18n is not installed');
        }
        app.config.globalProperties.t = curScope.translate
        app.component('Translate',curScope.Translate)
    }
}
