# Translation Function

## Overview

The translation function `t` is provided by default for translation.

```ts
export type VoerkaI18nTranslate =(
        message:string, 
        vars?:VoerkaI18nTranslateVars, 
        options?:VoerkaI18nTranslateOptions
    )=>string
```

**The `t` function can be imported from the `languages/index.(js|ts)` file.**

```javascript 
// Import translation function from current language pack folder's index.js
import { t } from "<myapp>/languages"

// Without interpolation variables
t("中华人民共和国")

// Position interpolation variables
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",1949,"北京")

// When there are only two parameters and the second parameter is of type [], automatically expand the first parameter for position interpolation
t("中华人民共和国成立于{year}年，首都{capital}",[1949,"北京"]) 
 
// When there are only two parameters and the second parameter is of type {}, enable dictionary interpolation variables
t("中华人民共和国成立于{year}年，首都{capital}",{year:1949,capital:"北京"})

// Interpolation variables can be synchronous functions, automatically called during interpolation
t("中华人民共和国成立于{year}年，首都{capital}",()=>1949,"北京")

// Enable formatters for interpolation variables
t("中华人民共和国成立于{birthday | year}年",{birthday:new Date()})
```

## Special Notes

- Don't use JavaScript template strings to generate translation content, like t(`我是中国人，我喜欢%{car}`) is invalid.
- The `t` function is a regular function that only needs an execution environment to perform translation, so it can be used in any framework like `React/Vue/Solid/Svelte` for translation.
- The `t` function supports an interpolation variable mechanism for content that needs translation, which can be used to implement plural and other mechanisms, see [Interpolation Variables](./interpolation).

## Common Misconceptions for Beginners

:::warning
The `t` function is just a regular JS function and won't automatically execute when switching languages.
:::

```vue
<template>
    <div>
        <p>{{ t("你好") }}</p>
        <button @click="i18nScope.change('en-US')">Switch Language</button>
    </div>
</template>
<script setup>
import { t,i18nScope } from "<myapp>/languages"
</script>
```

Taking the above `Vue` component as an example, when clicking the `Switch Language` button, the `t` function won't automatically execute because it's just a regular function, nothing magical.

**So how do we make the t function re-execute?**

Essentially, when switching languages, we need to re-render the component so that the `t` function will be re-executed.

Therefore, the solution is simple - just re-render the component after switching languages.

```vue {16}
<template>
    <div>
        <p>{{ t("你好") }}</p>
        <button 
            @click="i18nScope.change('en-US')">
            Switch Language
        </button>
    </div>
</template>
<script setup>
import { t:tt,i18nScope } from "<myapp>/languages"
import { ref } from "vue"
const render = ref(0)

const t = (message:string,vars?:VoerkaI18nTranslateVars,options?:VoerkaI18nTranslateOptions)=>{
    render.value  // Depends on render's value, component will re-render when render's value changes
    return tt(message,vars,options)
}

i18nScope.on("change",()=>{
    render.value++
})
</script>
```

This way, when switching languages, the value of `render` will change, triggering the component to re-render, and the `t` function will be re-executed, achieving language switching.

The `t` function is the basic translation function, and different frontend frameworks provide corresponding libraries to simplify this process, including `vue/vue2/svelte/nextjs/...` etc.

:::warning Note
In actual applications, `VoerkaI18n` provides integration libraries for frameworks like `React/Vue/Svelte`, which can be used directly to simplify automatic updates during language switching.
:::
