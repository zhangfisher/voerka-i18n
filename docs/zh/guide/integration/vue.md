# Vue

> 本节主要介绍如何在`Vue 3`应用中使用`VoerkaI18n`。

创建`Vue 3`应用一般采用`Vite`或`Vue Cli`来创建工程。在`Vue3`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue**

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


### 第3步：启用`Vue`支持

接下需要`voerkai18n apply`来启用`Vue`支持。

```bash
> voerkai18n apply
```

执行`voerkai18n apply`命令后，选择`Vue3`后，会执行以下操作：

- 安装`@voerkai18n/vue`
- 更新`languages`的相关文件，主要是`languages/component.{ts|js}`。


### 第4步：配置应用

修改`main.ts`文件，引入`@voerkai18n/vue`。

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

`i18nPlugin`插件的作用为`Vue组件`提供：

- 提供全局组件实例`t`函数
- 全局的`Translate`组件
- 为`$t`函数提供响应式支持

### 第5步：配置插件

修改`vite.config.{ts|js}`文件，引入`@voerkai18n/plugins/vite`。

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

- `@voerkai18n/plugins/vite`插件的作用为`Vue`应用提供`自动文本映射`功能。


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

引入`useVoerkaI18n`来实现切换语言的功能。

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
 

## 指南

### 手动配置

`voerkai18n apply`负责自动配置`Vue`应用支持，也可以手动配置.

- **编辑`languages/component.{ts|js}`文件**

```ts
import { 
  createTranslateComponent, 
  type VueTranslateComponentType 
} from "@voerkai18n/vue";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```

- **编辑`languages/transform.{ts|js}`文件**

```ts
import { createTranslateTransform,type VueTransformResultType } from "@voerkai18n/vue"
export const transform = createTranslateTransform()
export type TransformResultType = VueTransformResultType
```

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
        .use(i18nPlugin,{i18nScope})
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

### 切换刷新陷阱

在使用`VoerkaI18n`时，新手经常会碰到的问题，就是切换语言后，`Vue`组件不会自动刷新。

比如以下代码在切换语言时自动刷新渲染：

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

**为什么以上代码在切换语言后不会自动刷新呢？**

因为`Vue`组件的`setup`函数只会在组件初始化时执行一次，所以在`setup`函数中调用`t`函数时，`t`函数的执行结果已经固定，所以不会再随着语言的切换而刷新。

**如何解决？**

要解决这个问题，需要**充分理解`Vue`的晌应式机制**：

- 让翻译的结果成为响应式数据
- 在语言切换时更新翻译的结果

重点就是**让翻译的结果成为响应式数据**，这样在语言切换时，`Vue`才会自动更新视图。

聪明的你一定想到了，可以使用`ref`等响应式API来包装翻译的结果，这样就可以实现自动刷新。

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

当语言切换时，`i18nScope`会触发`change`事件，我们在`onMounted`钩子中订阅`change`事件，当语言切换时，更新`title`的值，由于`title`是一个响应式值，所以这样就实现了自动刷新。

显然，这种方式比较繁琐，针对此种场景，`VoerkaI18n`提供了`翻译变换`机制来简化这个过程,参考[翻译变换](../advanced/transform)。

**引入`翻译变换`机制后，以上代码可以简化为：**

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

- **`$t`函数返回的是一个响应式值，所以在语言切换时，`Vue`会自动刷新视图。**
- `$t`函数会将翻译的结果转换为响应式数据，所以在语言切换时，`Vue`会自动刷新视图。
- `$t`函数工作需要配合`@voerkai18n/vue`才可以工作。


:::warning 提示
事实上，在所有响应式框架中，都会遇到这个问题，只要理解了响应式机制，就能很好的解决这个问题。
:::


## 示例

- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/vue3)
