# Currency

`@voerkai18n/formatters` includes a powerful built-in `currency` formatter for handling currency display in multilingual scenarios.

By default, `@voerkai18n/formatters` is already imported in the `languages/index.{js|ts}` file.

```ts
import formatters from "@voerkai18n/formatters"
// .....
export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({        
    ...
    formatters,    // [!code ++]
    ...
}) 
```

## Currency Components

To support flexible currency format output, the `currency` formatter divides a **complete currency string** into five parts:

| Prefix | Symbol | Value | Unit | Suffix |
| :---: | :---: | :---: | :---: | :---: |
| `prefix` | `symbol` | `value` | `unit` | `suffix` |

Currency representation can consist of five parts: `prefix`, `symbol`, `value`, `unit`, and `suffix`.

## Basic Usage

When currency needs to be displayed in a localized format, use the corresponding `currency` formatter. It can be used in the `t` function to format `Number` type values for localized output.

:::warning Note
The `currency` formatter is essentially a function with the following parameters:
**currency(`format`,`unit`,`precision`,`prefix`,`suffix`,`division`,`symbol`,`radix`)**
:::

### No Parameters (Default Format)

```js
t("{ value | currency}",1234.56)    // == ￥1234.56
await scope.change("en")
t("{ value | currency}",1234.56)    // == $1,234.56    
```

### **Specify Currency Unit**

```js
t("{ value | currency('long',1)}",1234.56)                 // Long format: 万元
t("{ value | currency('long',2)}",1234.56)                 // Long format: 亿
t("{ value | currency('long',3)}",1234.56)                 // Long format: 万亿
t("{ value | currency('long',4)}",1234.56)                 // Long format: 万万亿
await scope.change("en")
t("{ value | currency('short')}",1234.56)                   // Short format
t("{ value | currency('short',1)}",1234.56)                 // Short format: Thousands
t("{ value | currency('short',2)}",1234.56)                 // Short format: Millions
t("{ value | currency('short',3)}",1234.56)                 // Short format: Billions
t("{ value | currency('short',4)}",1234.56)                 // Short format: Trillions
```

### **Specify Position Parameters**
The `currency` formatter supports position parameters like `format`, `unit`, `precision`, `prefix`, `suffix`, `division`, `symbol`, `radix`. You can pass these parameters in sequence as needed to control currency output.

```js
// t("{ value | currency(<format>,<unit>,<precision>,<prefix>,<suffix>,<division>,<symbol>,<radix>)}",1234.56)
t("{ value | currency('long',1)}",1234.56)                 // Long format: 万元
t("{ value | currency('long',1,2,'RMB')}",1234.56)                 
t("{ value | currency('long',1,2,'RMB','yuan',3,'')}",1234.56)                 
```

### **Specify Object Parameters**

When using position parameters, they must be input in order. If we only want to specify a suffix for currency output, we would need to pass parameters like this:

```js
t("{ value | currency('long',1,2,'RMB','yuan',3,'<suffix>')}",1234.56)                 
t("{ value | currency('long',,,,,,'<suffix>')}",1234.56)                 
```
The `currency` formatter supports passing parameters as an object, like this:
```js
t("{ value | currency({format:'long',suffix:'<suffix>'})}",1234.56)                       
```

### **Predefined Formats**

Built-in support for predefined formats like `default`, `long`, `short`, `custom`, with different output formats for different languages.

```js
t("{ value | currency('long')}",1234.56)    // == Long format output: RMB￥1234.56元
t("{ value | currency('short')}",1234.56)    // == Short format output: ￥1234.56
await scope.change("en")
t("{ value | currency('long')}",1234.56)    // == $1,234.56
t("{ value | currency('short')}",1234.56)   // == USD $1,234.56    
```
Predefined formats are output templates configured in the language formatting file.
For example, the `long` predefined format for `zh` language is `{prefix} {symbol}{value}{unit}{suffix}`

## Parameters

The `currency` formatter supports the following parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `format` | `String` | `default` | Values: `long`,`short`,`default`,`<template string>` |
| `unit` | `Number` | `0` | Base unit, like `万`, `亿`, `万亿`, `万万亿` |
| `precision` | `Number` | `2` | Decimal precision |
| `prefix` | `String` | `''` | Prefix |
| `suffix` | `String` | `''` | Suffix, different defaults for different languages |
| `division` | `Number` | ` ` | Comma separation position, e.g., `3` means add a comma every `3` digits |
| `symbol` | `String` | `''` | Currency symbol, different defaults for different languages, `￥` for Chinese, `$` for English |
| `radix` | `Number` | `` | Unit base, different defaults for different languages, `4` for Chinese, `3` for English |

### radix

In English, a comma is added every 3 digits, corresponding to `thousands`, `millions`, `billions`, `trillions`, etc.
In Chinese, it's more common to group every `4` digits, using 元, 万, 亿 for expression.
For example, `123,456,789.00` in English takes time to understand the amount.
But if divided by four digits `1,2345,6789.00`, we can easily see it's 1亿...
The `radix` parameter is used to configure how many digits make up one unit. Default is `4` for Chinese and `3` for English.

### division

