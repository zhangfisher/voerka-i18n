# 安装

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

## 安装命令行工具

`VoerkaI18n`提供了一个`@voerkai18n/cli`,用来实现文本提取/编译等命令行工具，一般应该安装到全局。

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


## 可选安装包

`@voerkai18n/cli`提供了完整的工具链帮助你构建国际化应用，在实际应用中，你可能需要根据应用的框架选择性安装一些包。

| 包名 | 说明 |
| --- | --- |
| **核心包** | |
| `@voerkai18n/runtime` | 核心运行时 |
| `@voerkai18n/formatters` | 可选的`插值变量`处理插件 |
| `@voerkai18n/patch` | 可选的，提供在线语言补丁编辑功能 |
| **构建工具** | |
| `@voerkai18n/babel` | 可选的`babel`插件 |
| `@voerkai18n/plugins` | 基于`unplugin`开发的构建时插件 |
| `@voerkai18n/webpack` | 可选的`voerkai18n-loader for webpack` |
| **框架集成相关** | |
| `@voerkai18n/vue` | 适用于`Vue3`的`vue`插件 |
| `@voerkai18n/vue2` | 适用于`Vue2`的插件 |
| `@voerkai18n/svelte` | 适用于`svelte`的插件 |
| `@voerkai18n/solid` | 适用于`solid`的插件 |
| `@voerkai18n/nextjs` | 适用于`nextjs`的插件 |
| `@voerkai18n/react` | 可选的，用来为React应用提供语言动态切换功能 |
| `@voerkai18n/webcomponent` | 可选的，WebComponet翻译组件 |

