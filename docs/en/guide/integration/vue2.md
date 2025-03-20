# Vue 2 Integration

## Overview

`@voerkai18n/vue2` provides integration support for Vue 2.

## Installation

```shell
npm install @voerkai18n/vue2
yarn add @voerkai18n/vue2
pnpm add @voerkai18n/vue2
```

## Basic Usage

### Step 1: Configure Plugin

```ts
// main.ts
import Vue from 'vue'
import App from './App.vue'
import { i18nPlugin } from '@voerkai18n/vue2'
import { i18nScope } from "./languages"

i18nScope.ready(()=>{
    Vue.use(i18nPlugin,{})
    new Vue({
        render: h => h(App)
    }).$mount('#app')
})
```

### Step 2: Use Translation Function

```vue
<template>
    <div>
        <p>{{ t("你好") }}</p>
        <p>{{ t("你好{name}",{name:"tom"}) }}</p>
        <p>{{ t("你好{}","tom") }}</p>
        <p>{{ t("你好{name}",()=>({name:"tom"})) }}</p>
    </div>
</template>
<script>
import { t } from "./languages"
export default {
    name:"App"
}
</script>
```

### Step 3: Use Translation Component

```vue
<template>
    <div>
        <Translate message="你好" />
        <Translate message="你好{name}" :vars="{name:'tom'}" />
        <Translate message="你好{}" :vars="'tom'" />
        <Translate message="你好{name}" :vars="()=>({name:'tom'})" />
    </div>
</template>
<script>
import { Translate } from "./languages"
export default {
    name:"App",
    components:{
        Translate
    }
}
</script>
```

## Global Registration

You can also register the `Translate` component globally:

```ts
// main.ts
import Vue from 'vue'
import App from './App.vue'
import { i18nPlugin } from '@voerkai18n/vue2'
import { i18nScope,Translate } from "./languages"

i18nScope.ready(()=>{
    Vue.use(i18nPlugin,{})
    Vue.component("Translate",Translate)
    new Vue({
        render: h => h(App)
    }).$mount('#app')
})
```

## Plugin Options

The `i18nPlugin` plugin supports the following options:

```ts
interface VoerkaI18nVuePluginOptions{
    scope?: VoerkaI18nScope                // i18nScope instance
    injectLangAttr?: boolean | string      // Whether to inject language attribute to html element
    debug?: boolean                        // Whether to enable debug mode
}
```

## Notes

1. The `Translate` component automatically updates when switching languages
2. The `t` function returns a string and needs to be manually updated when switching languages
3. Vue 2 version does not provide the `$t` function
