# 更改语言目录

默认情况下，`voerkai18n`使用`languages`或`src/languages`作为工作目录，里面保存所有提取的内容和编译代码。
`voerkai18n`还识别当前工程下是否有`src`文件夹，如果有则使用`src/languages`。

绝大多数情况下，`languages`目录具有清晰的语义，一般不需要更改，但是`voerkai18n`也提供更改的方法：

在当前工程的`package.json`中修改，如下

```json
// package.json

{

    "voerkai18n":{
        "entry":"i18n"
    }
}

```

**说明:**

- `entry`不能使用绝对路径，只能使用相对路径。如 `entry='i18n'`，则代表语言目录为`<Project Root>/i18n`或`<Project Root>/src/i18n`。
- 当前工程下是否有`src`文件夹,`voerkai18n`会自动`src/<entry>`，所以不需要指定`src/i18n`。
- 