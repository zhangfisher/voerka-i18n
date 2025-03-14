# 货币

`@voerkai18n/formatters`内置强大的`currency`格式化器用来进行多语言场景下的货币显示。 

默认情况下，在`languages/index.{js|ts}`文件中已经导入了`@voerkai18n/formatters`

```ts
import formatters from "@voerkai18n/formatters"
// .....
export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({        
    ...
    formatters,    // [!code ++]
    ...
}) 
```

## 货币组成

为了支持灵活的货币格式输出，`currency`格式化器将一个**完整的货币字符串**划分为五部分:

| 前缀  |  符号  |  值   | 单位   | 后缀  | 
| :---: |  :---:  |  :---:   | :---:   | :---:  | 
| `prefix`  |  `symbol` |  `value`   | `unit` | `suffix`  | 

货币表示可以由`prefix`、`symbol`、`value`、`unit`、`suffix`五部份组成。

## 基本用法

当需要对货币本地化显示时，请使用相对应的`currency`格式化器，可以在`t`函数中使用来对`Number`类型进行本地化格式输出。

:::warning 提示
`currency`格式化器本质上是一个函数，其参数如下:
**currency(`format`,`unit`,`precision`,`prefix`,`suffix`,`division`,`symbol`,`radix`)**
:::


### 无参数(默认格式) 

```js
t("{ value | currency}",1234.56)    // == ￥1234.56
await scope.change("en")
t("{ value | currency}",1234.56)    // == $1,234.56    
```

### **指定货币单位** 

```js
t("{ value | currency('long',1)}",1234.56)                 // 长格式: 万元
t("{ value | currency('long',2)}",1234.56)                 // 长格式: 亿
t("{ value | currency('long',3)}",1234.56)                 // 长格式: 万亿
t("{ value | currency('long',4)}",1234.56)                 // 长格式: 万万亿
await scope.change("en")
t("{ value | currency('short')}",1234.56)                   // 短格式
t("{ value | currency('short',1)}",1234.56)                 // 短格式 Thousands
t("{ value | currency('short',2)}",1234.56)                 // 短格式 Millions
t("{ value | currency('short',3)}",1234.56)                 // 短格式 Billions
t("{ value | currency('short',4)}",1234.56)                 // 短格式 Trillions
```




### **指定位置参数** 
`currency`格式化器支持`format`,`unit`,`precision`,`prefix`,`suffix`,`division`,`symbol`,`radix`等位置参数，可以根据需要依次传入这些参数来控制货币输出。

```js
// t("{ value | currency(<format>,<unit>,<precision>,<prefix>,<suffix>,<division>,<symbol>,<radix>)}",1234.56)
t("{ value | currency('long',1)}",1234.56)                 // 长格式: 万元
t("{ value | currency('long',1,2,'人民币')}",1234.56)                 
t("{ value | currency('long',1,2,'人民币','元',3,'')}",1234.56)                 
```

### **指定对象参数**  

使用位置参数时，只能按顺序输入，如果我们只想为货币输出指定一个后缀，则需要像以下方式来传参:

```js
t("{ value | currency('long',1,2,'人民币','元',3,'<后缀>')}",1234.56)                 
t("{ value | currency('long',,,,,,'<后缀>')}",1234.56)                 
```
`currency`格式化器支持通过对象方式进行传参，像这样：
```js
t("{ value | currency({format:'long',suffix:'<后缀>'})}",1234.56)                       
```

### **预定义格式** 

内置支持`default`、`long` 、`short`、`custom`等预定义格式，不同语言其输出格式是不同的。

```js
t("{ value | currency('long')}",1234.56)    // == 长格式输出： RMB￥1234.56元
t("{ value | currency('short')}",1234.56)    // ==短格式输出 ￥1234.56
await scope.change("en")
t("{ value | currency('long')}",1234.56)    // == $1,234.56
t("{ value | currency('short')}",1234.56)   // == USD $1,234.56    
```
预定义格式是在语言格式化文件中配置好的输出模板。
例如：`zh`语言的`long`预定义格式是 `{prefix} {symbol}{value}{unit}{suffix}`


## 参数

`currency`格式化器支持参数：