This parameter specifies adding a comma every `division` digits. How is this different from `radix`?
Although using four-digit grouping for currency is more natural for Chinese readers, three-digit grouping is also commonly used.
In other words, you can use the `division` parameter to configure either three-digit or four-digit grouping.
While both three-digit and four-digit grouping might be acceptable in Chinese, when expressing currency units not in 元 but in 万元 or 亿, the difference between Chinese and English becomes very apparent. We usually say how many 万 or 亿, rather than using the English three-digit progression to say how many thousand.
This is where `radix` and `division` differ. `division` only indicates how many digits to group with commas, while `radix` indicates what base to use when using currency unit progression. English `radix=3` corresponds to `thousands`, `millions`, `billions`, `trillions`,
while Chinese `radix=4` corresponds to `万`, `亿`, `万亿`, ...
In other words, the `radix` parameter is only used to calculate appropriate units when `unit` value is `>0`.

### format

The `format` parameter configures a template string that can freely combine five placeholders (`{prefix}`, `{symbol}`, `{value}`, `{unit}`, `{suffix}`) to output currency.

Different languages or application scenarios can freely combine currency output formats by configuring the `format` template string.

**Example:**

- `format = "{symbol} {value}{unit}"` ==> `￥ 123.45元`
- `format = "{prefix} {symbol} {value}{unit}"` ==> `RMB：￥123.45元`

## Configure Formatting Rules

### Built-in Formatting Rules

The `currency` formatter has built-in support for currency formatting rules in `zh-CN` and `en-US`.

```ts
{
    "en-US":{
        //thousands, millions, billions, trillions
        units    : [""," thousands"," millions"," billions"," trillions"],    
        // Base, three digits for English, four digits for Chinese
        radix    : 3,                       
        symbol   : "$",                     // Symbol
        prefix   : "USD",                   // Prefix
        suffix   : "",                      // Suffix
        division : 3,                       // Comma separation position
        precision: 2,                       // Precision             
    },
    "zh-CN":{        
        units    : ["","万","亿","万亿","万万亿"],
        radix    : 4,                       // Base, four digits for Chinese
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

### Customize Formatting Rules

Currency formatting rules for other languages can be configured through configuration files, as follows:

For example, to add currency formatting rules for Japanese `ja-JP`, we can configure in the `languages/formatters.json` file.

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
            // Specify default formatting rule template name
            "format"   : "long",  // [!code ++]                
            // Predefined formatting rule templates
            "default" : "{symbol}{value}{unit}",
            "long"    : "{prefix} {symbol}{value}{unit}{suffix}",
            "short"   : "{symbol}{value}{unit}",
            "custom"  : "{prefix} {symbol}{value}{unit}{suffix}",
            "bitcoin" : "BTC {symbol}{value}{unit}{suffix}"
        }
    },
    // ... Currency formatting rules for other languages
}
```
In the above configuration, we added currency formatting rules for `ja-JP`

- `format="long"`: Represents using the template with `key=long` for formatting
- `long, short, custom`: Represent long format, short format, custom format respectively
- You can also declare any formatting template, like the `bitcoin` template added in the above example

```js
t("I have {value | currency('bitcoin') } bitcoins",12344354)
t("I have {value | currency({format:'bitcoin',symbol:'฿') } bitcoins",12344354)
```

### Modify Default Formatting Rules

The built-in currency formatting rules for `zh-CN` and `en-US` in the `currency` formatter can also be modified.
For example, if we want to change the `radix` parameter of `zh-CN` to `3`:

```json {4}
{
    "zh-CN":{
        "currency" : {
            "radix"    : 3,                       
        }
    }
}
```

## Examples

When `activeLanguage='zh-CN'`, `radix=4`, units = `["","万","亿","万亿","万万亿"]`

| value | radix | division | unit | output |
| --- | --- | --- | --- | --- |
| 123456789.88 | 4 | 4 | 0 | 1,2345,6789.00 |
| 123456789.88 | 4 | 4 | 1 | 1,2345.6789万 |
| 123456789.88 | 4 | 4 | 2 | 1.23456789亿 |
| 123456789.88 | 4 | 4 | 3 | 0.000123456789万亿 |
| `division=3` | | | | |
| 123456789.88 | 4 | 3 | 0 | 123,456,789.00 |
| 123456789.88 | 4 | 3 | 1 | 12,345.6789万 |
| 123456789.88 | 4 | 3 | 2 | 1.23456789亿 |
| 123456789.88 | 4 | 3 | 3 | 0.000123456789万亿 |

**When `activeLanguage == "zh-CN"`:**

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
// Custom currency format
t("{ value | currency({symbol:'￥￥'})}",123456789.88)     // = RMB ￥￥1,2345,6789.88元
t("{ value | currency({symbol:'￥￥',prefix:'人民币:'})}",123456789.88)  // = 人民币: ￥￥1,2345,6789.88元
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整'})}",123456789.88)    // = 人民币: ￥￥1,2345,6789.88元整
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2})}",123456789.88)// = ￥￥1.2345678988亿元整
t("{ value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4})}",123456789.88)// = ￥￥1.2346+亿元整
t("Price: { value | currency({symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2,precision:4,format:'{prefix}*{symbol}*{value}*{unit}*{suffix}'})}",123456789.88)  // = 人民币:*￥￥*1.2346+*亿*元整
```

**When `activeLanguage == "en-US"`:**

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
