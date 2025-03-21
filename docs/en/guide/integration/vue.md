# Vue 3

> This section introduces how to use `VoerkaI18n` in `Vue 3` applications.

When creating a `Vue 3` application, we typically use `Vite` or `Vue CLI` to create the project. To add internationalization to a `Vue 3` application using `voerkai18n`, two plugins are needed to simplify the implementation.

- **@voerkai18n/vue**

  A **Vue plugin** that is imported when initializing the `Vue` application, providing features such as accessing the `current language`, `switching languages`, and `automatic updates`.

- **@voerkai18n/plugins**

  A **compilation plugin** configured in `vite.config.js`, used to implement features like `automatic text mapping`, refer to [IdMap](../advanced/idMap)

## Usage

### Step 1: Install Dependencies

First, install `@voerkai18n/cli` globally.

::: code-group

```bash [npm]
npm install -g @voerkai18n/cli
```

```bash [yarn]
yarn global add @voerkai18n/cli
```
```bash [pnpm]
pnpm  add -g @voerkai18n/cli
```
:::

### Step 2: Initialize

Next, initialize the project using `VoerkaI18n init`.

```bash
> voerkai18n init
```
After initialization, a language working directory will be created, by default at `src/languages`. The folder structure is as follows:

<lite-tree>
myapp
    src
        languages
            messages/             
            paragraphs/             
            translates/             // Content that needs translation
              messages/             // Extracted content for translation                
              paragraphs/           // Extracted paragraphs for translation
            prompts/                // Prompts for AI translation
            api.json                // API interface
            component.ts            // Translation component
            index.ts                //! Entry file       
            settings.json           // Configuration file
            storage.ts              // Storage management
            loader.ts               // Loader
            transform.ts            // Translation transform
            formatters.json         // Formatter configuration            
    package.json
    index.ts    
</lite-tree>


### Step 3: Enable Vue Support

Next, use `voerkai18n apply` to enable Vue support.

```bash
> voerkai18n apply
```

After executing the `voerkai18n apply` command and selecting `Vue3`, the following operations will be performed:

- Install `@voerkai18n/vue`
- Update relevant files in `languages`, mainly `languages/component.{ts|js}`.


### Step 4: Configure Application

Modify the `main.ts` file to import `@voerkai18n/vue`.

```ts
import { i18nScope } from "./languages"
import { router } from "./router"
import { i18nPlugin } from '@voerkai18n/vue'

i18nScope.ready(()=>{
    createApp(App)
      .use(i18nPlugin,{         // [!code ++]
        i18nScope               // [!code ++]
      })                        // [!code ++]
      .use(router)
      .mount('#app')
})

```

The `i18nPlugin` plugin provides the following for `Vue components`:

- Global component instance `t` function
- Global `Translate` component
- Reactive support for the `$t` function

### Step 5: Configure Plugin

Modify the `vite.config.{ts|js}` file to import `@voerkai18n/plugins/vite`.

```ts
import i18nPlugin from '@voerkai18n/plugins/vite'

module.exports = {
    configureWebpack: {
      plugins: [
        vue(),
        i18nPlugin()
      ] 
    }
  }
```      

- The `@voerkai18n/plugins/vite` plugin provides `automatic text mapping` functionality for `Vue` applications.


### Step 6: Translate Content

Now you can use the `t` function and `Translate` component directly in Vue components for translation.

```vue
<template>
	<div>
        <h1>
          <Translate message="请输入用户名称"/>
        </h1>
        <div>
            <span>
              <Translate message="用户名:" />
            </span>
            <input type="text" :placeholder="t('邮件/手机号码/帐号')"/>
            <span>
              <Translate message="密码:" />
            </span>
            <input type="password" :placeholder="t('至少6位的密码')"/>            
            <Translate id="notice">
              大段文本内容
            </Translate>
    	</div>            
    </div>
        <button @click="login">
          <Translate message="登录" />
        </button>
    </div>
</template>
```
:::warning Note
- Use the `t` function and `Translate` component to wrap content that needs translation.
- For large blocks of text, use the `Translate` component to wrap them.
- The `t` function and `Translate` are automatically injected into components by the `@voerkai18n/vue` plugin, no additional import needed.
:::

