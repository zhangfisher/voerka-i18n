# Nextjs

> **`VoerkaI18n`为`Nextjs`应用的国际化解决方案提供了一个全新的解决方案！**

在`Nextjs`应用引入国际化需要引入以下插件：

- **@voerkai18n/nextjs**

  **Nextjs插件**，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

 
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
myapp                               //i
    src                             //i
        languages
            messages/             
            paragraphs/             
            translates/             // 提取需要翻译的内容
              messages/             // 提取的需要翻译的内容                
              paragraphs/           // 提取的需要翻译的段落
            prompts/                // 执行AI翻译的相关提示词
            api.json                // API接口
            component.tsx           // 翻译组件
            server.ts               //! 服务端入口
            client.ts               //! 客户端入口
            index.ts                //! 客户端入口文件       
            settings.json           // 配置文件
            storage.ts              // 存储管理
            loader.ts               // 加载器
            transform.ts            // 翻译变换
            formatters.json         // 格式化器配置            
    package.json                    //i
    index.ts                        //i
</lite-tree>

与`React`应用不同的是，`Nextjs`应用需要提供`服务端入口`和`客户端入口`。

### 第3步：启用`Nextjs`支持

接下需要`voerkai18n apply`来启用`Nextjs`支持。

```bash
> voerkai18n apply
```

执行`voerkai18n apply`命令后，选择`Nextjs`后，会执行以下操作：

- 安装`@voerkai18n/nextjs`
- 更新`languages`的相关文件,主要是`server.ts`和`client.ts`。

:::warning 提示
也可以手动安装`@voerkai18n/nextjs`，并更新`languages`的相关文件。见下文手工配置。
:::
 
### 第4步：配置应用

不同于其他`Nextjs`国际化方案，`VoerkaI18n`不需配置相应的中间件配置，只需要客户端配置相应的组件即可。

修改`app/layout.tsx`文件，引入`VoerkaI18nNextjsProvider`。

```tsx {1,7,9}
import { VoerkaI18nNextjsProvider } from "@/languages/client";
// .....
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body  >
        <VoerkaI18nNextjsProvider fallback={<div>loading language...</div>}>
          {children} 
        </VoerkaI18nNextjsProvider>
      </body>
    </html>
  );
}

```

### 第5步：翻译内容

`Nextjs`应用组件包括`服务端组件`和`客户端组件`两部分，需要导入不同的组件。

- **服务端组件**

```tsx 

import { Translate } from "@/languages/server";

export default async function Server() {
    return (<div>
        <Translate message="服务端组件"/> 
    </div>)
}
```

- 客户端组件

```tsx
import { Translate } from "@/languages/client";

export default async function Client() {
    return (<div>
        <Translate message="客户端组件"/> 
    </div>)
}
```

### 第6步：切换语言

引入`useVoerkaI18n`来实现切换语言的功能。

```tsx {1,3,7}
'use client'  
import React from 'react'; 
import { useVoerkaI18n } from "@voerkai18n/nextjs/client";
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
    languages      : VoerkaI18nLanguageDefine
    changeLanguage : (language:string)=>Promise<string>,
    t              : VoerkaI18nTranslate
};
```

:::warning 提示
`useVoerkaI18n`运行在客户端。
:::

## 指南

### 手动配置

`voerkai18n apply`负责自动配置`Nextjs`应用支持，也可以手动配置.

- **编辑`languages/client.{ts|js}`文件**

```ts {1-5,14,37}
'use client'
import { 
    createClientTranslateComponent,
    ReactTranslateComponentType 
}  from "@voerkai18n/nextjs/client"
import { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import formatters from "@voerkai18n/formatters" 
import storage  from "./storage"
import idMap from "./messages/idMap.json"
import paragraphs from "./paragraphs"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"    
  
const component = createClientTranslateComponent() 
 
const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"),
    'ja-JP'    : ()=>import("./messages/ja-JP"),
}


export const i18nScope = new VoerkaI18nScope<ReactTranslateComponentType>({    
    id: "nextjs_client",                                // 当前作用域的id
    idMap,                                              // 消息id映射列表    
    injectLangAttr:false,                               // 不注入lang属性
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包 
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    ...settings
}) 

export const t = i18nScope.t
export const Translate = i18nScope.Translate as React.FC<VoerkaI18nTranslateProps>
export { VoerkaI18nNextjsProvider } from "@voerkai18n/nextjs/client"

```

- **编辑`languages/server.{ts|js}`文件**

```ts {1-4,15}
import {                       
    createServerTranslateComponent,
    ReactServerTranslateComponentType 
}  from "@voerkai18n/nextjs/server"
import { VoerkaI18nScope, VoerkaI18nTranslateProps } from '@voerkai18n/runtime';
import formatters from "@voerkai18n/formatters"
import storage  from "./storage"
import idMap from "./messages/idMap.json"
import paragraphs from "./paragraphs"
import settings from "./settings.json"
import zhCNMessages from "./messages/zh-CN"    
import enUSMessages from "./messages/en-US";
import jaJPMessages from "./messages/ja-JP";
  
const component = createServerTranslateComponent() 

const messages = { 
    'zh-CN'    : zhCNMessages,
    'en-US'    : enUSMessages,
    'ja-JP'    : jaJPMessages
}


export const i18nScope = new VoerkaI18nScope<ReactServerTranslateComponentType>({    
    id: "nextjs_server",                   // 当前作用域的id    
    injectLangAttr:false,                  // 不注入lang属性
    idMap,                                 // 消息id映射列表
    formatters,                            // 格式化器
    storage,                               // 语言配置存储器
    messages,                              // 语言包 
    paragraphs,
    component,                             // 翻译组件
    ...settings
}) 



export const t = i18nScope.t
export const Translate = i18nScope.Translate as React.FC<VoerkaI18nTranslateProps>
```

### 常见问题

- **如何处理hydration错误问题？**

`Nextjs`应用经常出现以下错误：

```shell
A tree hydrated but some attributes of the server rendered 
HTML didn't match the client properties. This won't be patched up. 
This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.
```

这是`Nextjs`的常见的问题，开发者需要充分了解`Nextjs`的`hydration`机制。

相关问题可以参考[Nextjs](https://vercel.com/frameworks/nextjs)文档以及[这里](https://react.dev/link/hydration-mismatch)。

:::warning 提示
- 有时`chrome`相关插件也会导致`hydration`错误，因为某些插件可能会在DOM中注入内容而导致`hydrated`错误。
- `VoerkaI18n`默认会在`body`注入`lang`属性，可能会导致`hydration error`，因此需要在`settings.json`中设置`injectLangAttr`为`true`。
:::

## 示例

- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/nextjs)
