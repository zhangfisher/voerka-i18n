# Date and time<!-- {docsify-ignore-all} -->

## Overview

Thanks to the `voerkai18n` powerful interpolation variable formatting mechanism and `@voerkai18n/runtime` the built-in powerful and flexible date and time processing mechanism, it is easy to realize flexible date and time display in multi-language scenarios.

For the working principle and configuration description of the interpolation variable formatter, please [see](../advanced/custom-formatter)

## Basic usage

When you need to localize the display of date and time, please use the corresponding date and time formatter, which can be used in `t` functions to localize the format output of date variables.

- **No parameter (default format)**

    ```javascript
    t("{ value | date }",new Date())                      // Date 
    t("{ value | date }","2022/12/9 09:12:36")            //  
    t("{ value | date }",1661084229790)                   // time stamp
    ```

- **Specify a predefined format**
    ```javascript
    t("{ value | date('<format name>') }",new Date())
    t("{ value | date('<format name>') }","2022/12/9 09:12:36")
    t("{ value | date('<format name>') }",1661084229790)
    ```
    Predefined format names vary from formatter to formatter, but in general:
    -  `long` = Long format
    -  `short` = short form
    -  `number` = original value, e.g. Monday = 1, August = 8

- **Custom format**
    ```javascript
    t("{ value | date('<template>') }",new Date())
    t("{ value | date('<template>') }","2022/12/9 09:12:36")
    t("{ value | date('<template>') }",1661084229790)
    ```
    Output after interpolation according to the specified template string. Template strings such as `YYYY`, `MM`, `DD` and so on `占位符` can be used to represent the year, month, and so on in the date and time. The available template placeholders are shown at the end of this article.

## Formatter

### Date-

 `date` The formatter is used to format date-type variables.

- **Usage**

```javascript
t("{ value | date }",new Date())
t("{ value | date }","2022/12/9 09:12:36")      
t("{ value | date }",1661084229790)
t("{ value | date('long') }",new Date())
t("{ value | date('short') }","2022/12/9 09:12:36")      
t("{ value | date('local') }",1661084229790)
t("{ value | date('iso') }",1661084229790)
t("{ value | date('gmt') }",1661084229790)
t("{ value | date('utc') }",1661084229790)
t("{ value | date('YYYY年MM月DD日 HH点mm分ss秒') }",1661084229790)
t("{ value | date('YYYY-MM-DD') }",1661084229790)
```

- **Parameter**

 `date` The formatter supports parameters:

| params  | datatype  |Default value|  description  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `local` |Output style, take value `local`, `long`, `short` `iso` `gmt`, `<template>` `utc`,|


**Explain**

- **`local`**: Call `toLocalString()` output datetie.
- **`long`**: Output according to the preset `long` template of each languge
- **`short`**: Output according to the preset `short` template of each languge
- **`iso`**: Call `toISOString()` output datetie.
- **`gmt`**: Call `toGMTString()` output datetie.
- **`utc`**: Call `toUTCString()` output datetie.
- **`<template>`**: output in a custom format, supporting various placeholders. See the end of this article for detais.


- **Examples**

**At `activeLanguage == "zh"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is { value}",NOW)`| `Now is 2022/8/12 10:12:36`|
|  `t("Now is { value \|date }",NOW)`| `Now is 2022/8/12 10:12:36`|
|  `t("Now is { value \|date('local') }",NOW)`| `Now is 2022/8/12 10:12:36` |
|  `t("Now is { value \| date('long') }",NOW)`   | `Now is 2022年08月12日 10点12分36秒`|
|  `t("Now is { value \|date('short') }",NOW)`| `Now is 2022/08/12` |
|  `t("Now is { value \| date('iso') }",NOW)`    | `Now is 2022-08-12T02:12:36.000Z`|
|  `t("Now is { value \| date('gmt') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT`|
|  `t("Now is { value \| date('utc') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT`|
| **Custom format** |
|  `t("Now is { value \|date('YYYY-MM-DD HH:mm:ss')}",NOW)`| `Now is 2022-08-12 10:12:36`|
|  `t("Now is { value \|date('YYYY/MM/DD') }",NOW)",NOW)`| `Now is 2022-08-12`|
|  `t("Now is { value \|date('HH:mm:ss') }",NOW)`| `10:12:36` |