### Step 7: Switch Languages

Import `useVoerkaI18n` to implement language switching functionality.

```vue
<template>
  <div>
    <button  
      v-for="(lang, index) in languages"
      @click="i18nScope.change(lang.name)"
      type="button"       
      :class="{'red-text': activeLanguage === lang.name }"
      >  
      {{ lang.name }}     
      </button>
  </div>
</template>

<script setup>
import { i18nScope} from './languages';
import { useVoerkaI18n } from '@voerkai18n/vue';   
const { activeLanguage,languages } =  useVoerkaI18n(i18nScope)
</script>
```
 

## Guide

### Manual Configuration

While `voerkai18n apply` handles automatic Vue application support configuration, you can also configure it manually.

- **Edit `languages/component.{ts|js}` file**

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```

- **Edit `languages/transform.{ts|js}` file**

```ts
import { createTranslateTransform,type VueTransformResultType } from "@voerkai18n/vue"
export const transform = createTranslateTransform()
export type TransformResultType = VueTransformResultType
```

### Enable Plugin

```ts {6,10}
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18nScope } from "./languages"
import { router } from "./router"
import { i18nPlugin } from '@voerkai18n/vue'

i18nScope.ready(()=>{
    createApp(App)
        .use(i18nPlugin,{i18nScope})
        .use(router)
        .mount('#app')
})
```

**Plugin Parameters:**
| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` |  `VoerkaI18nScope` | None | Language scope |


**After enabling the `i18nPlugin` plugin**

- Provides a global `t` function that can be accessed globally. This means you **don't need to import the `t` function in each component separately**
- Provides a global `$activeLangauge` property representing the currently active language, which is a `ref` object that automatically updates when switching languages.
- Provides a global `Translate` component, allowing you to use the `Translate` component directly in components without additional imports.

### Translation Component

After using `voerkai18n apply -f vue`, `languages/component.ts` will be updated to export a `Vue 3` component that automatically re-renders when switching languages. You can also manually update `languages/component.ts` with the following content:

```ts
import { 
    createTranslateComponent, 
    type VueTranslateComponentType 
} from "@voerkai18n/vue";
export const component = createTranslateComponent(<options>) 
export type TranslateComponentType = VueTranslateComponentType
```

#### Creation Parameters

The `createTranslateComponent` method is used to build Vue components, with the following type:

```ts
type CreateTranslateComponentOptions = {
    default?: string
    tagName?: string 
    class?  : string
    style?  : string
    loading?: Component | boolean | string
}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `default` |  `string` |  | Default display text |
| `tagName` |  `string` | `div` | Tag name |
| `class` |  `string` |  | CSS class name |
| `style` |  `string` |  | CSS style |
| `loading` |  `Component` | Whether to show loading |


- The `loading` parameter provides a loading `Vue` component shown when loading remote text. The loading component is only effective when the `message` parameter is a `Function` or when a `paragraph id` is provided.

#### Component Parameters

```ts
type VoerkaI18nTranslateProps<
  Options extends VoerkaI18nTranslateOptions = VoerkaI18nTranslateOptions,
  Children = any> = {
    id?       : string;
    message?  : VoerkaI18nToBeTranslatedMessage;
    vars?     : VoerkaI18nTranslateVars;
    default?  : any;
    tag?      : string;
    options?  : Options;
    children? : Children;
    style?    : any;
    className?: string;
}
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `id` |  `string` |  | Optional, paragraph ID |
| `message` |  `VoerkaI18nToBeTranslatedMessage` |  | Optional, text to translate |
| `vars` |  `VoerkaI18nTranslateVars` |  | Optional, interpolation variables |
| `default` |  `any` |  | Optional, default text |
| `tag` |  `string` |  | Optional, tag name |
| `options` |  `Options` |  | Optional, options |
| `children` |  `Children` |  | Optional, child components |
| `style` |  `any` |  | Optional, style |
| `className` |  `string` |  | Optional, CSS class name |

- **Choose either `id` or `message`, with `id` having higher priority than `message`**
 
