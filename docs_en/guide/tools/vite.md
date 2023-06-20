# Vite Plug-in <!-- {docsify-ignore-all} -->

 `@voerkai18n/babel` The plug-in cannot be used normally in the `vite` application, and it is necessary to use `@voerkai18n/vite` the plug-in to complete similar functions, including automatic text mapping and automatic import `t` function.

## Installation

 `@voerkai18n/vite` It only needs to be installed as a development dependency.

```javascript
npm install --save-dev @voerkai18n/vite
yarn add -D @voerkai18n/vite
pnpm add -D @voerkai18n/vite 
```

## Enable the plug-in

Next, enable `@voerkai18n/vite` the plug-in in the `vite.config.js` configuration.

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

-  ` vite-plugin-inspect` It is a debugging plug-in when developing `vite` a plug-in. After it is enabled, you can `localhost:3000/__inspect/ ` view the content of the Vue source code file before and after it is processed by the plug-in. It is generally used by Vite plug-in developers. After the installation in the above example, you can see `Voerkai18nPlugin` what has been done to the `Vue` file, which can deepen your understanding. ** Installation is not required for normal use **.

## Plug-in functionality

### Text mapping

- After the `@voerkai18n/vite` plug-in configuration is enabled, the source code files (including `vue`, `js` etc.) Will be scanned at the same time, and `t('"xxxx")` converted to `t("<id>")` the form of according to `idMap.js` the text mapping table in the file.

### Automatically import `t` functions

For `js` files, you can automatically import `t` functions by specifying them `autoImport=true`. We know that translation is essentially importing and executing `t` functions, so there may be such imports in a complex application.

```javascript
import { t } from "languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
import { t } from "../../languages"
```

 `@voerkai18n/vite` The plug-in can implement the automatic import function. The function does not need to be imported in the `js` file, but is automatically imported by the `@voerkai18n/vite` plug-in in the translation stage according to whether the current file uses the `t` function.

** Notice **
- Automatic import is turned off by default, and you need to manually configure `@voerkai18n/vite` the parameters `autoImport=true` of the plug-in to take effect.
- It is not recommended to turn on the automatic import function for use `typescript` development, so the import type will be lost.
- Unlike `@voerkai18n/babel` plug-ins, `@voerkai18n/vite` plug-ins do not require configuration `location` and `autoImport` parameters and handle import `languages` paths correctly.

## Plug-in parameters

 `vite` The plug-in supports the following parameters:

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

-  `location`: Optional. It is used to specify the current project directory. Generally, it does not need to be configured. It will automatically fetch the current folder. And assume that `languages` the folder is under the `<location>/src/languages` folder.

-  `autoImport`: Optional. It is used to configure whether to import `t` functions automatically. Default `false` means that functions are not automatically imported `t`. `true` Represents an automatic import `t` function. `autoImport=[".<扩展名>",".<扩展名>"]` List the source code extensions, representing the automatic import `t` of functions only in these extension files, for example `autoImport=[".js"]`, representing the automatic import `t` of functions only in JS source files.
Since `typescript` automatically importing `t` functions under will result in a type error prompt, it is generally only recommended `nodejs` to use under.

-  `debug`: Optional. Some debugging information will be output on the console after it is enabled. It is not useful for ordinary users.

- Optional `patterns`, some regular expression matching rules to filter which files need to be scanned and processed. Default rule:

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

   `patterns` The and `正则表达式` matching rule syntaxes are supported `正则表达式字符串` for matching and processing vite-processed file names.

  -  `正则表达式` It is relatively easy to understand, and the matching is processed.
  - Some simple syntax extensions are `正则表达式字符串` supported, including:
    -  `!` Symbol: Adds before a string to make an exclusion match.
    -  `**`: will be `**` replaced by `.*`, allowing a similar `"/code/apps/test/**/node_modules/**"` form to be used to match continuous paths.
    -  `？`: will be `？` replaced with `[^\/]?` to match a single character
    -  `*`: will be `*` replaced by `[^\/]*`, matching the path name


    