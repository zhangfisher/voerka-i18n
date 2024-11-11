# Vue application <!-- {docsify-ignore-all} -->

> This section focuses on how to use `VoerkaI18n` it in an `Vue 3` application.

The creation `Vue 3` application generally uses `Vite` or `Vue Cli` to create the project. The addition of an internationalized application introduced `voerkai18n` in an `Vue3` application requires two plug-ins to simplify the application.

- **@voerkai18n/vue**

  **Vue Plugin**? Introduced when initializing `Vue` the application, providing access to `current language`, `change language` and other functions.

- **@voerkai18n/vite**

  **Vite Plug-in**, `vite.config.js` configured in, used to implement `auto text map` `t function auto import` functions such as and.

  
 `@voerkai18n/vue` And `@voerkai18n/vite` after the two plug-ins are installed and configured, the multi-language `t` function can be used in the `Vue` file.

## Step 1: Basic

The complete engineering process to `Vue` enable `VoerkaI18n` internationalization for an application is as follows:

- Call `voerkai18n init` Initialize Multilingual Engineering
- Call to `voerkai18n extract` extract the text to be translated
- Invoked `voerkai18n translate` for automatic or human translation
- Invoke `voerkai18n compile` compiled language packs
- Introduction `@voerkai18n/vue` and `@voerkai18n/vite` plug-in in the `Vue` application
- Translate using `t` functions in the source code

The complete engineering process is described in [here](../intro/get-started), and the following is a brief description of how it is used `VoerkaI18n` in the `Vue` application.

## Step 2: Enable `@voerkai18n/vite` the plug-in

 `@voerkai18n/vite` Plug-in functions are:

- According to `idMap.ts` the mapping file, the source code can be `t("xxxxx")` converted into `t("<nunmber>")` the form of, thus eliminating the redundant content of the translated content.
- Realize the function of automatic import `t` function, save the trouble of manual import.

 `@voerkai18n/vite` Plug-in installation is as simple as adding the following to `vite.config.(ts|js)`:

```javascript

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"
 
export default defineConfig({
  plugins: [    
    Inspect(),                // Option   
    Voerkai18nPlugin(),       // add it
    vue()
  ],
})

```
-  `@voerkai18n/vite` Plug-ins work only during the development and construction phases. In fact, if you don't care about the redundancy of text content, you can work fine without installing this plug-in.
-  `vite-plugin-inspect` It is only used for debugging. You can `http://localhost:3000/__inspect/` check whether the automatic import and `idMap.ts` mapping in `@voerkai18n/vite` the current project are correct for debugging in the development stage.
- The integrity [use](../tools/vite) of the `@voerkai18n/vite` plug-in.
## Step 3: Configure `@voerkai18n/vue` the plug-in

 `@voerkai18n/vue` Plug-ins are used to automatically inject `t` functions, switch languages, and so on.


The installation method is as follows:

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18nPlugin from '@voerkai18n/vue'
import { i18nScope } from './languages'

i18nScope.ready(()=>{
  const app = createApp(App)
  app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
      i18nScope
  })
  app.mount('#app')
}
```

 `@voerkai18n/vue` Plugins essentially automatically mix in `t` functions **for **each Vue component.

## Step 4: Use the `t` translation function

The nature of `Vue` an application use multiple languages is to call `import { t} from 'langauges` import `t` functions for translation.

```vue

<script setup> 
import { t } from "./languages"
console.log(t("Welcome to VoerkaI18n"))

</script>


// Directly use without importing it
<script>
export default {
    data(){
        return {
            username:"",
            password:"",
            title:t("xxxx")
        }
    },
    methods:{
        login(){
            alert(t("xxxx"))
        }
    }
}
</script>

<template>
	<div>
        <h1>{{ t("please enter") }}</h1>
        <div>
            <span>{{t("Username:")}}</span><input type="text"/>
            <span>{{t("Password:")}}</span><input type="password"/>            
    	</div>            
    </div>
        <button @click="login">{{t("Login")}}</button>
    </div>
</template>
```
 
**Key:**

- Import `import { t} from "./languages"` Manually in `<script setup>`
- Functions can be used `t` directly for translation in `<script>` and `<template>`.
-  `@voerkai18n/vue` The plug-in essentially automatically mixes in `t` functions for each Vue component and automatically re-renders when the language is switched.


## Step 5: Switch languages

Plugins are introduced `@voerkai18n/vue` to enable language switching and automatic re-rendering.

```vue

<script setup lang="ts">
import { injectVoerkaI18n } from "@voerkai18n/vue"

 
const i18n = injectVoerkaI18n()
</script>

<script>
export default {
   //......
}
</script>  
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ t("xxxxxxxxxxxxxx")}} </h1>
  <h2>{{ t("xxxxxxx")}} </h2>
  <h5>default language：{{ i18n.defaultLanguage }}</h5>
  <h5>current language：{{ i18n.activeLanguage }}</h5>
  <!-- Traverse Supported Languages  -->
  <button v-for="lng of i18n.languages" 
    @click="i18n.activeLanguage = lng.name"  
    >{{ lng.title }}</button>
</template>

```
 

## Brief summary

-  `@voerkai18n/vue` Plugins provide automatically injected `t` functions for `Vue` single-file components, which can be used directly in `<script>` and `<template>`, and `<script setup>` from `language` which functions need to be imported `t` manually in.
- Normal `js/ts` files in a Vue application require you to manually import `t` functions from `language` them.
- Use `injectVoerkaI18n()` to implement the ability to traverse supported languages and switch languages.
- Components are automatically re-rendered when you switch languages.
-  `@voerkai18n/vue` Plugins can only be used in `Vue 3`.
- For a example, see [here](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3-ts)

