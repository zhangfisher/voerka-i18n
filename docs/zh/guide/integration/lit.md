# lit

`lit`是一个开源的`Web Components`框架，用于来创建可重用的`Web Components`组件。

`@voerkai18n/lit`用于将`VoerkaI18n`集成到`lit`中，感谢[CoderMonkie](https://github.com/CoderMonkie)的贡献。

## 使用方法

`VoerkaI18n`在`Lit`中提供了两种集成方式：

### 使用高阶组件 (HOC)

```ts
import { withI18n } from '@voerkai18n/lit';

class MyComponent extends withI18n(LitElement) {
  render() {
    return html`<div>${this.t('Hello World')}</div>`;
  }
}
```
### 使用 Hooks API

```ts
import { useI18n } from '@voerkai18n/lit';

class MyComponent extends LitElement {
  i18n = useI18n(this);
  
  render() {
    return html`<div>${this.i18n.t('Hello World')}</div>`;
  }
}
```

## 示例

```ts
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { withI18n, useI18n } from '@voerkai18n/lit'
import { i18nScope } from './languages'

// 使用高阶组件方式
@customElement('i18n-demo')
class I18nDemo extends withI18n(LitElement, i18nScope) {
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
  private i18n = useI18n(this)
  render() {
    return html`
      <h3>${this.i18n.t('使用 Hooks API')}</h3>
      <p>${this.i18n.t('当前语言')}: ${this.i18n.activeLanguage}</p>
      <p>${this.i18n.t('这是使用 hooks API 的示例')}</p>
    `
  }
}
```

完整的示例请参考[这里](https://github.com/voerkai18n/voerka-i18n/tree/main/examples/lit)。