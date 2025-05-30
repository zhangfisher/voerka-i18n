import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { useI18n } from '@voerkai18n/lit'
import { i18nScope } from '../languages'

@customElement('i18n-hooks-demo')
export class I18nHooksDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #eee;
      margin-top: 16px;
      border-radius: 4px;
    }
    h3 {
      margin-top: 0;
      color: #333;
    }
  `

  private i18n = useI18n(i18nScope, this)

  render() {
    return html`
      <h3>${this.i18n.t('使用 Hooks API')}</h3>
      <p>${this.i18n.t('当前语言')}: ${this.i18n.activeLanguage}</p>
      <p>${this.i18n.t('这是使用 hooks API 的示例')}</p>
      <button @click=${() => this.i18n.changeLanguage('en-US')}>
        ${this.i18n.t('切换到英文')}
      </button>
      <button @click=${() => this.i18n.changeLanguage('zh-CN')}>
        ${this.i18n.t('切换到中文')}
      </button>
    `
  }
}