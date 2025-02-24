import type { TranslateElement } from "./v-translate"

export {} 

declare global {
    interface HTMLElementTagNameMap {
      'v-translate': TranslateElement
    }
}
