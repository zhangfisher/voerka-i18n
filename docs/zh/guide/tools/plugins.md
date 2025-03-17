# 编译插件

`@voerkai18n/plugins`是基于`unplugin`开发的编译期插件，用于实现包括自动文本映射和自动导入`t`函数等功能。

## 安装

`@voerkai18n/plugins`只需要作为开发依赖安装即可。

::: code-group

```npm
npm install --save-dev @voerkai18n/plugins
```
```yarn
yarn add -D @voerkai18n/plugins
```
```pnpm
pnpm add -D @voerkai18n/plugins
```
:::

`@voerkai18n/plugins`支持导出以下插件:
- `@voerkai18n/plugins/vite`  
- `@voerkai18n/plugins/webpack` 
- `@voerkai18n/plugins/farm` 
- `@voerkai18n/plugins/rspack` 
- `@voerkai18n/plugins/nuxt` 
- `@voerkai18n/plugins/rollup` 
- `@voerkai18n/plugins/esbuild` 
- `@voerkai18n/plugins/astro` 

## 启用插件

以`vite`插件为例，在`vite.config.js`中配置启用`@voerkai18n/vite`插件。

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'// 可选的
import Voerkai18nPlugin from "@voerkai18n/plugins/vite"
export default defineConfig({
    plugins: [
        Inspect(),  // 可选的
        Voerkai18nPlugin({debug:true}),
        vue()
    ]
})

```

- ` vite-plugin-inspect`是开发`vite`插件时的调试插件，启用后就可以通过`localhost:3000/__inspect/ `查看Vue源码文件经过插件处理前后的内容，一般是Vite插件开发者使用。上例中安装后，就可以查看`Voerkai18nPlugin`对`Vue`文件干了什么事，可以加深理解，**正常使用不需要安装**。

:::warning 提示
`vite/webpack/farm/rspack/nuxt/rollup/esbuild/astro`等插件的配置请参考对应的文档。 
:::

## 插件功能

### 文本映射

- `@voerkai18n/plugins`插件配置启用后，同时会扫描源代码文件（包括`vue`,`js`等），根据`idMap.js`文件里面的文本映射表，将`t('"xxxx")`转换成`t("<id>")`的形式。

:::warning 提示
文本映射可以缩小源码文件的体积！但是如果不启用也不会影响国际化的功能。
:::

### 自动导入`t`函数

针对`js`文件，能通过指定`autoImport=true`来自动导入`t`函数。我们知道本质上翻译就是导入执行`t`函数，这样在一个复杂应用中可能就会存在这样的导入

```javascript
import { t } from "languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
import { t } from "../../languages"
```

`@voerkai18n/vite`插件可以实现自动导入功能，在`js`文件中不需要导入该函数，而是由`@voerkai18n/vite`插件在翻译阶段根据当前文件是否有使用了`t`函数而自动导入。

**注意：**
- 自动导入默认是关闭的，需要手动配置`autoImport`参数才能生效。
- 启用`autoImport=true`后, 在`typescript`开发时会导入类型丢失，所有不建议开启。

:::warning 提示
自动导入`t`函数也可以使用插件[unplugin-auto-import](https://www.npmjs.com/package/unplugin-auto-import)来实现。
:::

## 插件参数

插件支持以下参数：

### autoImport

可选的，用来配置是否自动导入`t`函数。默认`false`代表不自动导入`t`函数。`true`代表自动导入`t`函数。`autoImport=[".<扩展名>",".<扩展名>"]`列出源码扩展名列表，代表仅仅在这些扩展名文件中自动导入`t`函数，如`autoImport=[".js"]`代表仅在js源文件中自动导入`t`函数。
由于在`typescript`下自动导入`t`函数会导致类型错误提示，所以一般仅建议在`nodejs`下使用。

### patterns

一些正则表达式匹配规则，用来过滤匹配哪一些文件需要进行扫描和处理。

默认的规则如下：

```ts
const patterns=[/.(js|mjs|cjs|ts|jsx|tsx|vue|svelte|mdx|astro)$/]
```

`patterns`的匹配规则语法支持`正则表达式字符串`和`正则表达式`两种，用来对经vite处理的文件名称进行匹配和处理。

- `正则表达式`比较容易理解，匹配上的就进行处理。
- `正则表达式字符串`支持一些简单的语法扩展，包括：
- `!`符号：添加在字符串前面来进行排除匹配。
- `**`：将`**`替换为`.*`，允许使用类似`"/code/apps/test/**/node_modules/**"`的形式来匹配连续路径。
- `？`：将`？`替换为`[^\/]?`，用来匹配单个字符
- `*`：将`*`替换为`[^\/]*`，匹配路径名称


### debug

可选的，开启后会在控制台输出一些调试信息

 