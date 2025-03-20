# Installation

The `VoerkaI18n` internationalization framework is an open-source multi-package project, mainly consisting of the following packages:

## Install Command Line Tool

`VoerkaI18n` provides `@voerkai18n/cli` for implementing text extraction/compilation and other command-line tools, which should generally be installed globally.

::: code-group

```bash [npm]
npm install -g @voerkai18n/cli
```

```bash [yarn]
yarn global add @voerkai18n/cli
```

```bash [pnpm]
pnpm add -g @voerkai18n/cli
```
:::

## Optional Packages

`@voerkai18n/cli` provides a complete toolchain to help you build internationalized applications. In practical applications, you may need to selectively install some packages based on your application framework.

| Package Name | Description |
| --- | --- |
| **Core Packages** | |
| `@voerkai18n/runtime` | Core runtime |
| `@voerkai18n/formatters` | Optional `interpolation variable` processing plugin |
| `@voerkai18n/patch` | Optional, provides online language patch editing functionality |
| **Build Tools** | |
| `@voerkai18n/babel` | Optional `babel` plugin |
| `@voerkai18n/plugins` | Build-time plugins developed based on `unplugin` |
| `@voerkai18n/webpack` | Optional `voerkai18n-loader for webpack` |
| **Framework Integration** | |
| `@voerkai18n/vue` | `vue` plugin for `Vue3` |
| `@voerkai18n/vue2` | Plugin for `Vue2` |
| `@voerkai18n/svelte` | Plugin for `svelte` |
| `@voerkai18n/solid` | Plugin for `solid` |
| `@voerkai18n/nextjs` | Plugin for `nextjs` |
| `@voerkai18n/react` | Optional, provides dynamic language switching functionality for React applications |
| `@voerkai18n/webcomponent` | Optional, WebComponent translation component |
