# Vue2

> 本节主要介绍如何在`Vue 2`应用中使用`VoerkaI18n`。

创建`Vue 2`应用一般采用`Vite`或`Vue Cli`来创建工程。在`Vue 2`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue2**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **@voerkai18n/plugins**

  **编译期插件**，在`vite.config.js`中配置，用来实现`自动文本映射`等功能,参考[IdMap](../advanced/idMap)

## 使用方法

### 第1步：安装依赖

首先安装`@voerkai18n/cli`到全局.

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

### 第2步：初始化

接着`VoerkaI18n init`初始化工程。

```bash
> voerkai18n init
```

初始化完成后，会创建一个语言工作目录，默认位置是`src/languages`。文件夹结构如下：

<lite-tree>
myapp
    src
        languages
            messages/             
            paragraphs/             
            translates/             // 提取需要翻译的内容
              messages/             // 提取的需要翻译的内容                
              paragraphs/           // 提取的需要翻译的段落
            prompts/                // 执行AI翻译的相关提示词
            api.json                // API接口
            component.ts            // 翻译组件
            index.ts                //! 入口文件       
            settings.json           // 配置文件
            storage.ts              // 存储管理
            loader.ts               // 加载器
            transform.ts            // 翻译变换
            formatters.json         // 格式化器配置            
    package.json
    index.ts    
</lite-tree>



### 第3步：启用`Vue 2 `支持

接下需要`voerkai18n apply`来启用`Vue 2`支持。

```bash
> voerkai18n apply
```

执行`voerkai18n apply`命令后，选择`Vue3`后，会执行以下操作：

- 安装`@voerkai18n/vue2`
- 更新`languages`的相关文件，主要是`languages/component.{ts|js}`。


### 第4步：配置应用

修改`main.ts`文件，引入`@voerkai18n/vue2`。

```ts {5,10-12,14-20}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  { i18nPlugin } from '@voerkai18n/vue2'  
import { i18nScope } from "./languages"

Vue.config.productionTip = false

Vue.use(i18nPlugin,{
  i18nScope
})

i18nScope.ready(()=>{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
```

`i18nPlugin`插件的作用为`Vue组件`提供：

- 提供全局组件实例`t`函数
- 全局的`Translate`组件 

### 第5步：配置插件

修改`vue.config.js`文件，引入`@voerkai18n/plugins/webpack`。

```ts
const webpackPlugin  = require("@voerkai18n/plugins/webpack")

module.exports = {
    configureWebpack: {
      plugins: [
        webpackPlugin()
      ] 
    }
  }
```      

- `@voerkai18n/plugins/webpack`插件的作用为`Vue`应用提供`自动文本映射`功能。


### 第6步：翻译内容

接下来就可以直接在`Vue`组件中使用`t`函数和`Translate`组件进行翻译。

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
:::warning 提示
- 使用`t`函数和`Translate`组件时来包裹要翻译的内容。
- 大段落文本内容可以使用`Translate`组件来包裹。
- `t`函数和`Translate`已经由`@voerkai18n/vue`插件自动注入到组件中，不需要额外导入。
:::

### 第7步：切换语言

引入`useVoerkaI18n`插件来实现切换语言的功能。

```vue
<template>
    <ul class="language-bar"> 
        <li v-for="lang in languages">
            <button 
                class="lang-button"
                @click="changeLanguage(lang.name)" 
                :class="{ active: lang.name === activeLanguage }"
                :key="lang.name">{{ lang.title }}-{{ lang.name }}</button>
        </li> 
    </ul>
</template>
<script>
import { i18nScope } from '../languages';
import { withI18n } from '@voerkai18n/vue2';

export default withI18n({   
  // Vue 2.x代码
},i18nScope)

</script>
```

- `withI18n`函数会为当前组件混入`changeLanguage`、`activeLanguage`、`languages`等属性。

## 指南

### 手动配置

`voerkai18n apply`负责自动配置`Vue 2`应用支持，也可以手动配置.

- **编辑`languages/component.{ts|js}`文件**

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue2";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```
 

### 启用插件

```ts {5,8-10}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  { i18nPlugin } from '@voerkai18n/vue2'
import { i18nScope } from "./languages" 

Vue.use(i18nPlugin,{
  i18nScope
})

i18nScope.ready(()=>{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
```

**插件参数：**
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `i18nScope` |  `VoerkaI18nScope` |   |语言作用域 |


