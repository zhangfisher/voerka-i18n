# Installation <!-- {docsify-ignore-all} -->

 `VoerkaI18n` Internationalization framework is an open source multi-package project, which is mainly composed of the following packages:

## ** @voerkai18/cli **

Contains command line tools such as text extraction/compilation, which should generally be installed globally.

```javascript 
npm install --g @voerkai18n/cli
yarn global add @voerkai18n/cli
pnpm add -g @voerkai18n/cli
```

## ** @voerkai18/runtime **

The core runtime, when used `@voerkai18n/cli`, is automatically installed as a dependency of the application, and can also be manually installed.

```javascript 
npm install --save @voerkai18n/runtime
yarn add @voerkai18n/runtime
pnpm add @voerkai18n/runtime
``` 

## ** @voerkai18/babel **

An optional `babel` plug-in to implement `自动导入翻译函数` mapping and `翻译文本` automatic replacement. It is only used in a few `babel` transcoding scenarios.

## ** @voerkai18/vue **

 `vue` `Vue3` Plug-in for to provide dynamic language switching for Vue applications.

## ** @voerkai18/react **

Optionally, it is used to provide dynamic language switching for React applications.

## ** @voerkai18/vite **

Optional `vite` plugin to provide `vite` applications with automatic import of translation functions and automatic replacement of translation text mappings. It is generally used when using `vite` as a packaging build tool, such as `vue3` `react` or applications.

## ** @voerkai18/webpack **

Optional `voerkai18n-loader for webpack`, used to implement automatic import of translation functions and automatic replacement of translation text maps, when used `webpack` as a packaging build tool, such as `react-native` an application.
