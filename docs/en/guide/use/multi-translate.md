# Multiple Translations for One Word

`Multiple translations for one word` refers to situations where the same word needs to be translated differently in different contexts.
For example, the Chinese word "确定" might need to be translated as `OK`, `confirm`, `yes`, `sure`, etc., in different situations.

In such cases, we can use interpolation variable annotations to identify different contexts.

```ts
t("确定{ok}")
t("确定{confirm}")
t("确定{yes}")
t("确定{sure}") 
```

This way, during extraction and compilation, these will be recognized as `multiple translations` for "确定", and the interpolation variables `ok`, `confirm`, `yes`, `sure` will be ignored if no corresponding variables are provided, serving only as placeholder annotations.
