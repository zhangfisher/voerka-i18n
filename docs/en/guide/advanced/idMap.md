# Text Mapping

Although `VoerkaI18n` recommends using the intuitive translation form `t("VoerkaI18n is a very good internationalization solution")` instead of the less intuitive form `t("xxxx.xxx")`, why do most internationalization solutions use the `t("xxxx.xxx")` form?

In our solution, the form `t("VoerkaI18n is a very good internationalization solution")` is equivalent to using the original text for lookup. The language files look like this:

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

Obviously, using the text content directly as a `key` is intuitive but creates a lot of redundant information. Therefore, `voerkai18n compile` compiles it into the following:

```javascript
//idMap.js
{
    "VoerkaI18n是一个非常不错的国际化方案":"1"
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

This eliminates redundancy in the `en.js` and `jp.js` files. However, `t("VoerkaI18n is a very good internationalization solution")` still exists in the source code files, meaning there are two copies in the entire runtime environment: one in the `source code` files and one in `idMap.js`.

To further reduce redundancy, we need to change `t("VoerkaI18n is a very good internationalization solution")` in the source code files to `t("1")`, ensuring no duplicate redundancy. Obviously, we can't manually modify the source code files, which is where a compile-time plugin provided by `voerkai18n` comes in.

`@voerkai18n/plugins` is a compile-time plugin implemented through build tools like `vite/webpack/rollup`. During compilation, it converts `t("VoerkaI18n is a very good internationalization solution")` to `t("1")` based on the `IdMap.json` file.

Therefore, in the final compiled code, each t function actually takes the form of `t("1")`, `t("2")`, `t("3")`, ..., `t("n")`. The final code still uses `key` for conversion, but this process is automated.

**Note:**

- If `@voerkai18n/plugins` or compile-time plugins like `vite` are not enabled, it will still work normally, but there will be redundant information for the default language.