| 参数  | 类型  | 默认值  |    说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `default` | 取值`long`,`short`,`default`,`<模板字符串>`  |
| `unit` | `Number`  | `0` |  进制位，如`万`、`亿`,`万亿`,`万万亿` |
| `precision` | `Number`  | `2` | 即小数精度 |
| `prefix` | `String`  | `''` | 前缀 | 
| `suffix` | `String `  | `''` | 后缀，不同语言默认值不同 | 
| `division` | `Number`  | ` ` | 逗号分割位，如`3`代表每`3`位加一个逗号 |
| `symbol` | `String`  | `''` | 货币符号，不同语言默认值不同,中文默认是`￥`，英文`$` | 
| `radix` | `Number`  | `` | unit进制，不同语言默认值不同,中文默认是`4`，英文`3` | 

### radix 

英文中，每3个数字加一个逗号，对应`thousands`,`millions`,`billions`,`trillions`,....。
而中国更加习惯每`4`个数字进一个位，表达时会习惯使用元、万、亿来表示。
如用英文表示`123,456,789.00`，我们要看半天才知道是多少。
而如果用四位分割`1,2345,6789.00`，则我们很容易就看出是1亿...。
而`radix`参数就是用来配置多个位一个单位的。中文时默认是`4`，英文时默认是`3`。

### division
    
该参数用来指示每`division`个数字加一个逗号,该参数与`radix`的区别在哪里？
虽然，货币如果采用四位一逗号方式更加符合我们中国人的阅读习惯，但是现实由也很经常使用三位一逗号的表达方式。
也就是说，可以通过只需要使用`division`参数就可以配置为三位一逗号或四位一逗号。
如果说中文三位一逗号或四位一逗号均可以接受，但是在不是以元为单位，而是以万元、亿来表示货币单位时，中文与英文差异就非常明显了，我们一般会说多少万，多少亿，而不会以英文三位一进的方式，说多少千。
`radix`与`division`的差别就在于此，`division`仅仅是用来指示多少位加一个逗号，而`radix`用来指示当要使用货币的进制单位时，以多少做一个进制。英文`radix=3`，就对应`thousands`,`millions`,`billions`,`trillions`
而中文`radix=4`，就对应`万`、`亿`、`万亿`、...
也说是说，`radix`参数仅当指定`unit`值`>0`时用来计算出合适的单位使用的。 

### format

`format`参数用来配置一个模板字符串，该模板字符串可以由五个占位符（`{prefix}`、`{symbol}`、`{value}`、`{unit}`、`{suffix}`）自由组合来输出货币。

并且不同语言或不同的应用场景，可以通过配置`format`模板字符串，自由组合货币输出格式。

**例：**

- `format = "{symbol} {value}{unit}"`  ==>  `￥ 123.45元`
- `format = "{prefix} {symbol} {value}{unit}"`  ==>  `人民币：￥123.45元`


## 配置格式化规则

### 内置格式化规则

`currency`格式化器内置支持`zh-CN`和`en-US`两种语言的货币格式化规则。

```ts
{
    "en-US":{
        //千,百万,十亿,万亿
        units    : [""," thousands"," millions"," billions"," trillions"],    
        // 进制，即三位一进，中文是4位一进
        radix    : 3,                       
        symbol   : "$",                     // 符号
        prefix   : "USD",                   // 前缀
        suffix   : "",                      // 后缀
        division : 3,                       // ,分割位
        precision: 2,                       // 精度             
    },
    "zh-CN":{        
        units    : ["","万","亿","万亿","万万亿"],
        radix    : 4,                       // 进制，即三位一进制，中文是是4位一进
        symbol   : "￥",
        prefix   : "RMB",
        suffix   : "元",
        division : 4,
        precision: 2            
    }    
},{
    default  : "{symbol}{value}{unit}",
    long     : "{prefix} {symbol}{value}{unit}{suffix}", 
    short    : "{symbol}{value}{unit}",
    custom   : "{prefix} {symbol}{value}{unit}{suffix}",
    format   : "default",  // [!code ++]
}
```


### 定制格式化规则

其他语言的货币格式化规则可以通过配置文件进行配置，方法如下：

比如我们，要为日语`ja-JP`增加货币格式化规则，可以在`languages/formatters.json`文件中进行配置。

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
上面的配置中，我们为`ja-JP`增加了货币格式化规则

- `format="long"`: 代表使用`key=long`的模板进行格式化
- `long、short、custom`：分别代表长格式、短格式、自定义格式。
- 也可以声明任意格式化模板,如上例中增加了`bitcoin`模板。