**At `activeLanguage == "en"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is  { value}",NOW)`| `Now is 2022/8/12 10:12:36`|
|  `t("Now is  { value \| date }",NOW)`           | `Now is 2022/8/12 10:12:36`|
|  `t("Now is  { value \| date('local') }",NOW)`  | `Now is 2022/8/12 10:12:36`|
|  `t("Now is  { value \| date('long') }",NOW)`   | `Now is 2022/08/12 10:12:36`|
|  `t("Now is  { value \|date('short') }",NOW)`| `Now is 2022/08/12` |
|  `t("Now is  { value \| date('iso') }",NOW)`    | `Now is 2022-08-12T02:12:36.000Z`|
|  `t("Now is  { value \| date('gmt') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT`|
|  `t("Now is  { value \| date('utc') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT`|
| **Custom format** |
|  `t("Now is  { value \|date('YYYY-MM-DD HH:mm:ss') }",NOW`| `Now is 2022-08-12 10:12:36`|
|  `t("Now is  { value \|date('YYYY/MM/DD')}",NOW"),`| `Now is 2022-08-12`|
|  `t("Now is  { value \|date('HH:mm:ss') }",NOW)`| `Now is 10:12:36` |

- **Configuration**

 `date` The formatter supports the following configurations in addition `local` to the, `iso`, `gmt`, `utc` are calls `Date prototype method`:

1. **Configuration file**： `languages/formatters/<language>.js`
2. **Configuration location**： `$config.datetime.dae`
3. **Configuration parameters**：

    ```javascript 
    export default {
        $config:{ 
            datetime:{
                date:{
                    long:"<tempalte>",
                    short:"<tempalte>",
                    format:"<local | iso | gmt | utc | long | short | [tempalte]>"
                }
            }
        }
    }

    ```


### Time-
 `date` The formatter is used to format date-type variables. `date` The formatter supports parameters:

- **Usage**

```javascript
t("{ value | time }",new Date())
t("{ value | time('local') }","2022/12/9 09:12:36")      
t("{ value | timetime('long') }",new Date())
t("{ value | time('short') }","2022/12/9 09:12:36")      
t("{ value | time('timestamp')}",1661084229790)
t("{ value | time('HH点mm分ss秒') }",1661084229790)
t("{ value | time('HH:mms:ss') }",1661084229790)
```
- **Parameter**

| param  | datatype  | default | description  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `local` |Output style, take value `local`, `long`, `short`, `timestamp`, `<tempalte>`|

-  `local`: Call `toLocaleTimeString()` output time.
-  `long`: Output according to the preset `long` template of each language
-  `short`: Output according to the preset `short` template of each language
-  `<tempalte>`: Output in custom format. Variables can be found in the above `date`.

- **Examples**

**At `activeLanguage == "zh"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is  - { value \| time}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('local')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('long')}",NOW)` | `Now is  - 10点12分36秒` |
| `t("Now is  - { value \| time('short')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('timestamp')}",  ",NOW)` | `Now is  - 1660270356000` |
| **Custom format**
| `t("Now is  - { value \| time('HH:mm:ss')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('mm:ss')}",NOW)` | `Now is  - 12:36` |
| `t("Now is  - { value \| time('ss') ",NOW)` | `Now is  - 36` |

**At `activeLanguage == "en"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is  - { value \| time}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('local')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('long')}",NOW)` | `Now is  - 10点12分36秒` |
| `t("Now is  - { value \| time('short')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('timestamp')}",NOW)` | `Now is  - 1660270356000` |
| **Custom format**
| `t("Now is  - { value \| time('HH:mm:ss')}",NOW)` | `Now is  - 10:12:36` |
| `t("Now is  - { value \| time('mm:ss')}",NOW)` | `Now is  - 12:36`   |
| `t("Now is  - { value \| time('ss')},NOW) ` | `Now is  - 36` |

- **Configuration**

1. **Configuration file **： `languages/formatters/<language>.s`
2. **Configuration location **： `$config.datetime.tie`
3. **Configuration parameters *：
  
    ```javascript 
    export default {
        $config:{ 
            datetime:{
                time:{
                    long:"<template>",
                    short:"<template>",
                    format:"<local | long | short | [template]>"
                }
            }
        }
    }
    ```

### Quarter-
Output the quarter of the year.

- **Usage**

```javascript
t("{ value | quarter }",new Date())
t("{ value | quarter('long') }",new Date())
t("{ value | quarter('short') }","2022/12/9 09:12:36")      
t("{ value | quarter('number') }","2022/12/9 09:12:36")   
```

