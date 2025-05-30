import { ReactiveController, ReactiveElement } from 'lit'
import type { VoerkaI18nScope, VoerkaI18nEventSubscriber } from '@voerkai18n/runtime'

class I18nController implements ReactiveController {
  private host: ReactiveElement
  private scope: VoerkaI18nScope
  private subscriber: VoerkaI18nEventSubscriber | undefined
  private originalText: string
  private translatedText: string

  constructor(host: ReactiveElement, scope: VoerkaI18nScope, text: string) {
    this.host = host
    this.scope = scope
    this.originalText = text
    this.translatedText = scope.t(text)
    host.addController(this)
  }

  hostConnected() {
    this.subscriber = this.scope.on('change', () => {
      this.translatedText = this.scope.t(this.originalText)
      this.host.requestUpdate()
    })
  }

  hostDisconnected() {
    this.subscriber?.off()
  }

  getText() {
    return this.translatedText
  }
}

export function createTranslateTransform() {
  return (scope: VoerkaI18nScope) => {
    return (text: string) => {
      return (host: ReactiveElement) => {
        const controller = new I18nController(host, scope, text)
        return controller.getText()
      }
    }
  }
}