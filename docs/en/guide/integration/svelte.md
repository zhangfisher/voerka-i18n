# Svelte Integration

## Overview

`@voerkai18n/svelte` provides integration support for Svelte.

## Installation

```shell
npm install @voerkai18n/svelte
yarn add @voerkai18n/svelte
pnpm add @voerkai18n/svelte
```

## Basic Usage

### Step 1: Configure Provider

```svelte
<!-- App.svelte -->
<script>
import { VoerkaI18nProvider } from '@voerkai18n/svelte'
import { i18nScope } from "./languages"
</script>

<VoerkaI18nProvider scope={i18nScope}>
    <div>
        ...
    </div>
</VoerkaI18nProvider>
```

### Step 2: Use Translation Function

```svelte
<script>
import { t } from "./languages"
</script>

<div>
    <p>{t("你好")}</p>
    <p>{t("你好{name}",{name:"tom"})}</p>
    <p>{t("你好{}","tom")}</p>
    <p>{t("你好{name}",()=>({name:"tom"}))}</p>
</div>
```

### Step 3: Use Translation Component

```svelte
<script>
import { Translate } from "./languages"
</script>

<div>
    <Translate message="你好" />
    <Translate message="你好{name}" vars={{name:'tom'}} />
    <Translate message="你好{}" vars="tom" />
    <Translate message="你好{name}" vars={()=>({name:'tom'})} />
</div>
```

## Stores

`@voerkai18n/svelte` provides several stores for internationalization:

### useTranslate

Returns a translation function that automatically triggers re-rendering when switching languages.

```svelte
<script>
import { useTranslate } from '@voerkai18n/svelte'
const t = useTranslate()
</script>

<div>
    <p>{$t("你好")}</p>
</div>
```

### useLanguage

Returns the current language and language switching function.

```svelte
<script>
import { useLanguage } from '@voerkai18n/svelte'
const [language, change] = useLanguage()
</script>

<div>
    <p>Current Language: {$language}</p>
    <button on:click={() => change("en-US")}>Switch to English</button>
</div>
```

### useI18n

Returns the current i18nScope instance.

```svelte
<script>
import { useI18n } from '@voerkai18n/svelte'
const i18n = useI18n()
</script>

<div>
    <p>Current Language: {$i18n.activeLanguage}</p>
    <button on:click={() => $i18n.change("en-US")}>Switch to English</button>
</div>
```

## Provider Options

The `VoerkaI18nProvider` component supports the following options:

```ts
interface VoerkaI18nProviderProps {
    scope?: VoerkaI18nScope                // i18nScope instance
    injectLangAttr?: boolean | string      // Whether to inject language attribute to html element
    debug?: boolean                        // Whether to enable debug mode
}
```

## Notes

1. Must wrap the application with `VoerkaI18nProvider`
2. Use `useTranslate` store to get a translation function that automatically triggers re-rendering
3. The `Translate` component automatically updates when switching languages
4. The `t` function returns a string and needs to be manually updated when switching languages
5. Svelte integration follows Svelte's store principles
