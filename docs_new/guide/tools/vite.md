# Vite插件<!-- {docsify-ignore-all} -->

`@voerkai18n/babel`插件在`vite`应用中不能正常使用，需要使用`@voerkai18n/vite`插件来完成类似的功能，包括自动文本映射和自动导入`t`函数。

## 安装

`@voerkai18n/vite`只需要作为开发依赖安装即可。

```javascript
npm install --save-dev @voerkai18n/vite
yarn add -D @voerkai18n/vite
pnpm add -D @voerkai18n/vite 
```

## 启用插件

接下来在`vite.config.js`中配置启用`@voerkai18n/vite`插件。

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'// 可选的
import Voerkai18nPlugin from "@voerkai18n/vite"
export default defineConfig({
    plugins: [
        Inspect(),  // 可选的
        Voerkai18nPlugin({debug:true}),
        vue()
    ]
})

```

- ` vite-plugin-inspect`是开发`vite`插件时的调试插件，启用后就可以通过`localhost:3000/__inspect/ `查看Vue源码文件经过插件处理前后的内容，一般是Vite插件开发者使用。上例中安装后，就可以查看`Voerkai18nPlugin`对`Vue`文件干了什么事，可以加深理解，**正常使用不需要安装**。

## 插件功能

### 文本映射

- `@voerkai18n/vite`插件配置启用后，同时会扫描源代码文件（包括`vue`,`js`等），根据`idMap.js`文件里面的文本映射表，将`t('"xxxx")`转换成`t("<id>")`的形式。

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
- 自动导入默认是关闭的，需要手动配置`@voerkai18n/vite`插件的参数`autoImport=true`才能生效。
- 对于使用`typescript`开发则不建议开启自动导入功能,因此这会导入类型的丢失。
- 不同于`@voerkai18n/babel`插件，`@voerkai18n/vite`插件不需要配置`location`和`autoImport`参数，能正确地处理导入`languages`路径。

## 插件参数

`vite`插件支持以下参数：

```javascript
import Voerkai18nPlugin from "@voerkai18n/vite"
export default defineConfig({
    plugins: [
        Inspect(),  										// 可选的
        Voerkai18nPlugin({
            location: "./",                                 // 可选的，指定当前工程目录
            autoImport: false,                              // 不自动导入t函数
            // autoImport: true,                            // 自动导入t函数
            // autoImport: [".js"],                         // 仅在js文件中自动导入t函数
            debug:false,                                    // 是否输出调试信息，当=true时，在控制台输出转换匹配的文件清单
            patterns:[
                "!(?<!.vue\?.*).(css|json|scss|less|sass)$",          // 排除所有css文件
                /\.vue(\?.*)?/,                                     // 所有vue文件
            ]    
        }),
        vue()
    ]
})
```

- `location`：可选的，用来指定当前工程目录，一般情况是不需要配置的，会自动取当前文件夹。并且假设`languages`文件夹在`<location>/src/languages`文件夹下。

- `autoImport`：可选的，用来配置是否自动导入`t`函数。默认`false`代表不自动导入`t`函数。`true`代表自动导入`t`函数。`autoImport=[".<扩展名>",".<扩展名>"]`列出源码扩展名列表，代表仅仅在这些扩展名文件中自动导入`t`函数，如`autoImport=[".js"]`代表仅在js源文件中自动导入`t`函数。
由于在`typescript`下自动导入`t`函数会导致类型错误提示，所以一般仅建议在`nodejs`下使用。

- `debug`：可选的，开启后会在控制台输出一些调试信息，对一般用户没有用。

- `patterns`：可选的，一些正则表达式匹配规则，用来过滤匹配哪一些文件需要进行扫描和处理。默认的规则：

  ```javascript
  const patterns={
     	"!(?<!.vue\?.*).(css|json|scss|less|sass)$",          	// 排除所有css文件
     	/\.vue(\?.*)?/,                                     	// 所有vue文件
     	"!.*\/node_modules\/.*",								// 排除node_modules
     	"!/.*\/languages\/.*",           					 	// 默认排除语言文件
      "!\.babelrc",											// 排除.babelrc
  	"!babel\.config\.js",									// 排除babel.config.js
      "!package\.json$",										// 排除package.json
      "!vite\.config\.js",									// 排除vite.config.js
      "!^plugin-vue:.*"										// 排除plugin-vue
  }
  ```

  `patterns`的匹配规则语法支持`正则表达式字符串`和`正则表达式`两种，用来对经vite处理的文件名称进行匹配和处理。

  - `正则表达式`比较容易理解，匹配上的就进行处理。
  - `正则表达式字符串`支持一些简单的语法扩展，包括：
    - `!`符号：添加在字符串前面来进行排除匹配。
    - `**`：将`**`替换为`.*`，允许使用类似`"/code/apps/test/**/node_modules/**"`的形式来匹配连续路径。
    - `？`：将`？`替换为`[^\/]?`，用来匹配单个字符
    - `*`：将`*`替换为`[^\/]*`，匹配路径名称


    