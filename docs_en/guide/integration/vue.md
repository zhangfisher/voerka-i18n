# Vue application <!-- {docsify-ignore-all} -->

> This section focuses on how to use `VoerkaI18n` it in an `Vue 3` application.

The creation `Vue 3` application generally uses `Vite` or `Vue Cli` to create the project. The addition of an internationalized application introduced `voerkai18n` in an `Vue3` application requires two plug-ins to simplify the application.

- ** @voerkai18n/vue **

  ** Vue Plugin **? Introduced when initializing `Vue` the application, providing access to `当前语言`, `切换语言`, `自动更新` and other functions.

- ** @voerkai18n/vite **

  ** Vite Plug-in **, `vite.config.js` configured in, used to implement `自动文本映射` `t函数的自动导入` functions such as and.

  
 `@voerkai18n/vue` And `@voerkai18n/vite` after the two plug-ins are installed and configured, the multi-language `t` function can be used in the `Vue` file.

## Step 1: Basic Process

The complete engineering process to `Vue` enable `VoerkaI18n` internationalization for an application is as follows:

- Call `voerkai18n init` Initialize Multilingual Engineering
- Call to `voerkai18n extract` extract the text to be translated
- Invoked `voerkai18n translate` for automatic or human translation
- Invoke `voerkai18n compile` compiled language packs
- Introduction `@voerkai18n/vue` and `@voerkai18n/vite` plug-in in the `Vue` application
- Translate using `t` functions in the source code

The complete engineering process is described in [工程化](../start/quick-start), and the following is a brief description of how it is used `VoerkaI18n` in the `Vue` application.

## Step 2: Enable `@voerkai18n/vite` the plug-in

 `@voerkai18n/vite` Plug-in functions are:

- According to `idMap.ts` the mapping file, the source code can be `t("xxxxx")` converted into `t("<数字>")` the form of, thus eliminating the redundant content of the translated content.
- Realize the function of automatic import `t` function, save the trouble of manual import.

 `@voerkai18n/vite` Plug-in installation is as simple as adding the following to `vite.config.(ts|js)`:

```javascript

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"
 
export default defineConfig({
  plugins: [    
    Inspect(),                // 可选    
    Voerkai18nPlugin(),       // 新增加
    vue()
  ],
})

```
-  `@voerkai18n/vite` Plug-ins work only during the development and construction phases. In fact, if you don't care about the redundancy of text content, you can work fine without installing this plug-in.
-  `vite-plugin-inspect` It is only used for debugging. You can `http://localhost:3000/__inspect/` check whether the automatic import and `idMap.ts` mapping in `@voerkai18n/vite` the current project are correct for debugging in the development stage.
- The integrity [使用说明](/guide/tools/vite) of the `@voerkai18n/vite` plug-in.
## Step 3: Configure `@voerkai18n/vue` the plug-in

 `@voerkai18n/vue` Plug-ins are used to automatically inject `t` functions, switch languages, and so on.


The installation method is as follows:

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入插件
import i18nPlugin from '@voerkai18n/vue'
// 导入当前作用域
import { i18nScope } from './languages'

const app = createApp(App)
// 应用插件
app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
    i18nScope
})
app.mount('#app')

```

 `@voerkai18n/vue` Plugins essentially automatically mix in `t` functions ** for ** each Vue component.

## Step 4: Use the `t` translation function

The nature of `Vue` an application use multiple languages is to call `import { t} from 'langauges` import `t` functions for translation.

```vue

<script setup>
// 手动导入t函数
// 如果启用了@voerkai18n/vite插件，则可以省略此行实现自动导入
import { t } from "./languages"
console.log(t("Welcome to VoerkaI18n"))

</script>


// 直接使用t函数，不需要导入
<script>
export default {
    data(){
        return {
            username:"",
            password:"",
            title:t("认证")
        }
    },
    methods:{
        login(){
            alert(t("登录"))
        }
    }
}
</script>
// 直接使用
<template>
	<div>
        <h1>{{ t("请输入用户名称") }}</h1>
        <div>
            <span>{{t("用户名:")}}</span><input type="text" :placeholder="t('邮件/手机号码/帐号')"/>
            <span>{{t("密码:")}}</span><input type="password" :placeholder="t('至少6位的密码')"/>            
    	</div>            
    </div>
        <button @click="login">{{t("登录")}}</button>
    </div>
</template>
```
 
** Key **
- Import `import { t} from "./languages"` Manually in `<script setup>`
- Functions can be used `t` directly for translation in `<script>` and `<template>`.
-  `@voerkai18n/vue` The plug-in essentially automatically mixes in `t` functions for each Vue component and automatically re-renders when the language is switched.


## Step 5: Switch languages

Plugins are introduced `@voerkai18n/vue` to enable language switching and automatic re-rendering.

```vue

<script setup lang="ts">
import { injectVoerkaI18n } from "@voerkai18n/vue"

// 提供一个i18n对象
const i18n = injectVoerkaI18n()
</script>

<script>
export default {
   //......
}
</script>  
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ t("中华人民共和国")}} </h1>
  <h2>{{ t("迎接中华民族的伟大复兴")}} </h2>
  <h5>默认语言：{{ i18n.defaultLanguage }}</h5>
  <h5>当前语言：{{ i18n.activeLanguage }}</h5>
  <!-- 遍历支持的语言  -->
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
- For a complete example, see [这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3-ts)

