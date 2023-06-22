# Currency <!-- {docsify-ignore-all} -->
## Overview

 `voerkai18n` The built-in support `currency` formatter is used for currency display in multi-language scenarios.

## Guide
### Basic usage

When you need to localize the display of a currency, use the corresponding `currency` formatter, which can be used in `t` functions to localize the format output of a `Number` type.

- **No parameter (default format)**
    ```javascript
    t("{ value | currency}",1234.56)    // == ￥1234.56
    await scope.change("en")
    t("{ value | currency}",1234.56)    // == $1,234.56    
    ```
- **Predefined format**

    Built-in supports `default` predefined formats such as, `long`, `short`, `custom` and. Different languages have different output formats.

    ```javascript
    t("{ value | currency('long')}",1234.56)    // == long format： RMB￥1234.56元
    t("{ value | currency('short')}",1234.56)    // ==short format ￥1234.56
    await scope.change("en")
    t("{ value | currency('long')}",1234.56)    // == $1,234.56
    t("{ value | currency('short')}",1234.56)   // == USD $1,234.56    
    ```
    The predefined format is the output template configured in the language format file. For example, `zh` the predefined format for the language `long` I

- **Specify the currency unit**

    ```javascript
        t("{ value | currency('long',1)}",1234.56)                 // long format
        t("{ value | currency('long',2)}",1234.56)                 // long format
        t("{ value | currency('long',3)}",1234.56)                 // long format
        t("{ value | currency('long',4)}",1234.56)                 // long format
        await scope.change("en")
        t("{ value | currency('short')}",1234.56)                   // short format
        t("{ value | currency('short',1)}",1234.56)                 // short format Thousands
        t("{ value | currency('short',2)}",1234.56)                 // short format Millions
        t("{ value | currency('short',3)}",1234.56)                 // short format Billions
        t("{ value | currency('short',4)}",1234.56)                 // short format Trillions
    ```
- **Specify positional parameters**
     `currency` The formatter supports `format` positional parameters `radix` such as, `unit`, `precision`, `prefix` `suffix` `division` `symbol`, You can pass these parameters in turn as needed to control the currency output.

    ```javascript
        // t("{ value | currency(<format>,<unit>,<precision>,<prefix>,<suffix>,<division>,<symbol>,<radix>)}",1234.56)
        t("{ value | currency('long',1)}",1234.56)                 // long format
        t("{ value | currency('long',1,2,'人民币')}",1234.56)                 
        t("{ value | currency('long',1,2,'人民币','元',3,'')}",1234.56)                 
    ```

- **Specify object parameters**
   When using positional parameters, you can only enter in order. If we only want to specify a suffix for the currency output, we need to pass the parameters in the following way:
   ```javascript
        t("{ value | currency('long',1,2,'人民币','元',3,'<后缀>')}",1234.56)                 
        t("{ value | currency('long',,,,,,'<后缀>')}",1234.56)                 
   ```
    `currency` The formatter supports passing parameters through an object, like this:
   ```javascript
        t("{ value | currency({format:'long',suffix:'<后缀>'})}",1234.56)                       
   ```

### Currency composition

To support flexible currency format output, `currency` the formatter divides one **Full currency string** into five parts:

| Prefix | Symbol | Value | Unit | Suffix |
| :---: |  :---:  |  :---:   | :---:   | :---:  | 
| prefix  |  symbol |  value   |   unit | suffix  |

The currency representation can be composed of `prefix`, `symbol`, `value`, `unit`, and `suffix`. You can then configure a `format` template string that can be freely combined by five placeholders ( `{prefix}`, `{symbol}`, `{value}`, `{unit}`, `{suffix}`) to output the currency.

For different languages or different application scenarios, you can freely combine currency output formats by configuring `format` template strings.

**Example:**

 -  `format = "{symbol} {value}{unit}"` ==> `￥123.45元`
 -  `format = "{prefix} {symbol} {value}{unit}"` ==> `人民币：￥123.45元`
 
### Parameter
 `currency` The formatter supports parameters:


