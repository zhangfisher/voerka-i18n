# 常见问题<!-- {docsify-ignore-all} -->

## 提取翻译内容是否能够过滤注释？

是的，翻译内容是可以过滤注释的。
翻译前会采用正则表达式过滤掉注释内容,如果有特殊情况，请提出issue。

## 是否支持查看哪些文件包含提取结果？

在`languages/translate/default.json`中会显示从哪一个文件提取的。

```json
{
    " - 更新格式化器:{}": {
        "en": " - Update formatters:{}",
        "$files": [
            "compile.command.js"  // 代表是从该文件中提取的
        ]
    }
}
```
## 如何处理不同上下文下的一词多译的情况？

一词多译指的是一个词在不同的地方要翻译显示为不同的内容。
比如`t("确定")`，在不同的上下文中，可能需要分别翻译为`OK`或`Complate`，但是提取内容时则内能提出同一个词`确定`，这就导致无法做到一词多译。

很抱歉，现有版本没有针对此做特别的处理,您需要在不同上下文使用不同的中文词条，避免使用一词多译。

在下一版本中将考虑此问题的处理机制，


## 如何高效改造旧项目?

目前`VoerkaI18n`没有提供相应的插件或工具来将其他国际化方案迁移到`VoerkaI18n`。

如果你的项目原来没有使用任何国际化方案，可以尝试以下方案来减轻一些工作量。

**可以在`VSCODE`中使用在文件中替换，然后输入正则表达式`(['"]([^'"\n\\]|\\[\s\S])*[\u4E00-\u9FFF]([^'"\n\\]|\\[\s\S])*['"])`，替换成`t($0)`**

这样可以将大部分包括中文且使用"xxx",'xxxx'的替换成`t("xxxx")`形式。

但是由于实际情况很复杂，哪些需要翻译哪些不需要等等，单靠一个正则表达式替换是不能解决问题的，即容易误伤，也容易出错。

只能说可以减少一些工作量，需要更多的人工介入才可以的。

## 为什么指定了`activeLanguage`不能生效？

为什么有时指定了`activeLanguage`参数后，还是不能生效？

**原因可能是：**

`VoerkaI18n`默认情况下会在`LocalStorage`下存储最近切换的语言，当您修改了`languages/index.(js|ts)`中的`activeLanguage`配置后.
由于`LocalStorage`中已经有值(`上一次记住的activeLanguage`)了，所以`VoerkaI18n`会优先使用`LocalStorage`中的值，而不是`activeLanguage`中的值。

这样就造成了`activeLanguage`不能生效的现象。

**解决方案：**

- 清空`LocalStorage`中的`language`值，然后刷新页面即可。

## 提示出错

- **运行时提示错误：`[VoerkaI18n] 默认语言包必须是静态内容,不能使用异步加载的方式.`?**

在`languages/index.(ts|js)`中，指定`default=true`的语言包必须是直接`import`的，不能使用异步加载的方式`()=>import()`。

```ts
// 语言配置文件

const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "Chinese"
        },
        {
            "name": "en",
            "title": "English",
            "default":true, 
        } 
    ] 
}

// 错误示例

import defaultMessages from "./zh.js"  
const messages = {
    'zh' : defaultMessages,
    // 由于默认语言是en,采用了异步加载的，所以会报错
	'en' :  ()=>import("./en.js") 
}

// 正确示例
import defaultMessages from "./en.js"  
const messages = {
    'zh' : ()=>import("./en.js"),
	'en' : defaultMessages   // 正确：静态加载
}

```


## `defaultLanguage`和`activeLanguage`

- **默认语言**(`defaultLanguage`)：

指的是直接写在代码里面的语言。一般情况下，国产软件一般默认中文为默认语言，也就是我们直接在代码里面写的语言，如`t("中文")`。并且在执行`voerkai18n translate`命令时，总是将默认语言翻译成其他语言。

- **激活语言**(`activeLanguage`)：

指是界面上实际显示的语言，我们切换语言时，就是切换的激活语言。

在`settings.json`中，**默认语言**和**激活语言**可以相同，也可以不同。

