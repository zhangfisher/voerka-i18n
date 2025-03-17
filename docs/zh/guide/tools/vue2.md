# Vue2插件

`@voerkai18n/vue2`为`Vue 2`应用提供国际化支持，实现`翻译组件`、`翻译变换`、`枚举语言`、`语言切换`等功能。

## 安装

将`@voerkai18n/vue2`安装为运行时依赖

::: code-group

```npm
npm install --save-dev @voerkai18n/vue2
```

```yarn
yarn add -D @voerkai18n/vue2
```

```pnpm
pnpm add -D @voerkai18n/vue2
```
:::
 
## 指南

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
| `languages` |  `Array<VoerkaI18nLanguageDefine>` | 语言列表 |


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

