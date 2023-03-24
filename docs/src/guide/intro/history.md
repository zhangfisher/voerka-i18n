# 更新日志

## 2023/3/24

- 在`@voerkai18n/cli`中引入`string.prototype.replaceAll`,解决在`nodejs 15`以下无法正常使用的问题

## 2023/2/13

- 修改`@voerkai18n/cli`命令入口文件的换行行为`lf`

## 2023/1/28

- 修复`voerkai18n init`生成`index.js`时的`i18nScope`拼写错误
- `voerkai18n init`添加`--typescript`参数支持
- 修复`voerkai18n init`的`moduleType=auto`时生成文件类型的问题
- 更新文档

## 2023/1/27

- 修复`voerkai18n init`生成的初始文件不完整的问题
- 新增加`voerkai18n-loader for webpack`，可以用在`Create React App`或`React Native`中实现自动导入和`idMap`自动替换翻译文本内容。
- 升级`@voerkai18n/utils`，增加`readIdMapFile`,`replaceTranslateText`,`hasImportTranslateFunction`,`importTranslateFunction`等工具函数。
- 增加`CRA`创建的`React`样例
- `@voerkai18n/vite`的`autoImport`支持在指定扩展名中进行自动导入。
## 2023/1/26

- 修复`@voerkai18n/cli`的`linux`下的脚本执行错误。感谢`cjahv`[PR#6](https://github.com/zhangfisher/voerka-i18n/pull/6)

## 2023/1/24

- `@voerkai18n/vite`默认不自动导入`t`函数 
- 重构`@voerkai18n/vue`，详见`指南`介绍 
- 新增`typescript`的`vue`例子

## 2023/1/11

- 重构`@voerkai18n/react`，支持自动重新渲染
- 修复`@voerkai18n/vite`插件在转码`jsx`组件时存在的`idMap`错误

## 2023/1/10

- 添加`typescript`类型支持
- 移除`@voerkai18n/runtime`的源码依赖方式
- 支持生成`languages`文件夹下的`typescript`文件

## 2022/8/24

- 全新灵活的格式化机制
- 新增加日期格式化
- 新增加货币格式化
- 调整运行时代码组织

## 2022/8/7

- 更新文档

## 2022/8/5

- 增加语言包补丁功能，可以在应用上线后动态更新修复翻译错误
- 增加动态加载语言包机制，可以在应用上线后动态添加语言支持