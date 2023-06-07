# 安装<!-- {docsify-ignore-all} -->

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

## **@voerkai18/cli**

包含文本提取/编译等命令行工具，一般应该安装到全局。

```javascript | pure
npm install --g @voerkai18n/cli
yarn global add @voerkai18n/cli
pnpm add -g @voerkai18n/cli
```

## **@voerkai18/runtime**

**可选的**，运行时，`@voerkai18/cli`的依赖。大部分情况下不需要手动安装，一般仅在开发库项目时采用独立的运行时依赖。

```javascript | pure
npm install --save @voerkai18n/runtime
yarn add @voerkai18n/runtime
pnpm add @voerkai18n/runtime
``` 

## **@voerkai18/babel**

可选的`babel`插件，用来实现自动导入翻译函数和翻译文本映射自动替换。

## **@voerkai18/vue**

可选的`vue`插件，用来为Vue应用提供语言动态切换功能。

## **@voerkai18/react**

可选的，用来为React应用提供语言动态切换功能。

## **@voerkai18/vite**

可选的`vite`插件，用来为`vite`应用提供自动导入翻译函数和翻译文本映射自动替换。

## **@voerkai18/webpack**

可选的`voerkai18n-loader for webpack`，用来实现自动导入翻译函数和翻译文本映射自动替换，当使用`webpack`作为打包构建工具时使用，比如`react-native`应用。