```js
t("我有{value | currency('bitcoin') }个比特币",12344354)
t("我有{value | currency({format:'bitcoin',symbol:'฿') }个比特币",12344354)

```

### 修改默认格式化规则

对`currency`格式化器内置支持`zh-CN`和`en-US`两种语言的货币格式化规则。也可以进行覆盖修改。
比如我们要将`zh-CN`的`radix`参数修改为`3`。

```json {3-19}
{
    "zh-CN":{
        "currency" : {
            "radix"    : 3,                       
        }
    }
}
```

## 示例

  当`activeLanguage='zh-CN'`时,`radix=4`,units = `["","万","亿","万亿","万万亿"] `

|  value |  radix  | division | unit |  输出 |
|  ---   |   ---   | ---   |  ---  | ---  |
|  123456789.88   |   4   | 4   | 0  |  1,2345,6789.00  |
|  123456789.88   |   4   | 4   | 1  |  1,2345.6789万  |
|  123456789.88   |   4   | 4   | 2  |  1.23456789亿  |
|  123456789.88   |   4   | 4   | 3  |  0.000123456789万亿  |
|   `division=3`  |      |    |   |   |
|  123456789.88   |   4   | 3   | 0  |  123,456,789.00  |
|  123456789.88   |   4   | 3   | 1  |  12,345.6789万  |
|  123456789.88   |   4   | 3   | 2  |  1.23456789亿  |
|  123456789.88   |   4   | 3   | 3  |  0.000123456789万亿  |
 

**当`activeLanguage == "zh-CN"`时：**

```js
t("{ value | currency}",123456789.88)                           // ￥1,2345,6789.88
// long
t("{ value | currency('long')}",123456789.88)                   // RMB ￥1,2345,6789.88元
t("{ value | currency('long',1)}",123456789.88)                 // RMB ￥1,2345.678988万元
t("{ value | currency('long',2)}",123456789.88)                 // RMB ￥1.2345678988亿元
t("{ value | currency('long',3)}",123456789.88)                 // RMB ￥0.00012345678988万亿元
t("{ value | currency('long',4)}",123456789.88)                 // RMB ￥0.000000012345678988万万亿元
// short
t("{ value | currency('short')}",123456789.88)                   // ￥1,2345,6789.88
t("{ value | currency('short',1)}",123456789.88)                 // ￥1,2345.678988万
t("{ value | currency('short',2)}",123456789.88)                 // ￥1.2345678988亿
t("{ value | currency('short',3)}",123456789.88)                 // ￥0.00012345678988万亿
t("{ value | currency('short',4)}",123456789.88)                 // ￥0.000000012345678988万万亿
// 自定义货币格式
t("{ value | currency({symbol:'￥￥'})}",123456789.88)     // = RMB ￥￥1,2345,6789.88元
t("{ value | currency({symbol:'￥￥',prefix:'人民币:'})}",123456789.88)  // = 人民币: ￥￥1,2345,6789.88元
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整'})}",123456789.88)    // = 人民币: ￥￥1,2345,6789.88元整
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2})}",123456789.88)// = ￥￥1.2345678988亿元整
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4})}",123456789.88)// = ￥￥1.2346+亿元整
t("商品价格: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4,format:'{prefix}*{symbol}*{value}*{unit}*{suffix}'})}",123456789.88)  // = 人民币:*￥￥*1.2346+*亿*元整

```
**当`activeLanguage == "en-US"`时：**

```js
t("{ value | currency}",123456789.88)                           // $123,456,789.88
// long
t("{ value | currency('long')}",123456789.88)                   // USD $123,456,789.88
t("{ value | currency('long',1)}",123456789.88)                 // USD $123,456.78988 thousands
t("{ value | currency('long',2)}",123456789.88)                 // USD $123.45678988 millions
t("{ value | currency('long',3)}",123456789.88)                 // USD $0.12345678988 billions
t("{ value | currency('long',4)}",123456789.88)                 // USD $0.00012345678988 trillions
// short
t("{ value | currency('short')}",123456789.88)                   // $123,456,789.88
t("{ value | currency('short',1)}",123456789.88)                 // $123,456.78988 thousands
t("{ value | currency('short',2)}",123456789.88)                 // $123.45678988 millions
t("{ value | currency('short',3)}",123456789.88)                 // $0.12345678988 billions
t("{ value | currency('short',4)}",123456789.88)                 // $0.00012345678988 trillions
```
