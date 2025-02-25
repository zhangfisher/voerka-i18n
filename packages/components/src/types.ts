import { VoerkaI18nMessagePatchableOptions } from "./patchable"
import type { TranslateElement } from "./v-translate"


export {} 

declare global {
    interface HTMLElementTagNameMap {
      'v-translate': TranslateElement
    }

}

declare module '@voerkai18n/runtime' {
    export interface VoerkaI18nManager {
        patch: (options?:VoerkaI18nMessagePatchableOptions)=>void
    }

}
