# 更新日志

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