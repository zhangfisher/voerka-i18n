# 安装

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

## **@voerkai18/cli**

包含文本提取/编译等命令行工具，一般应该安装到全局。

```javascript 
npm install --g @voerkai18n/cli
yarn global add @voerkai18n/cli
pnpm add -g @voerkai18n/cli
```

## **@voerkai18/runtime**

核心运行时,在使用`@voerkai18n/cli`时会自动安装作为应用程序的依赖，也可以手动安装。

```javascript 
npm install --save @voerkai18n/runtime
yarn add @voerkai18n/runtime
pnpm add @voerkai18n/runtime
``` 

## **@voerkai18/babel**

可选的`babel`插件，用来实现`自动导入翻译函数`和`翻译文本`映射自动替换。仅在少数使用`babel`转码场景时使用。

## **@voerkai18/vue**

适用于`Vue3`的`vue`插件，用来为Vue应用提供语言动态切换功能。
## **@voerkai18/vue2**

适用于`Vue2`的`vue`插件，用来为Vue应用提供语言动态切换功能。

## **@voerkai18/react**

可选的，用来为React应用提供语言动态切换功能。

## **@voerkai18/vite**

可选的`vite`插件，用来为`vite`应用提供自动导入翻译函数和翻译文本映射自动替换。
一般在使用`vite`作为打包构建工具时使用，比如`vue3`或`react`等应用。

## **@voerkai18/webpack**

可选的`voerkai18n-loader for webpack`，用来实现自动导入翻译函数和翻译文本映射自动替换，当使用`webpack`作为打包构建工具时使用，比如`react-native`应用。
