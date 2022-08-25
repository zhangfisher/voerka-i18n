---
sidebar: heading
---

# 源码贡献

`voerkai18n`是开源项目，欢迎大家贡献源码。

## 获取源码

`voerkai18n`在[Github](https://github.com/zhangfisher/voerka-i18n)和[Gitee](https://gitee.com/zhangfisher/voerka-i18n)上面同步开源。

### 拉取源码

```shell
git clone https://gitee.com/zhangfisher/voerka-i18n
```

### 安装依赖

`voerkai18n`是一个`monorepo`多包工程，使用`pnpm`作为包管理器。所以首先需要安装`pnpm`。

```javascript | pure
> npm install -g pnpm
```

然后再使用`pnpm install`

## 源码结构

```javascript | pure
voerkai18n
  packages
    autopublish					// 自动发布工具，仅用于开发阶段
    babel						// @voerkai18n/babel插件
    cli							// @voerkai18n/cli命令行工具
    formatters					// @voerkai18n/formatters通用的格式化器
    react						// @voerkai18n/react
    runtime						// @voerkai18n/runtime
    utils						// @voerkai18n/utils工具库
    vite						// @voerkai18n/vite插件
    vue    						// @voerkai18n/vue插件
  	apps						// 测试应用
  test  						// 单元测试用例
  docs							// 文档网站Vuepress
  readme.md
```

## 工作原理

![](/images/arch.png)

## 开发格式化器



## 单元测试



## 文档




## 发布







