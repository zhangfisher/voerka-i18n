# React

> 本节主要介绍如何在`React`应用中使用`VoerkaI18n`。

创建`React`应用一般采用`Vite`或`Vue Cli`来创建工程。在`Vue 2`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/react**

  **React插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

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
            component.tsx           // 翻译组件
            index.ts                //! 入口文件       
            settings.json           // 配置文件
            storage.ts              // 存储管理
            loader.ts               // 加载器
            transform.ts            // 翻译变换
            formatters.json         // 格式化器配置            
    package.json
    index.ts    
</lite-tree>


### 第3步：启用`React`支持

接下需要`voerkai18n apply`来启用`React`支持。

```bash
> voerkai18n apply
```

执行`voerkai18n apply`命令后，选择`React`后，会执行以下操作：

- 安装`@voerkai18n/react`
- 更新`languages`的相关文件，主要是`languages/component.{tsx|jsx}`。

:::warning 提示
也可以手动安装`@voerkai18n/react`，并更新`languages`的相关文件。见下文手工配置。
:::

### 第4步：配置应用

修改`main.ts`文件，引入`@voerkai18n/react`。

```ts {5-6,8,14}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx' 
import "./languages"   
import { i18nScope } from "./languages"

i18nScope.ready(()=>{
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

```

### 第5步：配置插件

修改`vite.config.{ts|js}`文件，引入`@voerkai18n/plugins/vite`。

```ts
import { defineConfig } from 'vite'
import i18nPlugin from '@voerkai18n/plugins/vite'  // [!code ++]
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import viteInspector from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    i18nPlugin(),             // [!code ++]
    react(),    
    tailwindcss(),
    viteInspector(),    
  ],
})
```      

- `@voerkai18n/plugins/vite`插件的作用为`Vue`应用提供`自动文本映射`功能。

:::warning 注意
`@voerkai18n/plugins/vite`插件需要在`react`插件之前引入。
因为`react`插件会对`jsx`进行编译转码，从而导致`@voerkai18n/plugins/vite`插件无法通过正则表达式对代码中的`t`函数和`Translate`组件进行识别。
:::

### 第6步：翻译内容

接下来就可以直接在`React`组件中使用`t`函数和`Translate`组件进行翻译。

```tsx
import { t, Translate } from './languages'

export default ()=>{
  return (
    <div>
      <h1>
        <Translate message="请输入用户名称"/>
      </h1>
      <div>
          <span>
            <Translate message="用户名:" />
          </span>
          <input type="text" placeholder={t('邮件/手机号码/帐号')}/>
          <span>
            <Translate message="密码:" />
          </span>
          <input type="password" placeholder={t('至少6位的密码')}/>            
          <Translate id="notice">
            大段文本内容
          </Translate>
      </div>            
      <button onClick={login}>
        <Translate message="登录" />
      </button>
    </div>
  )
}
```

:::warning 提示
- 使用`t`函数和`Translate`组件时来包裹要翻译的内容。
- 大段落文本内容可以使用`Translate`组件来包裹。 
:::

### 第7步：切换语言

引入`useVoerkaI18n`插件来实现切换语言的功能。

```tsx
import React from 'react'; 
import { useVoerkaI18n } from '@voerkai18n/react';
import classNames from 'classnames'

const LanguageBar: React.FC = () => {
  const { activeLanguage, changeLanguage, languages } = useVoerkaI18n();
  return (
    <div className="flex md:order-2 flex-row justify-items-center align-middle">
      { languages.map((lang) => {
        return (<button 
          key={lang.name} 
          onClick={() => changeLanguage(lang.name) } 
          className={ lang.name === activeLanguage ? 'active' : ''}
        >{lang.name}</button>)
      })}
    </div>
  )
}

```

`useVoerkaI18n`返回值：

```ts
{
    scope          : VoerkaI18nScope
    manager        : VoerkaI18nManager
    activeLanguage : string
    defaultLanguage: string
    languages      : VoerkaI18nLanguage
    changeLanguage : (language:string)=>Promise<string>,
    t              : VoerkaI18nTranslate
};
```

## 指南

### 手动配置

`voerkai18n apply`负责自动配置`React`应用支持，也可以手动配置.

- **编辑`languages/component.{tsx|jsx}`文件**

```ts
import { createTranslateComponent,ReactTranslateComponentType } from "@voerkai18n/react";
export const component = createTranslateComponent()
export type TranslateComponentType = ReactTranslateComponentType
```

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
  loading?: Component
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
 
 
### useVoerkaI18n

`useVoerkaI18n`是一个`React`的`Hook`，用来访问`VoerkaI18n`的相关信息。

```ts
import { useVoerkaI18n } from "@voerkai18n/react"

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

### VoerkaI18nProvider

`VoerkaI18nProvider`用来包装入口，是对`i18nScope.ready`的封装。


```tsx
import { VoerkaI18nProvider } from '@voerkai18n/react'

<VoerkaI18nProvider>
    <StrictMode>
      <App />
    </StrictMode>,
</VoerkaI18nProvider>

// 等效于

i18nScope.ready(()=>{
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

```

- `VoerkaI18nProvider`提供一个`fallback`属性，用来在加载过程中显示一个`loading`组件。
### 加载中

当使用翻译组件的[动态翻译](../use/translate)时，允许在翻译过程中显示加载中的状态。

可以按如下方式提供一个加载中的状态：

```tsx
// languages/component.tsx
import { createTranslateComponent,ReactTranslateComponentType } from "@voerkai18n/react";
import Loading from '../components/Loading';
export const component = createTranslateComponent({loading:<Loading/>})
export type TranslateComponentType = ReactTranslateComponentType
```

:::warning 提示
大多数情况下，不需要提供加载中的状态，因为翻译过程是非常快的。
仅在动态翻译或异步加载大段落的场景下，才需要提供加载中的状态。
:::
 

## 示例

- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/react)