- **Parameter**

| param  | datatype  | default|  description |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `short` |Output style, value `short`, `long`, `number`|

- **Examples**

**At `activeLanguage == "zh"` that time:**

| translate  |Output|
| --- | --- |
| `t("{ value \| quarter}",NOW)` | `Q1 ` |
| `t("{ value \| quarter("long")}",NOW)` | `一季度 ` |
| `t("{ value \|quarter("short") }",NOW)`| `Q1 `    |
| `t("{ value \|quarter("number") }",NOW)`| `1`    |

**At `activeLanguage == "en"` that time:**

| translate  |Output|
| --- | --- |
| `t("{ value \| quarter}",NOW)` | `Q1 of this year` |
| `t("{ value \| quarter("long")}",NOW)` | `First Quarter of this year` |
| `t("{ value \|quarter("short") }",NOW)`| `Q1 of this year`    |
| `t("{ value \|quarter("number") }",NOW)`| `1 of this year`    |

- **Configuration**

- **Configuration file**： `languages/formatters/<language>.s`
- **Configuration location**： `$config.datetime.quartr`
- **Configuration parameters**：
    ```javascript 
    export default {
        $config:{ 
            datetime:{
                quarter:{
                    long:"<template>",
                    short:"<template>",
                    format:"< 0:long | 1:short | 2:number>"
                }
            }
        }
    }
    ```

### Month-
Output month

 `month` The formatter is used to output the month.
- **Usage**

```javascript
t("{ value | month }",new Date())
t("{ value | month('long') }",new Date())
t("{ value | month('short') }","2022/12/9 09:12:36")      
t("{ value | month('number') }","2022/12/9 09:12:36")   
```

- **Parameter**

| param  | datatype  | default|  description  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `long` |Output style, value `long`, `short`, `number`|

-  `long`: Output according to the preset `long` template of each language
-  `short`: Output according to the preset `short` template of each language
-  `number`: Output the number of the month
-  `<template>`: Output in custom format. Variables can be found in the above `date`.

- **Examples**

**At `activeLanguage == "zh"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is  - { value \| month}",NOW)` | `Now is  - 八月 ` |
| `t("Now is  - { value \| month('long')}",NOW)` | `Now is  - 八月` |
| `t("Now is  - { value \| month('short')}",NOW)` | `Now is  - 八` |
| `t("Now is  - { value \| month('number')}",  ",NOW)` | `Now is  - 8` |

**At `activeLanguage == "en"` that time:**

| translate  |Output|
| --- | --- |
| `t("Now is  - { value \| time}",NOW)` | `Now is  - August` |
| `t("Now is  - { value \| month('long')}",NOW)` | `Now is  - August` |
| `t("Now is  - { value \| month('short')}",NOW)` | `Now is  - Aug` |
| `t("Now is  - { value \| month('number')}",NOW)` | `Now is  - 8` |


- **Configuration**

1. **Configuration file **： `languages/formatters/<language>.s`
2. **Configuration location **： `$config.datetime.monh`
3. **Configuration parameters *：
  
    ```javascript 
    export default {
        $config:{ 
            datetime:{
                month:{
                    long:["一月",...,"十二月"],
                    short:["1月",...,"12月"],
                    format:"< 0:long | 1:short | 2:number>"
                }
            }
        }
    }
    ```

### Week-

Output the day of the week, such as Monday, Tuesday.. Sunday.

- **Usage**

```javascript
t("{ value | weekday }",new Date())
t("{ value | weekday('long') }",new Date())
t("{ value | weekday('short') }","2022/12/9 09:12:36")      
t("{ value | weekday('number') }","2022/12/9 09:12:36")   
```

- **Parameter**

| param  | datatype  | default|  description  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `long` |Output style, value `long`, `short`, `number`|

- **Examples**

**At `activeLanguage == "zh"` that time:**

| translate  |Output|
| --- | --- |
| `t("今天是{ value \| weekday}",NOW)` | `今天是星期一 ` |
| `t("今天是{ value \| weekday("long")}",NOW)` | `今天是星期一 ` |
| `t("今天是{ value \|weekday("short") }",NOW)`| `今天是周一 `    |
| `t("今天是{ value \|weekday("number") }",NOW)`| `今天是1`    |

**At `activeLanguage == "en"` that time:**

