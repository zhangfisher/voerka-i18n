# 一词多译

`一词多译`指的是同样一个词，在不同的场景下需要翻译成不同的词。
比如`确定`，可能在不同的场合下，会分别需要被翻译成`OK`、`confirm`、`yes`、`sure`等。

这时我们可以采用插值变量注释的方法来标识。

```ts
t("确定{ok}")
t("确定{confirm}")
t("确定{yes}")
t("确定{sure}") 

```

这样，在提取和编译时就会被识别为`确定`的`一词多译`，而插值变量`ok`、`confirm`、`yes`、`sure`如果没有为之提供对应的变量会被忽略，仅起占位注释的作用。

