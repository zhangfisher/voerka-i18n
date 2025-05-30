# VoerkaI18n Lit Example

这是一个使用 VoerkaI18n 和 Lit 的示例项目，展示了如何在 Lit 应用中集成 VoerkaI18n 进行国际化。

## 功能特性

- 使用高阶组件 (HOC) 方式集成国际化
- 使用 Hooks API 方式集成国际化
- 支持语言切换
- 支持带参数的翻译
- 支持组件化翻译
- 支持段落翻译

## 项目结构

```
src/
├── index.ts          # 主入口文件，包含示例组件
└── languages/        # 国际化配置目录
    ├── messages/     # 翻译消息文件
    ├── prompts/      # AI 翻译提示词
    ├── component.ts  # 翻译组件配置
    ├── index.ts      # 国际化入口
    ├── loader.ts     # 语言包加载器
    ├── settings.json # 语言设置
    ├── storage.ts    # 语言偏好存储
    └── transform.ts  # 翻译转换器
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 国际化工作流程

本项目使用 VoerkaI18n 进行国际化，完整的工作流程如下：

1. 初始化国际化配置
   
   ```
   pnpm i18n:init
   ```
   这将创建基本的国际化目录结构和配置文件。

2. 提取需要翻译的文本
   
   ```
   pnpm i18n:extract
   ```
   此命令会从源代码中提取所有使用 t() 函数包裹的文本，并生成 idMap.json。

3. 翻译提取的文本
   
   ```
   pnpm i18n:translate
   ```
   使用配置的翻译服务（本项目使用 qwenmax AI）翻译提取的文本。

4. 编译翻译结果
   
   ```
   pnpm i18n:compile
   ```
   将翻译结果编译为最终的语言包文件。

5. 自动包裹需要翻译的文本 （可选）
   
   ```
   pnpm i18n:wrap
   ```

   使用 AI 自动识别并包裹代码中的文本字符串。

   
## 集成方式

VoerkaI18n 在 Lit 中提供了两种集成方式：

### 1. 使用高阶组件 (HOC)

```
import { withI18n } from '@voerkai18n/lit';

class MyComponent extends withI18n(LitElement) {
  render() {
    return html`<div>${this.t('Hello World')}</div>`;
  }
}
```
### 2. 使用 Hooks API

```
import { useI18n } from '@voerkai18n/lit';

class MyComponent extends LitElement {
  i18n = useI18n(this);
  
  render() {
    return html`<div>${this.i18n.t('Hello World')}</div>`;
  }
}
```
## 了解更多

有关 VoerkaI18n 的更多信息，请访问 [官方文档](https://zhangfisher.github.io/voerka-i18n/) 。