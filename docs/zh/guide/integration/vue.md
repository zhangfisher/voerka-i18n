# Vue应用

> 本节主要介绍如何在`Vue 3`应用中使用`VoerkaI18n`。

创建`Vue 3`应用一般采用`Vite`或`Vue Cli`来创建工程。在`Vue3`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **@voerkai18n/vite**

  **Vite插件**，在`vite.config.js`中配置，用来实现`自动文本映射`和`t函数的自动导入`等功能。

  
`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，安装配置好这两个插件后，就可以在`Vue`文件使用多语言`t`函数。

## 第一步：基本流程

`Vue`应用启用`VoerkaI18n`国际化功能的完整工程化流程如下：

- 调用`voerkai18n init`初始化多语言工程
- 调用`voerkai18n extract`提取要翻译的文本
- 调用`voerkai18n translate`进行自动翻译或人工翻译
- 调用`voerkai18n compile`编译语言包
- 在`Vue`应用中引入`@voerkai18n/vue`和`@voerkai18n/vite`插件
- 在源码中使用`t`函数进行翻译

完整的工程化流程请参见[工程化](../intro/get-started)，以下简要介绍如何在`Vue`应用中使用`VoerkaI18n`。

## 第二步：启用`@voerkai18n/vite`插件

`@voerkai18n/vite`插件作用是：

- 可以根据`idMap.ts`映射文件将源码中的`t("xxxxx")`转换为`t("<数字>")`的形式，从而实现消除翻译内容的冗余内容。
- 实现自动导入`t`函数的功能，省却手动导入的麻烦。

`@voerkai18n/vite`插件的安装非常简单，只需要在`vite.config.(ts|js)`中添加如下内容：

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
- `@voerkai18n/vite`插件仅在开发和构建阶段作用。事实上，如果不在乎文本内容的冗余，不安装此插件也是可以工作正常的。
- `vite-plugin-inspect`仅用于调试，可以在`http://localhost:3000/__inspect/`查看当前工程中的`@voerkai18n/vite`是否正确地进行自动导入和`idMap.ts`映射，供开发阶段进行调试使用。
- `@voerkai18n/vite`插件的完整[使用说明](../tools/vite)。
## 第三步：配置`@voerkai18n/vue`插件

`@voerkai18n/vue`插件用来自动注入`t`函数、切换语言等功能。


安装方法如下：

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入插件
import { i18nPlugin } from '@voerkai18n/vue'
// 导入当前作用域
import { i18nScope } from './languages'

// 等待i18nScope初始化完成
i18nScope.ready(()=>{
  const app = createApp(App)
  // 应用插件
  app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
      i18nScope
  })
  app.mount('#app')
})


```

`@voerkai18n/vue`插件本质上是为**每一个Vue组件自动混入`t`函数**。

## 第四步：使用`t`翻译函数

`Vue`应用使用多语言本质是调用`import { t } from 'langauges`导入的`t`函数来进行翻译。

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
 
**重点：**
- 在`<script setup>`中手动导入`import { t } from "./languages"`
- 在`<script>`和`<template>`中可以直接使用`t`函数进行翻译。
- `@voerkai18n/vue`插件本质上是为每一个Vue组件自动混入`t`函数，并在在语言切换时会自动重新渲染


## 第五步：切换语言

引入`@voerkai18n/vue`插件来实现切换语言和自动重新渲染的功能。

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
 

## 小结

- `@voerkai18n/vue`插件为`Vue`单文件组件提供自动注入`t`函数，可以在`<script>`和`<template>`中直接使用，在`<script setup>`中需要手动从`language`中导入`t`函数。
- Vue应用的中普通`js/ts`文件需要手动从`language`中导入`t`函数。
- 使用`injectVoerkaI18n()`来实现遍历支持的语言和切换语言的功能。
- 当切换语言时会自动重新渲染组件。
- `@voerkai18n/vue`插件只能用在`Vue 3`。
- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3-ts)

