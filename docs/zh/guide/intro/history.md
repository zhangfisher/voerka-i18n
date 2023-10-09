# 更新日志<!-- {docsify-ignore-all} -->
## V2.0.20

- **[BUG]** 修复了`voerkai18n init`指定`-a`参数时无效的问题。

## V2.0.19

- **[BUG]** 修复未指定`language.active=true`时`activeLanguage`值不正确的问题.
## V2.0.18

- **[BUG]** 修复`@voerkai18n/cli compile`时导入默认语言和当前语言为空的错误
## V2.0.17

- **[BUG]** 修复当默认语言不是`zh`时出现的错误:`默认语言包必须是静态内容,不能使用异步加载的方式`的问题。
- **[BUG]** 修复`@voerkai18n/cli init`生成初始化时如果默认语言不是`zh`时出现的错误 
## V2.0.16

- **[BUG]** 修复`@voerkai18n/runtime`引用`esm`模块时出错导致`import`失败的问题。

## V2.0.15

- **@voerkai18n/cli**
    - **[特性]** 执行`voerkai18n extract -D`时显示提取的翻译文本的详细信息，当提取信息不符合要求供查询。
## V2.0.14

- **@voerkai18n/react**

    - **[BUG]** 修复了`typescript`类型错误
    - **[BUG]** 修复了`VoerkaI18nProvider`的启用`fallback`时的逻辑错误
    - **[DOC]** 新增加了`examples/react-ts`示例，用于演示在`typescript`中使用`@voerkai18n/react`的用法

## V2.0.13

- **[BUG]** 修复了`voerkai18n translate`未导入`getSettingsFromPackageJson`的错误.

## V2.0.12

- **[BUG]** 修复了当执行`voerkai18n extract`时出错：`Missing positive glob`的问题.感谢[zl_0110](https://gitee.com/zhangfisher/voerka-i18n/pulls/1/commits)

## V2.0.11

- **[BUG]** 修复了当执行`voerkai18n compile --skip`时出错的问题

## V2.0.10

- **[BUG]** 修复了引用`flex-tools/safeParseJson`导致在`safari`浏览器下的错误问题:`invalid group specifier name`.

## V2.0.9

- **[BUG]** 修复了在`html,vue`当存在`<!--  -->`空注释时提取翻译文本时误伤的问题
- **[特性]**: 支持指定`languages`文件夹位置

现在可以在`package.json`中指定`langauges`路径:
```json
{
    "voerkai18n":{
        "entry":"i18n"  // 将语言提取到src/i18n中
    }
}
```

## V2.0.8

- [BUG] 当`activeLangage`与`defaultLanguage`不一样时，编译生成的`languages/index.js`中出现了未定义的`activeFormatters`的错误。

## V2.0.7

- 新增加`voerkai18n/vue2`插件用于`Vue2`
- `@voerkai18n/cli`支持多种语言
- 增加`storage`机制在前端自动保存切换语言的状态
- 修复`vite`自动导入`t`时出错的问题
- 优化init时的错误提示

## V2.0
### 2023/6/18

历经多次迭代正式发布V2.0，主要更新如下：

- 核心运行时采用`TypeScript`重构，提供完整的类型支持
- 运行时`90%+`代码覆盖率的单元测试
- 完善了对多库联动机制
- 完善了对`React`的支持
- 完善了对`Vue`的支持
- 语言切换时可以自动存储状态，下次打开时自动恢复
- 增加了一些例子
- 改进了版本管理机制，现在所有包均采用统一的版本号
- 整体代码结构更加清晰，更加易于维护


## V1.0

### 2023/3/29

- **fix(runtime)** 在由于一些js引擎(如react-native Hermes )不支持正则表达式命名捕获组而导致运行时不能使用，所以本次更新移除命名捕获组，解决在`react-native`中出错的问题。

- **fix(utils)** 引入`string.prototype.replaceAll`,解决在`nodejs 15`以下无法正常使用的问题

- **test** 增加`pacakges/apps/nodejs`演示程序用于调试使用。

### 2023/3/27

- [Fix] 修复`@voerkai18n/cli extract`在`nodejs < 15`版本下由于缺少`replaceAll`而导致出错的问题，现在在`nodejs >=12`时也可以运行
- [BUG] 修复`@voerkai18n/cli`命令因为`logsets`依赖升级后导致的`RangeError: Invalid array length`错误

### 2023/3/24

- 在`@voerkai18n/cli`中引入`string.prototype.replaceAll`,解决在`nodejs 15`以下无法正常使用的问题

### 2023/2/13

- 修改`@voerkai18n/cli`命令入口文件的换行行为`lf`

### 2023/1/28

- 修复`voerkai18n init`生成`index.js`时的`i18nScope`拼写错误
- `voerkai18n init`添加`--typescript`参数支持
- 修复`voerkai18n init`的`moduleType=auto`时生成文件类型的问题
- 更新文档

### 2023/1/27

- 修复`voerkai18n init`生成的初始文件不完整的问题
- 新增加`voerkai18n-loader for webpack`，可以用在`Create React App`或`React Native`中实现自动导入和`idMap`自动替换翻译文本内容。
- 升级`@voerkai18n/utils`，增加`readIdMapFile`,`replaceTranslateText`,`hasImportTranslateFunction`,`importTranslateFunction`等工具函数。
- 增加`CRA`创建的`React`样例
- `@voerkai18n/vite`的`autoImport`支持在指定扩展名中进行自动导入。

### 2023/1/26

- 修复`@voerkai18n/cli`的`linux`下的脚本执行错误。感谢`cjahv`[PR#6](https://github.com/zhangfisher/voerka-i18n/pull/6)

### 2023/1/24

- `@voerkai18n/vite`默认不自动导入`t`函数 
- 重构`@voerkai18n/vue`，详见`指南`介绍 
- 新增`typescript`的`vue`例子

### 2023/1/11

- 重构`@voerkai18n/react`，支持自动重新渲染
- 修复`@voerkai18n/vite`插件在转码`jsx`组件时存在的`idMap`错误

### 2023/1/10

- 添加`typescript`类型支持
- 移除`@voerkai18n/runtime`的源码依赖方式
- 支持生成`languages`文件夹下的`typescript`文件

### 2022/8/24

- 全新灵活的格式化机制
- 新增加日期格式化
- 新增加货币格式化
- 调整运行时代码组织

### 2022/8/7

- 更新文档

### 2022/8/5

- 增加语言包补丁功能，可以在应用上线后动态更新修复翻译错误
- 增加动态加载语言包机制，可以在应用上线后动态添加语言支持