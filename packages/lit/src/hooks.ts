import { ReactiveController, ReactiveElement } from 'lit'
import { VoerkaI18nManager, VoerkaI18nScope } from '@voerkai18n/runtime'

class I18nHookController implements ReactiveController {
  private host: ReactiveElement
  private scope: VoerkaI18nScope
  private subscriber: any
  private _activeLanguage: string

  constructor(host: ReactiveElement, scope: VoerkaI18nScope) {
    this.host = host
    this.scope = scope
    this._activeLanguage = scope.activeLanguage
    host.addController(this)
  }

  hostConnected() {
    this.subscriber = this.scope.on('change', (newLanguage: string) => {
      this._activeLanguage = newLanguage
      this.host.requestUpdate()
    })
  }

  hostDisconnected() {
    this.subscriber?.off()
  }

  get activeLanguage() {
    return this._activeLanguage
  }

  get defaultLanguage() {
    return this.scope.defaultLanguage
  }

  get languages() {
    return this.scope.languages
  }

  get t() {
    return this.scope.t
  }

  get $t() {
    return this.scope.$t
  }

  changeLanguage(language: string) {
    return this.scope.change(language)
  }
}

export function useI18n(host: ReactiveElement, scope?: VoerkaI18nScope) {
  const manager: VoerkaI18nManager = (globalThis as any).VoerkaI18n
  const curScope = scope || manager.scope

  if (!manager || !curScope) {
    throw new Error('VoerkaI18n is not defined')
  }

  const controller = new I18nHookController(host, curScope)
  return controller
}