| translate  |Output|
| --- | --- |
| `t("今天是{ value \| weekday}",NOW)` | `Today is Monday ` |
| `t("今天是{ value \| weekday("long")}",NOW)` | `Today is Monday` |
| `t("今天是{ value \|weekday("short") }",NOW)`| `Today is Mon`    |
| `t("今天是{ value \|weekday("number") }",NOW)`| `Today is 1`    |

- **Configuration**

1. **Configuration file**： `languages/formatters/<language>.s`
2. **Configuration location**： `$config.datetime.weekdy`
3. **Configuration parameters**：

    ```javascript 
    export default {
        $config:{ 
            datetime:{
                weekday:{
                    long:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
                    short:["周日","周一","周二","周三","周四","周五","周六"],
                    format:"< 0:long | 1:short | 2:number>"
                }
            }
        }
    }
    ```

### Relative time-
Displays relative to the current time, such as 6 minutes ago, one hour later, and so on.
- **Usage**

```javascript
t("{ value | relativeTime }","2022/12/9 09:12:36")
// 指定基准时间
t("{ value | relativeTime('2022/12/2 09:12:36') }","2022/12/9 09:12:36")
t("{ value | relativeTime('"+"2022/12/2 09:12:36" + "') }","2022/12/9 09:12:36")
```
- **Parameter**

None

**Special attention:**

  When `t` the function uses character splicing to generate the formatter parameter, it can also take effect `t("{ value | relativeTime('"+"2022/12/2 09:12:36" + "')}","2022/12/9 09:12:36")`, and the output is based on `"2022/12/2 09:12:36"` the relative time, but because `voerkai18n extract` it can not be recognized when scanning, the translated content can not be extracted. Therefore, the general `relativeTime` formatter is only used when relative to the current time.

- **Examples**

```javascript
const NOW =  new Date("2022/08/12 10:12:36")
t("{value | relativeTime }",NOW)
```

Execute the following translation, and the output when the time and language are different is as follows:

|Time| zh  |  en  |
| ---  | ---  | ---  |  
| 2022/08/12 10:12:30 | `6秒前` | `6 seconds ago` |
| 2022/08/12 10:2:36  |  `10分钟前` | `10 minutes ago`  |
| 2022/08/12 8:12:36  | `2小时前`  | `2 hours ago`  |
| 2022/08/08 8:12:36  | `4天前`  | `4 days ago`  |
| 2022/07/12 10:12:36  | `1月前`  | `1 months ago`  |
| 2018/08/12 10:12:36 | `4年前` | `4 years ago` |
| 2022/08/12 10:12:45 | `9秒后`  | `after 9 seconds`  |
| 2022/08/12 10:18:36 | `6分钟后`  | `after 6 minutes`  |
| 2022/08/12 12:12:36 | `2小时后`  | `after 2 hours`  |
| 2022/08/13 10:12:36 | `1天后`  |  `after 1 days` |

- **Configuration**

1. **Configuration file **： `languages/formatters/<language>.s`
2. **Configuration location **： `$config.datetime.relativeTie`
3. **Configuration parameters *：

    ```javascript 
    export default {
        $config:{ 
            datetime:{
                weekday:{
                    units       : ["seconds","minutes","hours","days","weeks","months","years"],
                    now         : "Now",
                    before      : "{value} {unit} ago",
                    after       : "after {value} {unit}"
                }
            }
        }
    }
    ```

## Extended configuration
 `voerkai18n` The runtime has built in `zh` date-time dependent formatters for `en` both languages. To meet complex application requirements, the date-time formatter is designed to be configurable. When the above formatters do not meet the requirements, or lack the date and time formatting of a language, they can be easily extended.

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

If you are not satisfied with the output of an existing date formatter, or lack the date-time formatting of a language, you can extend it as described below.

**Don't worry **The whole extension process is very simple. In most cases, you only need to configure some template strins.

Here's what to start with:

- **Modify built-in date and time formatting rules with simple configuration**
- **Add date and time formatting rules for languages not supported by the runtime**
- **Customize preset rule**
- **Writing DateTime Formatting Template**

###  Modify a built-in rule

Since `@voerkai18n/runtime` the date and time formatters in `en` both languages are already built in `zh`, in most cases, we will update them regularly to ensure that they work effectively. In general, you do not need to modify `zh.js` `en.js` these two files. However, if the built-in `zh` and `en` date and time formatters for both languages are not adequate, you can optionally modify `zh.js` `en.js` the and files, which override the date and time formatting rules that are incorporated into the built-in.

