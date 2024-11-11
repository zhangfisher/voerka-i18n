# UniApp

在`uniapp`中使用`voerkai18n init`时可能会遇到如下错误：`Cannot read properties of undefined (reading 'name')`

原因是`uniapp`创建时只有`manifest.json`，而没有`package.json`，就算有了`package.json`也可能缺少相应的`name`字段，`voerkai18n init`会尝试在读取`package.json`的`name`作为`i18nScope.id`，因此会报错。

**解决方法:**

- 在项目根目录下创建一个空的`package.json`文件即可,并且确保指定了`name`字段即可。
- 在`V2.0.7`以上解决了此问题

其他用法与普通Vue项目一致。
