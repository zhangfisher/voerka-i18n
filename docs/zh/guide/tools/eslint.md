# eslint

针对大型的`Vue`项目, 如果要将国际化方案迁移到了`VoerkaI18n`, 需要对项目代码中需要翻译的内容进行扫描然后包裹`t`函数。如果手动完成这个工作量是非常大的,这时需要一些相关工具才可以更有效率地完成此工作。

我们提供以下方案：

- `voerkai18n wrap`命令行工具，该工具使用`AI`来扫描项目中的代码，然后自动包裹`t`函数，见[voerkai18n wrap](./cli)
- `eslint`插件，该插件可以帮助我们在代码编写的过程中就完成包裹`t`函数的工作，只需要在代码中按下保存就可以完成包裹`t`函数的工作。

[eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-i18n-wrap)是由贡献者`shuiyangsuan`开发完成，感谢`shuiyangsuan`