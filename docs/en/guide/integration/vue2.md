# Vue2应用<!-- {docsify-ignore-all} -->

> This section mainly introduces how to use `VoerkaI18n` in the `Vue 2`' application.

Introducing `voerkai18n` in the `Vue 2` application to add internationalization support requires two plugins

- **@voerkai18n/vue2**

  **Vue Plugin**，Introduced during the initialization of the `Vue` application, providing functions such as accessing the `current language`, `switching languages`, and `automatic updates`.

- **voerkai18n-loader**

  **WebPack loader**,Configured in `vue.config.js` to implement functions such as `automatic text mapping` and `automatic import t functions`


## Step 1: Basic 

The complete engineering process to `Vue` enable `VoerkaI18n` internationalization for an application is as follows:

- Call `voerkai18n init` Initialize Multilingual Engineering
- Call to `voerkai18n extract` extract the text to be translated
- Invoked `voerkai18n translate` for automatic or human translation
- Invoke `voerkai18n compile` compiled language packs
- Introduction `@voerkai18n/vue2` and `voerkai18n-loader` plug-in in the `Vue` application
- Translate using `t` functions in the source code

The complete engineering process is described in [here](../intro/get-started), and the following is a brief description of how it is used `VoerkaI18n` in the `Vue` application.

##  Step 1: use `voerkai18n-loader`

`voerkai18n-loader` is a `webpack loader`,Its function is to：

- can convert the `t ("xxxxx")` in the source code into the form of `t ("<number>")` based on the `idMap.(js|ts)` mapping file, thereby eliminating redundant translation content.
- Implement the function of automatically importing the't 'function, saving the trouble of manual import.

1. **insall**：

```bash
> pnpm add -D voerkai18n-loader
> yarn add -D voerkai18n-loader
> npm install -D voerkai18n-loader
```

2. **configuration**：

```javascript
//  in vue.config.js 

const path = require('path')
module.exports = {
    configureWebpack: {
        module:{
            rules:[
                {
                    test: [/^$/, /\.(js|vue)$/],
                    use:[
                        {
                            loader:"voerkai18n-loader", 
                            options: {
                               autoImport:false,        // Automatically import t function
                               debug:true,              // Output some debugging information
                            }
                        }
                    ],                            
                    include: path.join(__dirname, 'src'),    // Only handle files in the src directory
                    enforce:'pre',
                } 
            ]
        }
      }
}
 
```
- `voerkai18n-loader`Plugins only function during the development and construction stages. In fact, if you don't care about the redundancy of text content, you can still work normally without installing this plugin.

- `voerkai18n-loader` [detial](../tools/webpack)。

## Step 3 ：use `@voerkai18n/vue2`


```typescript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { i18nScope} from "./languages"
import { i18nPlugin } from "@voerkai18n/vue2"

Vue.config.productionTip = false

Vue.use(i18nPlugin,{i18nScope})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

After enabling the `@voerkai18n/vue2` plugin, you can achieve

-Automatically inject the `t` function into the `Vue` instance, allowing for direct translation using the `t` function in the `Vue` application.
-Automatically re render the 'Vue' application when switching languages

## Step 4: Use the `t` translation function

- **in `<template>`**

After enabling the installation of the `@voerkai18n/vue2` plugin, the `t` function can be directly used for translation in the `template` without the need for additional configuration


- **in `<script>`**

Just use the `import {t} from 'languages'` imported `t` function for translation.

##  Step 5: Switch languages

```vue
<script>
import { i18nMixin } from "@voerkai18n/vue2"
 
export default {
    mixins: [i18nMixin],
   //......
}
</script>  
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ t("xxxxx")}} </h1>
  <h2>{{ t("xxxxx")}} </h2>
  <h5>activeLanguage{{ activeLanguage }}</h5>
  <button v-for="lng of languages" 
    @click="changeLangauge(lng.name)"  
    >{{ lng.title }}</button>
</template>
```

`I18nMixin` has mixed the following properties and methods in the current component:

- `languages`:Return to the list of supported of languages.
- `activeLanguage`：Return to the current activation default language.
- `changeLanguage(language)`：Switch languages。

## brief summary

- You can directly use the `t` function in the `<template></template>`。
- The regular `js/ts` file requires manual import of the `t` function from the `languages` folder.
- Use `i18nMixin` to traverse supported languages and switch languages.
- Automatically re render components when switching languages。 
- For a complete example, please refer to [here](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue2-js)

