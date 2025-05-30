# @voerkai18n/lit

Lit framework support for [VoerkaI18n](https://github.com/zhangfisher/voerka-i18n).

## ✨ Features

- Lightweight `withI18n()` mixin to support language reactive updates.
- Seamlessly integrates with `LitElement` components.
- No need to manually re-render on language switch.

## 📦 Installation

```bash
npm install @voerkai18n/runtime @voerkai18n/lit
npm install -g @voerkai18n/cli
```

## 🚀 Usage

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { withI18n } from '@voerkai18n/lit';

@customElement('my-greeting')
class MyGreeting extends withI18n(LitElement) {
  render() {
    return html\`<p>\${this.t('hello')}</p>\`;
  }
}
```