| param  | datatype  | default  |Explain|
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `default` |Value `long`, `short`, `default`, `<template>`|
| `unit` | `Number`  | `0` |Carry bits, such as `万`, `亿`, `万亿`, `万万亿`|
| `precision`| `Number`  | `2` | 即小数精度 |
| `prefix` | `String` | `''` Prefix |
| `suffix` | `String ` | `''` | Suffix, different default values for different languages |
| `division` | `Number`  | ` ` |Comma division bit, for example, 3 means adding a comma for every 3 bits|
| `symbol` | `String` | `''` | Currency symbol. The default value is different for different languages. The default value is ￥ for Chinese and $| for English.
| `radix` | `Number` | `` | The default value is different for different languages. The default value is 4 for Chinese and 3 for English.

Most of the above parameters are well understood, and the key points to be concerned are:

-   `radix`：
    In English, a comma is added to every three numbers, corresponding to `thousands` `millions` `billions` `trillions`.. In China, we are more accustomed to carrying one digit every four digits, and we are accustomed to using yuan, million and billion to express it. If we express 123,456,789.00 in English, we have to look for a long time to know how much it is. And if we split 1,2345,6789.00 with four bits, we can easily see that it's 100 million.. `radix` Parameters are used to configure multiple bits in one unit. The default is 4 in Chinese and 3 in English.

-   `division`
    This parameter is used to indicate a comma for each `division` number. What is the difference between this parameter and `radix`? Although it is more in line with our Chinese reading habits if the currency uses a four-digit comma, the reality is that it often uses a three-digit comma expression. That is, you can configure a comma with three digits or a comma with four digits by simply using `division` the parameter. If we say that a comma with three digits or a comma with four digits in Chinese is acceptable, but when the currency unit is not expressed in yuan, but in tens of thousands or hundreds of millions, the difference between Chinese and English is very obvious. We usually say how many tens of thousands or how many hundreds of millions, instead of how many thousands in English. This is the `division` `radix` difference between and, `division` which is only used to indicate the number of digits plus a comma, and which `radix` is used to indicate the number in which to make a decimal unit when the decimal unit of money is to be used. English `radix=3`, corresponding to `thousands`, `millions`, `billions`, `trillions` and Chinese `radix=4`, corresponding to `万`, `亿`, `万亿`.. That is, `radix` the parameter is only used to calculate the appropriate unit when the value `>0` is specified `unit`.

### Examples

  At `activeLanguage='zh'` that time, `radix=4`, units =

|  value |  radix  |division| unit |  output |
|  ---   |   ---   | ---   |  ---  | ---  |
|  123456789.88   |   4   | 4   | 0  |  1,2345,6789.00  |
|  123456789.88   |   4   | 4   | 1  |  1,2345.6789万  |
|  123456789.88   |   4   | 4   | 2  |  1.23456789亿  |
|  123456789.88   |   4   | 4   | 3  |0. 000123456789 trillion|
| `division=3`|      |    |   |   |
|  123456789.88   |   4   | 3   | 0  |  123,456,789.00  |
|  123456789.88   |   4   | 3   | 1  |  12,345.6789万  |
|  123456789.88   |   4   | 3   | 2  |  1.23456789亿  |
|  123456789.88   |   4   | 3   | 3  |0. 000123456789 trillion|
 

**At `activeLanguage == "zh"` that time:**

```javascript
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

**At `activeLanguage == "en"` that time:**

```javascript
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

### Configuration

- **Configuration file **： `languages/formatters/<langauge>.s`
- **Configuration location **： `$config.curreny`
- **Configuration parameters *：
    ```javascript
    export default {
        $config:{ 
            currency          : {
                default       : "{symbol}{value}{unit}",   // default template
                long          : "{prefix} {symbol}{value}{unit}{suffix}",  //  long template
                short         : "{symbol}{value}{unit}",                  //  short template
                custom        : "{prefix} {symbol}{value}{unit}{suffix}", // custom template, when use currency({...})
                format        : "default",             // default format，valeus = long | short | default | custom
                //--
                units         : [""," thousands"," millions"," billions"," trillions"],    
                radix         : 3,                       // which means three digits in one decimal place, in Chinese it is four digits in one decimal place
                symbol        : "$",                     
                prefix        : "USD",                    
                suffix        : "",                     
                division      : 3,                        
                precision     : 2,                                   
            }
        }
    }
    ```
You can also configure and define a preset format, as follows:

