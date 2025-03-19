# 工作流

`VoerkaI18n`是一完整的工程化的国际化解决方案，提供了一整套工作流来简化国际化的开发流程。

基本工作流程如下：

## 第1步：初始化工程

使用`voerkai18n init`执行初始化，创建相应的语言文件夹，默认在`src/languages`。

## 第2步：配置应用

- 根据项目类型框架，安装相应的集成库，如`@voerkai18n/react`、`@voerkai18n/vue`、`@voerkai18n/vue2`等。
- 配置应用，如安装相应的插件等。

## 第3步：使用翻译函数和组件

```ts
t("VoerkaI18n是一个国际化解决方案")
<Translate message="VoerkaI18n是一个国际化解决方案" />
<Translate id="voerka">
段落内容
</Translate>
```

- 可以在源码中从`src/languages`中导入翻译函数`t`和`Translate`组件。
- 在某此集成库可能将`t`函数或`Translate`组件注册为全局可以使用，见相应的集成库。

## 第4步：提取翻译内容

使用`voerkai18n extract`命令提取翻译内容，将要翻译的文本和段落生成到：

- **普通文本：** 提取到`languages/translates/messages/*.json`
- **段落：** 提取到`languages/translates/paragraphs/*.html`

## 第5步：翻译内容

使用`voerkai18n translate`命令翻译内容。

## 第6步：编译语言包

使用`voerkai18n compile`命令编译语言包，生成到:

- **普通文本：** `languages/messages/`
- **段落：** `languages/paragraphs/`

