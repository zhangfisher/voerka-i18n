import type { VoerkaI18nScope } from '@voerkai18n/runtime'
import { TranslateElement } from './translate'

export function createTranslateComponent() {
  return (scope: VoerkaI18nScope) => {
    // 确保 TranslateElement 已注册
    if (!customElements.get('lit-translate')) {
      customElements.define('lit-translate', TranslateElement)
    }
    
    return (/*anchor*/_: any, props: any) => {
      if (!props) props = {}
      props.scope = scope.id
      
      const element = document.createElement('lit-translate') as TranslateElement
      
      // 设置属性
      if (props.id) element.id = props.id
      if (props.message) element.message = props.message
      if (props.vars) element.vars = props.vars
      if (props.options) element.options = props.options
      
      return element
    }
  }
}

export type LitTranslateComponent = ReturnType<ReturnType<typeof createTranslateComponent>>