When you first open `languages/formatters/<language>.js` it, it's empty (except for some comments). The contents are roughly as follows:
```javascript
export default {
    $config:{
    }
}    
```
Now suppose we need to `zh` adjust the output of the language's date and time `long` format from the default `YYYY年MM月DD日 HH点mm分ss秒` to `北京时间: YYYY年MM月DD日 HH点mm分ss秒`, then we just need to modify `languages/formatters/zh.js` it as follows:
```javascript
export default {
    $config:{
        datetime:{
            date:{
                long:"北京时间: YYYY年MM月DD日 HH点mm分ss秒"
            }
        }
    }
}    
```
The configuration `languages/formatters/zh.js` in has the highest priority and overrides the built-in formatting rules.

**Why is it possible to modify the default datetime formatting by modifying `$config.datetime.date`?**

Because `date` the formatter is configurable, the formatter function formats the output from `$config.datetime.date` reading the template string. Therefore, you only need to modify `$config.datetime.date` the configuration parameters in to implement custom formatting.

In fact, `date` formatters such as/ `quarter`/ `month`/ `weekday`/ `time` are configurable, and the corresponding configuration locations are:
```javascript
export default {
    $config:{
        datetime:{
            date:{ ... },
            quarter:{ ... },
            month:{ ... },
            weekday:{ ... },
            time:{ ... },
        }
    }
}    
```
According to this mechanism, we can easily configure the display mode of date and time in different languages. And in the multi-library development mode, this change will only take effect for the current application or library.

###  Add formatting rules
Due to the developer's lack of knowledge of date and time formatting in various languages. Currently, `voerkai18n` there is only built-in `zh` support for date and time rules in `en` two languages. In which `en` a date-time formatter for the language is registered to the global. When switching to `zh` `en` a language other than the two languages, the date and time formatting rules for the language are used `en`.

Obviously, `en` the language's date and time formatting rules do not accommodate all languages, and you can configure your own language support until it is officially available.

The method is very simple, take the `de` language as an example, open the `languages/formatters/de.js` file.

```javascript
export default {
    $config:{
        datetime:{
            date:{                
                long:"<Long Date Time Format Template for de Language>"
                short:"<Short Date Time Format Template for de Language>"
                format:"long"          
            }
        }
    }
}    
```
In this way, when you switch to a `de` language, the date formatter reads `languages/formatters/de.js` the configuration in the file to implement the date-time formatting for the desired `de` language.


###  Extend preset rules

In addition to the `long` preset, `short`, `number` and other rules, you can customize more flexible formatting rules through template strings. You can also define a preset formatting rule yourself.

For example, you can define a `full` new rule for the `date` formatter to display a more complete date and time:
```javascript
t("Now is { value | date('full') }")        //Now is：2022年08月12日 10点12分36秒 上午
```

The method is as follows: In `languages/formatters/zh.json`, add a `full` configuration item.
```javascript
export default {
    $config: {
        full: "北京时间：YYYY年MM月DD日 HH点mm分ss秒 a"
    }
}
```
With custom `full` preset rules, the application can use `t("Now is { value | date('full')}") ` formatting directly, rather than using the form of custom template strings.

### Customize the template

You can customize the display format template when formatting the date and time. The following placeholders are supported in the template string:

|Placeholder|  description  |
| --- | --- |
|YYYY     |2018, four digits|
| YY | 18 years, double digits |
|MMM     |Jan-Dec month, English abbreviation|
|MM     |01-12 months, two digits|
|M     |January-December, starting from 1|
|DD     |01-31, double digits|
|D     |1-31 days|
|HH     |00-23 24 hours, double digits|
|H     |0-23 24 hours|
|hh     |01-12 12 hours, double digits|
|h     |1-12 12 hours|
|mm     |00-59 minutes, double digits|
|m     |0-59 minutes|
|ss     |00-59 seconds, double digits|
|s     |0-59 seconds|
|SSS     |000-999 milliseconds, three digits|
|A     |AM/PM upper/afternoon, capitalized|
|a     |Am/pm upper/afternoon, lowercase|
|t     |Time period, such as early morning, morning, morning, noon, afternoon and evening|
|T     |Time period, such as early morning, morning, morning, noon, afternoon and evening|
