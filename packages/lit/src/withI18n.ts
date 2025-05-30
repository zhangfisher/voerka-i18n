import { LitElement } from 'lit'
import type { VoerkaI18nScope, VoerkaI18nEventSubscriber } from "@voerkai18n/runtime"

export function withI18n<T extends typeof LitElement>(Base: T, scope: VoerkaI18nScope): T {
  // @ts-ignore
  return class extends Base {
    private _i18nScope = scope
    private _subscribe: VoerkaI18nEventSubscriber

    constructor(...args: any[]) {
      // @ts-ignore
      super(...args)
      this._subscribe = this._i18nScope.on('change', () => this.requestUpdate())
    }

    disconnectedCallback() {
      this._subscribe?.off()
      super.disconnectedCallback?.()
    }

    get t() {
      return this._i18nScope.t
    }

    get $t() {
      return this._i18nScope.$t
    }

    get lang() {
      return this._i18nScope.activeLanguage
    }

    get languages() {
      return this._i18nScope.languages
    }

    get defaultLanguage() {
      return this._i18nScope.defaultLanguage
    }

    get paragraphs() {
      return this._i18nScope.activeParagraphs
    }

    setLanguage(lang: string) {
      return this._i18nScope.change(lang)
    }
  }
}
