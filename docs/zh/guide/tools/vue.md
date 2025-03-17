# Vue插件

`@voerkai18n/vue`为`Vue3`应用提供国际化支持，实现`枚举语言`、`变量注入`、`语言切换`等功能。

`@voerkai18n/vue`包含以下功能：

- 翻译组件
- 翻译变换
- 翻译插件
- useVoerkaI18n

## 安装

将`@voerkai18n/vue`安装为运行时依赖

::: code-group

```npm
npm install --save-dev @voerkai18n/vue
```

```yarn
yarn add -D @voerkai18n/vue
```

```pnpm
pnpm add -D @voerkai18n/vue
```
:::


`@voerkai18n/vue`


## 指南

### 启用插件

```ts {6,10}
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18nScope } from "./languages"
import { router } from "./router"
import { i18nPlugin } from '@voerkai18n/vue'

i18nScope.ready(()=>{
    createApp(App)
        .use(i18nPlugin,{scope:i18nScope})
        .use(router)
        .mount('#app')
})
```

**插件参数：**
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `scope` |  `VoerkaI18nScope` | 无 |语言作用域 |


**启用`i18nPlugin`插件后**

- 提供一个全局`t`函数，可以全局直接访问。这样就**不用再在每个组件中额外引入`t`函数了**
- 提供一个全局`$activeLangauge`属性代表当前激活的语言，该属性是一个`ref`对象，会在切换文时自动更新。
- 提供一个全局`Translate`组件，这样就可以在组件中直接使用`Translate`组件了,不需要额外导入。

### 翻译组件

使用`voerkai18n apply -f vue`后，会更新`languages/component.ts`，导出一个`Vue 3`组件，该组件可以在切换语言时自动重新渲染。也可以手动更新修改`languages/component.ts`，内容如下：

```ts
import { 
    createTranslateComponent, 
    type VueTranslateComponentType 
} from "@voerkai18n/vue";
export const component = createTranslateComponent(<options>) 
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
| `default` |  `string` |  | 默认显示文本 |
| `tagName` |  `string` | `div` | 标签名称 |
| `class` |  `string` |  | CSS类名 |
| `style` |  `string` |  | CSS样式 |
| `loading` |  `Component` | 是否显示加载中 |


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
    children? : Children;
    style?    : any;
    className?: string;
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
| `children` |  `Children` |  | 可选，子组件 |
| `style` |  `any` |  | 可选，样式 |
| `className` |  `string` |  | 可选，CSS类名 |

- **`id`和`message`二选一，`id`优先级高于`message`**
 
### 翻译变换

使用`voerkai18n apply -f vue`后会自动配置翻译变换，也可以手动更新`languages/transform.ts`，内容如下：

```ts
import { createTranslateTransform,type VueTransformResultType } from "@voerkai18n/vue"
export const transform = createTranslateTransform()
export type TransformResultType = VueTransformResultType 
```

- 关于翻译变换的详细说明请参考[翻译变换](../advanced/transform)
 
### useVoerkaI18n

`useVoerkaI18n`是一个`Vue3`的`Composition API`函数，用来获取`VoerkaI18n`实例。

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

使用`useVoerkaI18n`可以渲染出语言切换的组件：

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

