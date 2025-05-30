import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { withI18n } from '@voerkai18n/lit'
import { i18nScope } from '../languages'

@customElement('i18n-demo')
export class I18nDemo extends withI18n(LitElement, i18nScope) {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
    .language-switcher {
      margin-bottom: 16px;
    }
    button {
      margin-right: 8px;
      padding: 8px 16px;
      cursor: pointer;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button:hover {
      background-color: #e0e0e0;
    }
    button:disabled {
      background-color: #4a90e2;
      color: white;
      border-color: #4a90e2;
    }
    .current-language {
      margin-bottom: 16px;
      font-weight: bold;
    }
    .translation-demo {
      border: 1px solid #ccc;
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 4px;
    }
    h3 {
      margin-top: 0;
      color: #333;
    }
  `

  render() {
    return html`
      <div class="language-switcher">
        <h2>${this.t('语言切换')}</h2>
        ${this.languages.map(
          (lang) => html`
            <button
              @click=${() => this.setLanguage(lang.name)}
              ?disabled=${this.lang === lang.name}
            >
              ${lang.label}
            </button>
          `
        )}
      </div>
      
      <div class="current-language">
        ${this.t('当前语言')}: ${this.lang}
      </div>
      
      <div class="translation-demo">
        <h3>${this.t('基本翻译')}</h3>
        <p>${this.t('这是一个使用 Lit 和 voerka-i18n 的示例')}</p>
        <p>${this.t('你可以切换语言来查看翻译效果')}</p>
      </div>
      
      <div class="translation-demo">
        <h3>${this.t('带参数的翻译')}</h3>
        <p>${this.t('你好，{name}', { name: 'Lit' })}</p>
      </div>
      
      <div class="translation-demo">
        <h3>${this.t('组件翻译')}</h3>
        <lit-translate
          message="这是使用组件的翻译示例"
        ></lit-translate>
      </div>

      <div class="translation-demo">
        <h3>${this.t('段落翻译')}</h3>
        <div>${this.paragraphs.welcome || this.t('欢迎使用 VoerkaI18n')}</div>
      </div>
    `
  }
}