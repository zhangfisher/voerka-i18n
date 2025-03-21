# Babel Plugin

Install the `@voerkai18n/babel` plugin globally to enable automatic import of the `t` function and automatic text mapping.

## Installation

::: code-group

```bash [npm]
> npm install -g @voerkai18n/babel
```

```bash [yarn]
> yarn global add @voerkai18n/babel
```

```bash [pnpm]
> pnpm add -g @voerkai18n/babel
```
:::

## Enabling the Plugin

Usage is as follows:

- Configure the plugin in `babel.config.js`

```javascript
const i18nPlugin =  require("@voerkai18n/babel")
module.expors = {
    plugins: [
        [
            i18nPlugin,
            {
                // Optional, specify the directory for storing language files
                // Can be a relative or absolute path
                // location:"",
                autoImport:"#/languages"  
            }            
        ]
    ]
}
```

This way, when performing `babel` transformation, the `t` translation function will be automatically imported in `js` source files.

## Plugin Parameters

The plugin supports the following parameters:

- **autoImport**

  Used to configure the import path. For example, with `autoImport="#/languages"`, when babel detects the presence of the t function without an import during transformation, it will automatically add `import { t } from "#/languages"` to the source code.

  When configuring `autoImport`, it's important to provide consistent import paths depending on the bundler or transformation plugin being used, such as `webpack`, `rollup`, etc. For example, when using `babel-plugin-module-resolver`:

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

  With this configuration, setting `autoImport="languages"` will automatically import `import { t } from "languages"`.

  Bundlers like `webpack`, `rollup`, etc., have similar plugins for implementing aliases and transformations. The goal is to allow the `@voerkai18n/babel` plugin to automatically import from a fixed path rather than various complex relative paths.
