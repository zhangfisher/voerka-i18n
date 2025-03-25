# Solidjs

> 本节主要介绍如何在`Solidjs`应用中使用`VoerkaI18n`。
 

- **@voerkai18n/solid**

  **solid插件**，在初始化`solid`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

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


### 第3步：启用`solid`支持

接下需要`voerkai18n apply`来启用`Solid`支持。

```bash
> voerkai18n apply
```

执行`voerkai18n apply`命令后，选择`solid`后，会执行以下操作：

- 安装`@voerkai18n/solid`
- 更新`languages`的相关文件。

:::warning 提示
也可以手动安装`@voerkai18n/solid`，并更新`languages`的相关文件。见下文手工配置。
:::

### 第4步：配置应用

修改`app.tsx`文件，引入`@voerkai18n/solid`。

```ts  {5,10,13}
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import { VoerkaI18nSolidProvider } from "./languages";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <VoerkaI18nSolidProvider>
          <Nav/>
          <Suspense>{props.children}</Suspense>
        </VoerkaI18nSolidProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
```

### 第5步：配置插件

修改`app.config.{ts|js}`文件，引入`@voerkai18n/plugins/vite`。

```ts {4,8}
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import i18nPlugin from '@voerkai18n/plugins/vite'

export default defineConfig({
  vite: {
    plugins: [
      i18nPlugin(),
      tailwindcss()]
  }
});
```      

- `@voerkai18n/plugins/vite`插件的作用为`solidjs`应用提供`自动文本映射`功能。
 
### 第6步：翻译内容

接下来就可以直接在组件中使用`t`函数和`Translate`组件进行翻译。

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
import classnames from "classnames"
import { useVoerkaI18n } from "@voerkai18n/solid/client";

export function LanguageBar(){
    const { languages,activeLanguage,changeLanguage } = useVoerkaI18n() 
    return (<>
        { languages.map(lang=>{
            return <button 
                type="button" 
                onClick={()=>changeLanguage(lang.name) }             
                class={classnames("cursor-pointer focus:ring-4 focus:outline-none focus:ring-blue-300 font-small mr-4 rounded-lg text-sm px-4 text-center ",
                    {
                        "bg-emerald-800 hover:bg-emerald-600 text-white ": lang.name===activeLanguage(),
                        "border-1 border-gray-400" : lang.name!=activeLanguage()
                    })
                }>
                {lang.name}
            </button>

        })}
    </>)
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
 

## 示例

- 完整的示例请见[这里](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/solid)
