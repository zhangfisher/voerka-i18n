# Vue应用


创建`Vue`应用可以采用`Vite`或`Vue Cli`来创建工程。

在`Vue3`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **@voerkai18n/vite**

  **Vite插件**，在`vite.config.js`中配置，用来实现`自动文本映射`、`自动导入t函数`等功能。

  
`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，安装配置好这两个插件后，就可以在`Vue`文件使用多语言`t`函数。


以下介绍当采用`Vite`创建应用时，如何引入`Voerkai18n`。


## 第一步：引入

```javascript | pure
// 初始化工程
> voerka18n init
// 提取要翻译的文本到src/languages/translates/*.json
> voerkai18n extract
// 进行人工翻译或自动翻译(百度)
> voerkai18n translate --apikey xxxx --apiid xxxxx
// 编译语言包
> voerkai18n compile 
```

## 第二步：导入`t`翻译函数
无论采用何种工具创建`Vite`应用，均可以直接从`languages`直接导入`t`函数。

```vue
<script setup>  
import { t } from "./languages"
</script>
```
取决于您是从哪一个文件中导入，需要修改导入位置，可能类似这样：
```javascript | pure
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

导入`t`函数后就可以直接使用了。

```vue
<Script setup>
// 如果没有在vite.config.js中配置`@voerkai18n/vite`插件，则需要手工导入t函数
// import { t } from "./languages"
</Script>
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

## 第三步：自动导入`t`翻译函数

当源码文件非常多时，手动导入`t`函数比较麻烦，我们提供了`vite`和`babel`两个插件可以实现自动导入`t`函数。
如果应用是采用`Vite`+`@vitejs/plugin-vite`创建的工程，则可以通过配置`@voerkai18n/vite`插件实现自动导入`t`函数。

详见`@voerkai18n/vite`插件介绍。


**重点：`t`函数会在使用`@voerkai18n/vite`插件后自动注入，因此在`Vue`文件中可以直接使用。**


## 第四步：切换语言

引入`@voerkai18n/vue`插件来实现切换语言和自动重新渲染的功能。

```javascript | pure
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })   // 重点，需要引入i18nScope
    app.mount('#app')
```
`@voerkai18n/vue`插件安装后,提供了一个`i18n`实例，可以在组件中进行`inject`。就可以按如下方式使用：

```vue
<script>
export default {
  inject: ['i18n']          // 此值由`@voerkai18n/vue`插件提供
}
</script>  
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <h1>{{ t("中华人民共和国")}} </h1>
  <h2>{{ t("迎接中华民族的伟大复兴")}} </h2>
  <h5>默认语言：{{ i18n.defaultLanguage }}</h5>
  <h5>当前语言：{{ i18n.activeLanguage.value }}</h5>
  <button v-for="lng of i18n.languages" @click="i18n.activeLanguage = lng.name">{{ lng.title }}</button>
</template>

```

**说明：**

- 事实上，就算没有`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，只需要导入`t`函数也就可以直接使用。这两个插件只是很简单的封装而已。
- 如果要在应用中进行`语言动态切换`，则需要在应用中引入`@voerkai18n/vue`，请参阅`@voerkai18n/vue`插件使用说明。
- `@voerkai18n/vite`的使用请参阅后续说明。
