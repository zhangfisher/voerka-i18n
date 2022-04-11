---
title: 安装
---

# 安装

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

## **@voerkai18/cli**

包含文本提取/编译等命令行工具，一般应该安装到全局。

```javascript
npm install --g @voerkai18/cli
yarn global add @voerkai18/cli
pnpm add -g @voerkai18/cli
```

## **@voerkai18/runtime**

**可选的**，运行时，`@voerkai18/cli`的依赖。大部分情况下不需要手动安装，一般仅在开发库项目时采用独立的运行时依赖。

```javascript
npm install --save @voerkai18/runtime
yarn add @voerkai18/runtime
pnpm add @voerkai18/runtime
```

## **@voerkai18/formatters**

**可选的**，一些额外的格式化器，可以按需进行安装到`dependencies`中，用来扩展翻译时对插值变量的额外处理。

## **@voerkai18/babel**

可选的`babel`插件，用来实现自动导入翻译函数和翻译文本映射自动替换。

## **@voerkai18/vue**

可选的`vue`插件，用来为Vue应用提供语言动态切换功能。

## **@voerkai18/vite**

可选的`vite`插件，用来为`vite`应用提供自动导入翻译函数和翻译文本映射自动替换。
