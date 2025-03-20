# Translation Transform

`VoerkaI18n` provides a translation transform mechanism to **transform translation results** into other forms, such as Vue's `ref`, SolidJS's `solid`, etc., to meet the needs of reactive rendering.

:::warning Important
The `$t` function replaces the `t` function to return a reactive translation result.
:::

## Usage

### Step 1: Create Transform Function

Create a `transform.ts` file in the `src/languages` directory to store the translation transform function.

```ts {4}
export transform = (scope:VoerkaI18nScope) => {     
        // result is the return value of the t function   
        return (result:string)=>{             
            // return <transformed result>
        }
    }    
```

### Step 2: Enable Transform Function

Modify the `src/languages/index.{js|ts}` file to enable the transform function.

```ts {1,4,7}
import { transform } from "./transform"

export const i18nScope = new VoerkaI18nScope({        
    transform,    // Translation transform
    // ...
})
export const $t = i18nScope.$t
```

:::warning Note
When using the `$t` function, it first calls the `t` function and then passes the result to the `transform` function. `$t` is equivalent to `transform(t(...))`.
:::

### Step 3: Use $t Translation Function

The `$t` function can be used instead of the `t` function in certain component scenarios.

The key is to understand which scenarios need to use the `$t` function and how to use it. Follow these principles:

- **Scenarios**: Only use the `$t` function in scenarios that require reactive rendering.
- Different reactive frameworks use different methods, such as Vue's `ref`, SolidJS's `signal`, etc.
- Generally, the `$t` function is used to return a reactive translation result, such as `Vue/ref`, `Solid/signal`, etc.

:::warning Important
Different reactive frameworks have different `transform` implementations. But they all uniformly export the `$t` function.
:::

## How It Works

To better understand how translation transform works, let's take Vue as an example to fully understand the working principles and usage of `translation transform`.

### Analyzing the Problem

First, let's look at a simple Vue component:

```vue
<template>
    <div>
        <p>{{ title }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { i18nScope } from 'languages'
const title = ref(i18nScope.t("title"))
</script>
```

In the code above, we use the `ref` function to create a reactive `title` variable and use the `t` function to translate `title`.

Beginners might think that when switching languages, Vue will automatically re-render the `title` component.

However, this is not the case because although `title` is a `ref` variable, switching languages doesn't modify the value of `ref(title)`, so it won't trigger Vue's re-rendering. Therefore, the above code cannot achieve automatic re-rendering when switching languages.

**How to solve this problem? This is where the `$t` function comes in.**

### Reactive Switching

According to the above analysis, **when switching languages, the value of `ref(title)` is not modified**, so it won't trigger Vue's re-rendering.

Therefore, to solve this problem, **we need to update the `ref(title)` value when switching languages, which will cause the Vue component to re-render.**

The solution becomes obvious - we need to respond to the `language switch` event.

```vue
<template>
    <div>
        <p>{{ title }}</p>
    </div>
</template>
<script setup>
import { ref, onMount } from 'vue'
import { i18nScope } from './languages' 

const title = ref(i18nScope.t("title"))

let subscriber
onMounted(()=>{
  subscriber = i18nScope.on('change',()=>{
    title.value = t('你好')
  })
})
onUnmounted(()=>{
  subscriber.off()
}) 

</script>
```

**Explanation:**

1. Subscribe to the `i18nScope`'s `change` event when the component is `onMounted`.
2. Update the `title` value in the `change` event to trigger Vue's re-rendering.
3. Unsubscribe from the `i18nScope`'s `change` event when the component is `onUnmounted`.

:::warning Important
Combining the reactive mechanism with language switch events enables automatic component re-rendering when switching languages.
:::

### Introducing Translation Transform

Considering that similar scenarios will appear in many reactive frameworks, we can abstract this logic and encapsulate it into a `transform` function to simplify this application scenario.

- Different reactive frameworks only need to implement their corresponding `transform` implementation.
- Due to different working principles and APIs of reactive frameworks, the `transform` implementations are different, but the usage of the `$t` function remains the same.
