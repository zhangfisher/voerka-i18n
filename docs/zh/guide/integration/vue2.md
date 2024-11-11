# Vue2应用

> 本节主要介绍如何在`Vue 2`应用中使用`VoerkaI18n`。

在`Vue 2`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue2**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **voerkai18n-loader**

  **WebPack loader**,在`vue.config.js`中配置，用来实现`自动文本映射`和`t函数的自动导入`等功能。


## 第一步：基本流程

`Vue`应用启用`VoerkaI18n`国际化功能的完整工程化流程如下：

- 调用`voerkai18n init`初始化多语言工程
- 调用`voerkai18n extract`提取要翻译的文本
- 调用`voerkai18n translate`进行自动翻译或人工翻译
- 调用`voerkai18n compile`编译语言包
- 在`Vue`应用中引入`@voerkai18n/vue`和`@voerkai18n/vite`插件
- 在源码中使用`t`函数进行翻译

完整的工程化流程请参见[工程化](../intro/get-started)，以下简要介绍如何在`Vue`应用中使用`VoerkaI18n`。

## 第二步：启用`voerkai18n-loader`

`voerkai18n-loader`是一个`webpack loader`,其作用是：

- 可以根据`idMap.ts`映射文件将源码中的`t("xxxxx")`转换为`t("<数字>")`的形式，从而实现消除翻译内容的冗余内容。
- 实现自动导入`t`函数的功能，省却手动导入的麻烦。

安装方法如下：

```bash
> pnpm add -D voerkai18n-loader
> yarn add -D voerkai18n-loader
> npm install -D voerkai18n-loader
```

接下来在`vue.config.js`中进行配置启用：

```javascript

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
                            // 可选的配置参数
                            options: {
                               autoImport:false,            // 是否自动导入t函数
                               debug:true,                 // 输出一些调试信息
                            }
                        }
                    ],                            
                    include: path.join(__dirname, 'src'),    // 只处理src目录下的文件
                    enforce:'pre',
                } 
            ]
        }
      }
}
 
```
- `voerkai18n-loader`插件仅在开发和构建阶段作用。事实上，如果不在乎文本内容的冗余，不安装此插件也是可以工作正常的。
- `voerkai18n-loader`插件的完整[使用说明](../tools/webpack)。

## 第三步：配置`@voerkai18n/vue2`插件

`@voerkai18n/vue2`插件用来自动注入`t`函数、切换语言等功能。

使用方法如下：

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

启用`@voerkai18n/vue2`插件后，可以实现

- 自动注入`t`函数到`Vue`实例中，从而可以在`Vue`应用中直接使用`t`函数进行翻译。
- 当切换语言时，自动重新渲染`Vue`应用。

## 第四步：使用`t`翻译函数

`Vue`应用使用使用`t`翻译函数，有两种方式：

- **在`template`中使用`t`函数**

启用安装`@voerkai18n/vue2`插件后，可以在`template`中直接使用`t`函数进行翻译,不需要额外配置。

```html
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

- **在`script`中使用`t`函数**

只需要`import { t } from 'langauges`导入的`t`函数来进行翻译即可。


 ## 第五步：切换语言

`@voerkai18n/vue2`插件提供了`i18nMixin`来实现语言切换功能。

`i18nMixin`提供了：

- `languages`：属性，返回支持的语言列表，即`i18nScope.languages`值。
- `activeLanguage`：属性，返回当前激活默认语言，即`i18nScope.activeLanguage`值。
- `changeLanguage`：方法，切换语言实例方法，即`i18nScope.changeLanguage`方法。

```vue

<script>
import { i18nMixin } from "@voerkai18n/vue2"
 
export default {
    mixins: [i18nMixin()],
   //......
}
</script>  
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ t("中华人民共和国")}} </h1>
  <h2>{{ t("迎接中华民族的伟大复兴")}} </h2>
  <h5>当前语言：{{ activeLanguage }}</h5>
  <!-- 遍历支持的语言  -->
  <button v-for="lng of languages" 
    @click="changeLangauge(lng.name)"  
    >{{ lng.title }}</button>
</template>
```
 

## 小结

- `@voerkai18n/vue2`插件为`Vue`单文件组件自动注入`t`函数，可以在`<template>`中直接使用，在`<script>`中需要手动从`language`中导入`t`函数。
- Vue应用的中普通`js/ts`文件需要手动从`language`中导入`t`函数。
- 使用`i18nMixin`来实现遍历支持的语言和切换语言的功能。
- 当切换语言时会自动重新渲染组件。
- `@voerkai18n/vue2`插件只能用在`Vue 2`。
- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3-ts)