**启用`i18nPlugin`插件后**

- 提供一个全局`t`函数，可以全局直接访问。这样就**不用再在每个组件中额外引入`t`函数了**
- 提供一个全局`$activeLangauge`属性代表当前激活的语言，该属性是一个`Vue.observable`对象，访问`$activeLangauge.value`代表当前激语言。
- 提供一个全局`Translate`组件，这样就可以在组件中直接使用`Translate`组件了,不需要额外导入。

### 翻译组件

使用`voerkai18n apply -f vue`后，会更新`languages/component.ts`，导出一个`Vue 2`组件，该组件可以在切换语言时自动重新渲染。也可以手动更新修改`languages/component.ts`，内容如下：

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue2";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```

#### 创建参数

`createTranslateComponent`方法用来构建Vue组件，类型如下：

```ts
type CreateTranslateComponentOptions = {
  default?: string
  tagName?: string 
  class?  : string
  style?  : string
  loading?: Component | boolean | string
}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `default` |  `string`    |       | 默认显示文本   |
| `tagName` |  `string`    | `div` | 标签名称       |
| `class`   |  `string`    |       | CSS类名        |
| `style`   |  `string`    |       | CSS样式        |
| `loading` |  `Component` |       | 是否显示加载中  |


- `loading`参数用来提供一个加载中的`Vue`组件，当加载远程文本时显示。加载中组件仅在`message`参数是一个`Function`或提供`段落id`时有效。

#### 组件参数

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
}
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` |  `string` |  | 可选，段落ID |
| `message` |  `VoerkaI18nToBeTranslatedMessage` |  | 可选，要翻译的文本 |
| `vars` |  `VoerkaI18nTranslateVars` |  | 可选，插值变量 |
| `default` |  `any` |  | 可选，默认文本 |
| `tag` |  `string` |  | 可选，标签名称 |
| `options` |  `Options` |  | 可选，选项 |

- **`id`和`message`二选一，`id`优先级高于`message`**
 
 
### withI18n

`withI18n`可以为组件实例混入`语言切换`、`枚举语言`等能力。

`withI18n`为组件实例混入以下属性和方法：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `activeLangauge` |  `string` | 当前激活的语言 |
| `defaultLangauge` |  `string` | 当前激活的语言 |
| `changeLangauge` |  `(lang:string)=>Promise<void>` | 切换语言方法 |
| `languages` |  `Array<VoerkaI18nLanguage>` | 语言列表 |


使用方法如下：

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

<script>
import { withI18n } from '@voerkai18n/vue2';    
export default withI18n({

})

</script>
```


### 加载中

当使用翻译组件的[动态翻译](../use/translate)时，允许在翻译过程中显示加载中的状态。

可以按如下方式提供一个加载中的状态：

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue";
import Loading from './Loading.vue'  //! 您的加载中组件
export const component = createTranslateComponent({
  loading:Loading   //!
})
export type TranslateComponentType = VueTranslateComponentType
```

:::warning 提示
大多数情况下，不需要提供加载中的状态，因为翻译过程是非常快的。
仅在动态翻译或异步加载大段落的场景下，才需要提供加载中的状态。
:::

### 切换刷新陷阱

在使用`VoerkaI18n`时，新手经常会碰到的问题，就是切换语言后，`Vue`组件不会自动刷新。

比如以下代码在切换语言时自动刷新渲染：

```vue
<template>
  <div>  
    <div> {{ title }} </div>
  </div>
</template>
<script >
export default {
  data(){
    return {
      title: this.t('你好') // [!code ++] 不会自动刷新
    }
  },
}
<script>

```

**为什么以上代码在切换语言后不会自动刷新呢？**

因为`Vue`组件的`data`函数中调用`t`函数时，`t`函数的执行结果已经固定，所以不会再随着语言的切换而刷新。

**如何解决？**

要解决这个问题，需要**充分理解`Vue`的晌应式机制**：

- 让翻译的结果成为响应式数据
- 在语言切换时更新翻译的结果

重点就是**让翻译的结果成为响应式数据**，这样在语言切换时，`Vue`才会自动更新视图。
此时只需要将`title`变为响应式数据即可。

```vue
<template>
  <div>  
    <div> {{ title }} </div>
  </div>
</template>
<script >
export default {
  computed:{
      title:()=>this.t('你好') // [!code ++] 自动刷新
  }
}
</script >
```
 

## 示例

- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue2)
