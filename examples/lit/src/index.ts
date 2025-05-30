import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { withI18n, useI18n } from '@voerkai18n/lit'
import { i18nScope } from './languages'

// 使用高阶组件方式
@customElement('i18n-demo')
class I18nDemo extends withI18n(LitElement, i18nScope) {
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
    }
    .current-language {
      margin-bottom: 16px;
      font-weight: bold;
    }
    .translation-demo {
      border: 1px solid #ccc;
      padding: 16px;
      margin-bottom: 16px;
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
      
      <lit-translate
        message="这是使用组件的翻译示例"
      ></lit-translate>
    `
  }
}

// 使用 hooks 方式
@customElement('i18n-hooks-demo')
class I18nHooksDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #eee;
      margin-top: 16px;
    }
  `

  private i18n = useI18n(this)

  render() {
    return html`
      <h3>${this.i18n.t('使用 Hooks API')}</h3>
      <p>${this.i18n.t('当前语言')}: ${this.i18n.activeLanguage}</p>
      <p>${this.i18n.t('这是使用 hooks API 的示例')}</p>
    `
  }
}