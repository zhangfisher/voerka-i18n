# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

VoerkaI18n 是一个为 JavaScript/TypeScript/Vue/React/Solidjs/SvelteJs/ReactNative 设计的国际化解决方案，提供全流程工程支持，包括文本提取、自动翻译、编译和动态语言切换。

## 核心架构

这是一个 monorepo 项目，使用 Turbo 进行构建管理，包含以下核心包：

- **@voerkai18n/runtime**: 核心运行时，提供 i18n 管理器、作用域、存储等功能
- **@voerkai18n/cli**: 命令行工具，用于初始化、提取、编译、自动翻译等
- **@voerkai18n/utils**: 工具函数库
- **@voerkai18n/formatters**: 格式化器
- **@voerkai18n/[framework]**: 各框架适配器 (vue, vue2, react, solid, svelte, astro, nextjs 等)
- **@voerkai18n/[tools]**: 构建工具集成 (babel, webpack, plugins)

## 常用命令

### 项目管理
```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 监听模式构建
pnpm build:watch

# 发布所有包
pnpm publish:all

# 代码检查
pnpm lint
```

### CLI 工具使用
```bash
# 初始化 i18n 项目
voerkai18n init

# 提取需要翻译的文本
voerkai18n extract

# 自动翻译（使用 qwen API）
voerkai18n translate --api qwen

# 编译语言包
voerkai18n compile

# 生成 TypeScript 支持
voerkai18n compile --typescript

# 指定模块类型
voerkai18n compile --module-type esm,cjs
```

### 测试
```bash
# 运行运行时测试
pnpm test:runtime

# 运行单个包的测试（在 packages 目录下）
cd packages/runtime && pnpm test
cd packages/runtime && pnpm test:coverage
```

### 文档
```bash
# 开发文档
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览文档
pnpm docs:preview
```

## 开发工作流程

### 1. 新功能开发
1. 在相关包的 `src` 目录下开发
2. 使用 `tsup` 进行构建，配置在 `tsup.config.ts` 中
3. 运行测试确保功能正常
4. 使用 Changesets 管理版本变更

### 2. CLI 命令开发
- CLI 命令位于 `packages/cli/src/commands/` 下
- 每个命令都是独立的模块，使用 MixCLI 框架
- 支持多语言提示，使用 `t()` 函数进行国际化

### 3. 框架适配器开发
- 各框架适配器提供相应框架的集成组件
- Vue 适配器使用 Composition API
- React 适配器提供 Hooks 和组件
- 所有适配器都依赖 `@voerkai18n/runtime`

## 构建配置

### 包构建
- 使用 `tsup` 作为构建工具
- 输出 ESM、CJS、IIFE 格式
- 自动生成 TypeScript 声明文件
- 支持监听模式开发

### Turbo 配置
- 支持依赖图构建 (`dependsOn: ["^build"]`)
- 输出缓存优化 (`outputs: ["dist/**"]`)
- 测试依赖构建 (`test: { dependsOn: ["build"] }`)

## 关键特性

### 文本提取和翻译
- 支持从源代码自动提取需要翻译的文本
- 集成在线翻译服务 API
- 支持插值变量和复杂格式化

### 动态语言切换
- 运行时动态切换语言
- 支持语言包异步加载
- 提供回退机制

### 类型安全
- 完整的 TypeScript 支持
- 自动生成类型定义
- 编译时类型检查

## 包管理

- 使用 `pnpm` 作为包管理器
- 工作区依赖使用 `workspace:*` 或 `workspace:^`
- 发布前自动执行 `pnpm build`

## 示例项目

在 `examples/` 目录下包含各框架的使用示例：
- Vue 3 + TypeScript
- React
- SolidJS
- Svelte
- Astro
- Node.js 等

参考这些示例了解最佳实践和集成方式。