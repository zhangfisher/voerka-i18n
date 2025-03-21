# Compilation Plugins

`@voerkai18n/plugins` is a compilation plugin developed based on `unplugin`, used to implement features including automatic text mapping and automatic import of the `t` function.

## Installation

`@voerkai18n/plugins` only needs to be installed as a development dependency.

::: code-group

```bash [npm]
npm install --save-dev @voerkai18n/plugins
```
```bash [yarn]
yarn add -D @voerkai18n/plugins
```
```bash [pnpm]
pnpm add -D @voerkai18n/plugins
```
:::

`@voerkai18n/plugins` supports exporting the following plugins:
- `@voerkai18n/plugins/vite`  
- `@voerkai18n/plugins/webpack` 
- `@voerkai18n/plugins/farm` 
- `@voerkai18n/plugins/rspack` 
- `@voerkai18n/plugins/nuxt` 
- `@voerkai18n/plugins/rollup` 
- `@voerkai18n/plugins/esbuild` 
- `@voerkai18n/plugins/astro` 

## Enabling the Plugin

Taking the `vite` plugin as an example, configure and enable the `@voerkai18n/vite` plugin in `vite.config.js`.

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'// Optional
import Voerkai18nPlugin from "@voerkai18n/plugins/vite"
export default defineConfig({
    plugins: [
        Inspect(),  // Optional
        Voerkai18nPlugin({debug:true}),
        vue()
    ]
})
```

- `vite-plugin-inspect` is a debugging plugin for developing `vite` plugins. After enabling it, you can view the Vue source files' content before and after plugin processing at `localhost:3000/__inspect/`. It's generally used by Vite plugin developers. In the example above, after installation, you can see what `Voerkai18nPlugin` does to `Vue` files to better understand it. **Normal users don't need to install it**.

:::warning Note
For configuration of `vite/webpack/farm/rspack/nuxt/rollup/esbuild/astro` plugins, please refer to their respective documentation.
:::

## Plugin Features

### Text Mapping

- After enabling the `@voerkai18n/plugins` plugin configuration, it will scan source code files (including `vue`, `js`, etc.) and convert `t('"xxxx")` to `t("<id>")` form based on the text mapping table in the `idMap.js` file.

:::warning Note
Text mapping can reduce source code file size! However, internationalization functionality won't be affected if it's not enabled.
:::

### Automatic Import of `t` Function

For `js` files, you can automatically import the `t` function by specifying `autoImport=true`. We know that translation essentially involves importing and executing the `t` function, which might lead to imports like this in a complex application:

```javascript
import { t } from "languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
import { t } from "../../languages"
```

The `@voerkai18n/vite` plugin can implement automatic import functionality, eliminating the need to import the function in `js` files. Instead, the `@voerkai18n/vite` plugin automatically imports it during the translation phase based on whether the current file uses the `t` function.

**Note:**
- Automatic import is disabled by default and needs manual configuration of the `autoImport` parameter to take effect.
- Enabling `autoImport=true` will cause type loss during TypeScript development, so it's not recommended to enable it.

:::warning Note
Automatic import of the `t` function can also be implemented using the [unplugin-auto-import](https://www.npmjs.com/package/unplugin-auto-import) plugin.
:::

## Plugin Parameters

The plugin supports the following parameters:

### autoImport

Optional, used to configure whether to automatically import the `t` function. Default `false` means no automatic import. `true` means automatic import. `autoImport=[".<extension>",".<extension>"]` lists source code extensions where the `t` function will be automatically imported, like `autoImport=[".js"]` means only automatically import the `t` function in js source files.
Since automatic import of the `t` function causes type error prompts in `typescript`, it's generally only recommended for use in `nodejs`.

### patterns

Regular expression matching rules used to filter which files need to be scanned and processed.

The default rules are as follows:

```ts
const patterns=[/.(js|mjs|cjs|ts|jsx|tsx|vue|svelte|mdx|astro)$/]
```

`patterns` matching rules support both `regular expression strings` and `regular expressions` to match and process filenames processed by vite.

- `Regular expressions` are easy to understand - matched files are processed.
- `Regular expression strings` support some simple syntax extensions, including:
- `!` symbol: Added at the beginning of the string for exclusion matching.
- `**`: Replaces `**` with `.*`, allowing forms like `"/code/apps/test/**/node_modules/**"` to match continuous paths.
- `?`: Replaces `?` with `[^\/]?`, used to match single characters.
- `*`: Replaces `*` with `[^\/]*`, matches path names.

### debug

