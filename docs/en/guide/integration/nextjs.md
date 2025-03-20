# Next.js Integration

## Overview

`@voerkai18n/nextjs` provides integration support for Next.js.

## Installation

```shell
npm install @voerkai18n/nextjs
yarn add @voerkai18n/nextjs
pnpm add @voerkai18n/nextjs
```

## Basic Usage

### Step 1: Configure Provider

```tsx
// pages/_app.tsx
import { VoerkaI18nProvider } from '@voerkai18n/nextjs'
import { i18nScope } from "../languages"

export default function App({ Component, pageProps }) {
    return (
        <VoerkaI18nProvider scope={i18nScope}>
            <Component {...pageProps} />
        </VoerkaI18nProvider>
    )
}
```

### Step 2: Use Translation Function

```tsx
import { t } from "../languages"

export default function MyComponent(){
    return (
        <div>
            <p>{t("你好")}</p>
            <p>{t("你好{name}",{name:"tom"})}</p>
            <p>{t("你好{}","tom")}</p>
            <p>{t("你好{name}",()=>({name:"tom"}))}</p>
        </div>
    )
}
```

### Step 3: Use Translation Component

```tsx
import { Translate } from "../languages"

export default function MyComponent(){
    return (
        <div>
            <Translate message="你好" />
            <Translate message="你好{name}" vars={{name:'tom'}} />
            <Translate message="你好{}" vars="tom" />
            <Translate message="你好{name}" vars={()=>({name:'tom'})} />
        </div>
    )
}
```

## Hooks

`@voerkai18n/nextjs` provides several hooks for internationalization:

### useTranslate

Returns a translation function that automatically triggers re-rendering when switching languages.

```tsx
import { useTranslate } from '@voerkai18n/nextjs'

export default function MyComponent(){
    const t = useTranslate()
    return (
        <div>
            <p>{t("你好")}</p>
        </div>
    )
}
```

### useLanguage

Returns the current language and language switching function.

```tsx
import { useLanguage } from '@voerkai18n/nextjs'

export default function MyComponent(){
    const [language,change] = useLanguage()
    return (
        <div>
            <p>Current Language: {language}</p>
            <button onClick={()=>change("en-US")}>Switch to English</button>
        </div>
    )
}
```

### useI18n

Returns the current i18nScope instance.

```tsx
import { useI18n } from '@voerkai18n/nextjs'

export default function MyComponent(){
    const i18n = useI18n()
    return (
        <div>
            <p>Current Language: {i18n.activeLanguage}</p>
            <button onClick={()=>i18n.change("en-US")}>Switch to English</button>
        </div>
    )
}
```

## Provider Options

The `VoerkaI18nProvider` component supports the following options:

```ts
interface VoerkaI18nProviderProps{
    scope?: VoerkaI18nScope                // i18nScope instance
    injectLangAttr?: boolean | string      // Whether to inject language attribute to html element
    debug?: boolean                        // Whether to enable debug mode
    children?: React.ReactNode             // Child components
}
```

## Notes

1. Must wrap the application with `VoerkaI18nProvider`
2. Use `useTranslate` hook to get a translation function that automatically triggers re-rendering
3. The `Translate` component automatically updates when switching languages
4. The `t` function returns a string and needs to be manually updated when switching languages
5. Next.js integration is based on React integration, so the usage is similar