### Translation Transform

After using `voerkai18n apply -f vue`, translation transform will be automatically configured. You can also manually update `languages/transform.ts` with the following content:

```ts
import { createTranslateTransform,type VueTransformResultType } from "@voerkai18n/vue"
export const transform = createTranslateTransform()
export type TransformResultType = VueTransformResultType 
```

- For detailed explanation about translation transform, please refer to [Translation Transform](../advanced/transform)
 
### useVoerkaI18n

`useVoerkaI18n` is a `Vue3` `Composition API` function used to get the `VoerkaI18n` instance.

```ts
import { useVoerkaI18n } from "@voerkai18n/vue"

const { 
  t, 
  activeLanguage,
  defaultLanguage, 
  changeLanguage,
  scope,
  manager
} = useVoerkaI18n()
```

You can use `useVoerkaI18n` to render language switching components:

```vue
<template>
  <div>
    <button  
      v-for="(lang, index) in languages"
      @click="i18nScope.change(lang.name)"
      type="button"       
      :class="{'red-text': activeLanguage === lang.name }"
      >  
      {{ lang.name }}     
      </button>
  </div>
</template>

<script setup>
import { i18nScope} from './languages';
import { useVoerkaI18n } from '@voerkai18n/vue';   
const { activeLanguage,languages } =  useVoerkaI18n(i18nScope)
</script>
```

### Loading State

When using the translation component's [dynamic translation](../use/translate), you can show a loading state during translation.

You can provide a loading state as follows:

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue";
import Loading from './Loading.vue'  //! Your loading component
export const component = createTranslateComponent({
  loading:Loading   //!
})
export type TranslateComponentType = VueTranslateComponentType
```

### Language Switch Refresh Trap

When using `VoerkaI18n`, a common issue for beginners is that Vue components don't automatically refresh after switching languages.

For example, the following code doesn't automatically refresh when switching languages:

```vue
<template>
  <div>  
    <h1 :title="t('你好')">  
    <div> {{ title }} </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { t } from '../languages'; 
const title = ref(t('你好'))
<script>

```

**Why doesn't the above code automatically refresh when switching languages?**

Because the `setup` function of Vue components only executes once during component initialization, when calling the `t` function in the `setup` function, the result of the `t` function is fixed and won't refresh with language changes.

**How to solve this?**

To solve this issue, you need to **fully understand Vue's reactivity mechanism**:

- Make the translation result reactive
- Update the translation result when language changes

The key is to **make the translation result reactive** so that Vue will automatically update the view when the language changes.

You might think of using reactive APIs like `ref` to wrap the translation result to achieve automatic refresh.

```vue
<template>
  <div>  
    <div :title="t('你好')"> {{ title }} </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { t, i18nScope } from '../languages';

const title = ref(t('你好'))  // [!code ++]

let subscriber
onMounted(()=>{
  subscriber = i18nScope.on('change',()=>{
    title.value = t('你好')
  })
})
onUnmounted(()=>{
  subscriber.off()
})
<script>
```

When the language changes, `i18nScope` triggers a `change` event. We subscribe to the `change` event in the `onMounted` hook, and when the language changes, we update the `title` value. Since `title` is reactive, this achieves automatic refresh.

Obviously, this approach is cumbersome. For this scenario, `VoerkaI18n` provides a `translation transform` mechanism to simplify this process, refer to [Translation Transform](../advanced/transform).

**After introducing the `translation transform` mechanism, the above code can be simplified to:**

```vue
<template>
  <div>  
    <div :title="t('你好')"> {{ title }} </div>
  </div>
</template>
<script setup>
import { $t } from '../languages';
const title = $t('你好')
<script>
```

- **The `$t` function returns a reactive value, so Vue will automatically refresh the view when the language changes.**
- The `$t` function converts the translation result into reactive data, so Vue will automatically refresh the view when the language changes.
- The `$t` function needs to work with `@voerkai18n/vue`.


:::warning Note
In fact, this issue exists in all reactive frameworks. Once you understand the reactivity mechanism, you can solve this problem well.
:::


## Example

- For a complete example, please see [here](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3)
