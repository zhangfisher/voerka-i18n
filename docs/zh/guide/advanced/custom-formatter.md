# 格式化器

## 概念

格式化器是`voerkai18n`中引入的用来对翻译内容中的插值变量进行链式处理的一种机制，目的是为不同的语言下对内容中的插值变量进行动态处理。格式化器机制为`voerkai18n`中的日期时间、货币等多语言输出提供了强大灵活、可扩展、可配置的处理方案。

`@voerkai18n/formatters`提供了以下格式化器：

| 格式化器名称 | 说明 |
| --- | --- |
| `currency` | 货币格式化器 |
| `date` | 日期格式化器 |
| `month` | 月份格式化器 |
| `time` | 时间格式化器 |
| `timeSlots` | 时间格式化器 |
| `quarter` | 季度格式化器 |
| `weekday` | 星期格式化器 |
| `number` | 数字格式化器 |
| `relativeTime` | 相对时间格式化器 |  


## 指南

### 默认配置

默认情况下,`voerkai18n`提供了一些内置的格式化器。

```ts {1,3}
import formatters from "@voerkai18n/formatters" 
export const i18nScope = new VoerkaI18nScope({       
    formatters,                                         
    // ...
}) 
```

### 按需配置

`@voerkai18n/formatters`提供了一些内置的格式化器,但也需要额外增加应用包大小。如果你的应用中只需要部分格式化器,也可以按需要配置需要的格式化器。

```ts  
import timeFormatter from "@voerkai18n/formatters/time" 
import currencyFormatter from "@voerkai18n/formatters/currency" 
import dateFormatter from "@voerkai18n/formatters/date"
import numberFormatter from "@voerkai18n/formatters/number"
import relativeTimeFormatter from "@voerkai18n/formatters/relativeTime"
import quarterFormatter from "@voerkai18n/formatters/quarter"
import weekdayFormatter from "@voerkai18n/formatters/weekday"
import monthFormatter from "@voerkai18n/formatters/month"
import timeSlotsFormatter from "@voerkai18n/formatters/timeSlots"

export const i18nScope = new VoerkaI18nScope({       
    formatters: [
        timeFormatter                   // [!code ++]
        currencyFormatter               // [!code ++]
        dateFormatter                   // [!code ++]
        numberFormatter                 // [!code ++]
        relativeTimeFormatter           // [!code ++]
        quarterFormatter                // [!code ++]
        weekdayFormatter                // [!code ++]
        monthFormatter                  // [!code ++]
        timeSlotsFormatter              // [!code ++]
    ],                                         
    // ...
}) 
```

### 配置格式化器

`@voerkai18n/formatters`内置支持`zh-CN`、`en-US`两种语言的格式化器,其他语言的格式化器需要自行配置。

比如，内置的`currency`格式化器不支持日语，要增加`ja-JP`支持，可以在`languages/formatters.json`文件中进行配置。

```json {3-19}
{
    "ja-JP":{
        "currency" : {
            "units"    : ["","千","百万","十亿","万亿"],
            "radix"    : 4,                       
            "symbol"   : "¥",
            "prefix"   : "JPY",
            "suffix"   : "円",
            "division" : 3,
            "precision": 2,
            // 指定默认的格式化规则模板名称
            "format"   : "long",  // [!code ++]                
            // 预定义格式化规则模板
            "default" : "{symbol}{value}{unit}",
            "long"    : "{prefix} {symbol}{value}{unit}{suffix}",
            "short"   : "{symbol}{value}{unit}",
            "custom"  : "{prefix} {symbol}{value}{unit}{suffix}",
            "bitcoin" : "BTC {symbol}{value}{unit}{suffix}"
        }
    },
    // ... 其他语言的货币格式化规则
}
```

:::warning 提示
欢迎大家贡献更多的格式化器，可以提交`PR`到[@voerkai18n/formatters](https://github.com/zhangfisher/voerka-i18n/tree/master/packages/formatters)项目。
:::


### 自定义格式化器

格式化器是基于[flexvars](https://zhangfisher.github.io/flexvars/)开发实现。

格式化器具有以下特点：

- 本质上是一个普通的同步函数
- 支持`有参`和`无参`两种调用方式
- 支持通过管道符`|`进行链式调用
- 格式化器函数最后一个参数是当前语言的格式化器配置参数`$config`
- 格式化器函数`this`指向`scope`实例

**下面我们来开发一个简单的`book`格式化器，用来格式化书名。在`en_US`时输出`<书名>`，在`zh_CN`时输出`《书名》`。**

```ts
import { i18nScope } from "./languages"
import { createFormatter } from "@voerkai18n/formatters"

const book = createFormatter<NumberFormatterArgs,NumberFormatterConfig>({
    name: "book",
    args:["begin","end"],
    next(value,args,ctx){
        const config  = ctx.getConfig()
        return `${config.begin}value${config.end}`
    }
},
// 以下是不同语言的格式化器配置
{
    "en-US":{
        begin : "<"
        end   : ">"
    },
    "zh-CN":{
        begin : "《"
        end   : "》"
    }    
})

i18nScope.formatters.register(book)   // [!code ++]
```

- 上面的代码中，我们定义了一个`book`格式化器，用来格式化书名，然后在`i18nScope`中注册。
- `book`格式化器接受两个参数`begin`和`end`，分别用来指定书名的前缀和后缀。


注册后就可以在翻译内容中使用`{book}`格式化器了。

```ts
t("书名：{name | book }", "《三体》")
await changeLanguage("en-US")
t("书名：{name | book }", "<三体>")
```

- 格式化支持通过有参调用方式覆盖格式化默认参数。

```ts
t("书名：{name | book('[') }", "[三体》")
t("书名：{name | book('[',']') }", "[三体]")
t("书名：{name | book({begin:'[',end:']'}) }", "[三体]")
```

### 全局格式化器

使用创建格式化时可以指定`global=true`将该文件声明的格式化器均注册到全局中,这样格式化可以在所有`VoerkaI18nScope`中生效。

```ts
i18nScope.formatters.register(book,true)  // [!code ++]
```

- 在`languages/index.ts`中注册格式化器自动注册为全局。

```ts {3}
import formatters from "@voerkai18n/formatters"
const i18nScope = new VoerkaI18nScope({       
    formatters,  // 自动注册为全局格式化器                                         
    // ...
}) 

// 仅在当前作用域生效                 // [!code ++]  
i18nScope.formatters.register(book)   // [!code ++]

// 全局生效                 // [!code ++]  
i18nScope.formatters.register(book,true)   // [!code ++]
```


:::warning 提示
格式化器是基于[flexvars](https://zhangfisher.github.io/flexvars/),更详细的开发细节请参阅其官网[文档](https://zhangfisher.github.io/flexvars/)。
:::