# Babel插件<!-- {docsify-ignore-all} -->

全局安装`@voerkai18n/babel`插件用来进行自动导入`t`函数和自动文本映射。

## 安装

```javascript
> npm install -g @voerkai18n/babel
> yarn global add @voerkai18n/babel
> pnpm add -g @voerkai18n/babel
```

## 启用插件

使用方法如下：

- 在`babel.config.js`中配置插件

```javascript
const i18nPlugin =  require("@voerkai18n/babel")
module.expors = {
    plugins: [
        [
            i18nPlugin,
            {
                // 可选，指定语言文件存放的目录，即保存编译后的语言文件的文件夹
                // 可以指定相对路径，也可以指定绝对路径
                // location:"",
                autoImport:"#/languages"  
            }            
        ]
    ]
}
```

这样，当在进行`babel`转码时，就会自动在`js`源码文件中导入`t`翻译函数。

## 插件参数

插件支持以下参数:

- **location**

  配置`langauges`文件夹位置，默认会使用当前文件夹下的`languages`文件。

  因此，如果你的`babel.config.js`在项目根文件夹，而`languages`文件夹位于`src/languages`，则可以将`location="src/languages"`，这样插件会自动从该文件夹读取需要的数据。

- **autoImport**

  用来配置导入的路径。比如 `autoImport="#/languages"  `，则当在babel转码时，如果插件检测到t函数的存在并没有导入，就会自动在该源码中自动导入`import { t } from "#/languages"`

  配置`autoImport`时需要注意的是，为了提供一致的导入路径，视所使用的打包工具或转码插件，如`webpack`、`rollup`等。比如使用`babel-plugin-module-resolver`

  ```javascript
  module.expors = {
      plugins: [
          [
              "module-resolver",
              {
                  root:"./",
  				alias:{
                      "languages":"./src/languages"
                  }
              }            
          ]
      ]
  }
  ```

  这样配置`autoImport="languages"`，则自动导入`import { t } from "languages"`。

  如`webpack`、`rollup`等打包工具也有类似的插件可以实现别名等转换，其目的就是让`@voerkai18n/babel`插件能自动导入固定路径，而不是各种复杂的相对路径。
  