```javascript
export default {
    $config:{ 
        currency          : {
            bitcoin       : "BTC {symbol}{value}{unit}{suffix}"
        }
    }
}
// Then during translation, you can:

t("I have {value | currency('bitcoin') } bitcoins",12344354)
t("I have {value | currency({format:'bitcoin',symbol:'฿') } bitcoins",12344354)

```
## Extended configuration

 `voerkai18n` The runtime has built-in `zh` formatters for currency output in `en` both languages, `currency` primarily formatters that are designed to be configurable. When the above formatters do not meet the requirements, or lack the currency formatting of a language, it can be very easy to extend.

The extension supports very simple formatting of date and time in different languages. When used `voerkai18n compile`, the following will be generated `formatters` in the project structure:

```javascript
<myapp>
   |--src
   |  |-- languages
   |  |   |--
   |  |   |-- formatters
   |  |   |   |-- zh.js
   |  |   |   |-- en.js
   |  |   |   |-- de.js
    
   ....   
```
The, `en.js`, `de.js` files in the `zh.js` `formatters` folder include your custom formatters.

When you open these files for the first time, you will find that there is nothing in them other than some comments to guide you on how to write the extension formatter.

If you are not satisfied with the output of an existing daily currency formatter, or lack currency formatting for a language, you can extend it as described below.

**Don't worry** The whole extension process is very simple. In most cases, you only need to configure some template strings.

Here's what to start with:

- **Modify built-in currency formatting rules with simple configuration**
- **Add currency formatting rules for languages that are not supported by the runtime**
- **Customize preset rule**
- **Writing currency formatting templates**

###  Modify a built-in rule
Since `@voerkai18n/runtime` there are already currency formatters in and `en` languages built into `zh`, in most cases, we will update them regularly to ensure that they work effectively. In general, you do not need to modify `zh.js` `en.js` these two files.

However, if the built-in `zh` and `en` currency formatters for both languages are not adequate, you can optionally modify `zh.js` `en.js` the and files, which override the date and time formatting rules that are incorporated into the built-in.

When you first open `languages/formatters/<language>.js` it, it's empty (except for some comments). The contents are roughly as follows:

```javascript
export default {
    $config:{

    }
}    
```

Next, we just need to adjust the configuration parameters for currency formatting in the `languages/formatters/<language>.js` file as needed. For example

- **If we want `zh` the default format of the language to be the `long` format, we need to modify:**

```javascript
export default {
    $config:{
        datetime:{
            currency:{
                format        : "long",
            }
        }
    }
}    
```
- The currency symbol for Germany **will be changed to `€`**

```javascript
export default {
    $config:{
        datetime:{
            currency:{
                symbol  : "€",
            }
        }
    }
}    
```
- **Modify the Chinese `long` default format**

Chinese `long` default format is `{prefix} {symbol}{value}{unit}{suffix}`, change to `RMB {symbol}{value}元`. It needs to be modified `languages/formatters/zh.js` as follows:

```javascript
export default {
    $config:{
        datetime:{
            currency:{
                long  : "RMB {symbol}{value}元",
            }
        }
    }
}    
```
Then it `t("{value | currency('long')}",123.88)` will be output `RMB 123.88元`.

See below for complete configuration items.

###  Add formatting rules
Currently, `voerkai18n` only `en` two languages of currency rule support are built in `zh`. In which `en` the currency formatter for the language is registered to the global. When switching to `zh` `en` a language other than the two languages, the currency formatting rules for the language are used `en`.

Obviously, `en` the language's date and time formatting rules do not accommodate all languages, and you can configure your own language support until it is officially available.

The method is very simple, take the `de` language as an example, open the `languages/formatters/de.js` file.

```javascript
export default {
    $config:{
        datetime:{
            date:{                
                long:"<Long format currency template for de language>"
                short:"<Shortr format currency template for de language>"
                format:"long"         // The default format is long, or a template string can be used
            }
        }
    }
}    
```
In this way, when you switch to a `de` language, the date formatter reads `languages/formatters/de.js` the configuration in the file to implement currency formatting for the desired `de` language.

###  Extend preset rules

In addition to the `long` preset, `short`, `default`, `custom` and other rules, you can customize more flexible formatting rules through template strings. You can also define a preset formatting rule yourself.

For example, you can define a `rmb` new rule to display a more complete RMB. The method is as follows: In `languages/formatters/zh.json`, add a `rmb` configuration item.

```javascript
export default {
    $config: {
        rmb: "人民币: {symbol}{value}元整"
    }
}
```
With custom `rmb` preset rules, the application can use `t("Now is { value | currency('rmb')}") ` formatting directly, rather than using the form of custom template strings.
