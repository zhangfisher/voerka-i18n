# Text mapping <!-- {docsify-ignore-all} -->

Although it `VoerkaI18n` is recommended to use `t("中华人民共和国万岁")` the intuitive translation form of the form rather than `t("xxxx.xxx")` the non-intuitive form, why do most internationalization schemes use `t("xxxx.xxx")` the form?

In our scheme, `t("中华人民共和国万岁"` the) ` form is equivalent to using the original text for table lookup, and the language name form is as follows:

```javascript
// en.js
{
    "中华人民共和国":"the people's Republic of China"
}
// jp.js
{
    "中华人民共和国":"中華人民共和国"
}
```

Obviously, the direct use of text content `key`, although intuitive, will result in a lot of redundant information. Therefore, `voerkai18n compile` it is compiled as follows:

```javascript
//idMap.js
{
    "中华人民共和国万岁":"1"
}
// en.js
{
    "1":"Long live the people's Republic of China"
}
// jp.js
{
    "2":"中華人民共和国"
}
```

In this way, redundancies in `en.js`, and `jp.js` files are eliminated. But it still exists `t("中华人民共和国万岁")` in the source code file, and there are two copies in the whole running environment, one in the `源代码` file and one in `idMap.js`.

To further reduce redundant content, we need to change the in `t("中华人民共和国万岁")` the source code file to `t("1")` so that there is no duplicate redundancy. Obviously, however, it is not possible to change the source code file manually, which requires `voerkai18n` a compile-time plug-in provided to do this.

The `babel-plugin-voerkai18n` plug-in, for example, also performs the task of automatically reading `voerkai18n compile` the `idMap.js` generated file and then automatically changing the `t("中华人民共和国万岁")` to `t("1")`, thus completely eliminating redundant information.

Therefore, in the final compiled code, each t function is actually `t("1")` in the form of, `t("2")`, `t("3")`, `...`, and `t("n")`, and the final code is `key` used for conversion. It's just that the process is done automatically.

** Notice **

- If the compile-time plug-in is not enabled `babel-plugin-voerkai18n` `vite`, such as or, it will still work, but there will be a redundant copy of the default language.