# 日期时间<!-- {docsify-ignore-all} -->

## 概述

得益于`voerkai18n`强大的格式化机制，`@voerkai18n/runtime`内置了对强大灵活的日期时间处理机制，可以很轻松实现多语言场景下的灵活多变的日期时间显示。 

关于格式化器的工作原理和配置说明请[参阅](../advanced/customformatter)

## 基本用法

当需要对日期和时间进行本地化显示时，请使用相对应的日期时间格式化器，可以在`t`函数中使用来对日期型变量进行本地化格式输出。

- **无参数(默认格式)** 

    ```javascript | pure
    t("{ value | date }",new Date())                      // Date类型
    t("{ value | date }","2022/12/9 09:12:36")            // 标准的日期时间字符串
    t("{ value | date }",1661084229790)                   // 时间戳  
    ```

- **指定预定义的格式**  
    ```javascript | pure
    t("{ value | date('<格式名称>') }",new Date())
    t("{ value | date('<格式名称>') }","2022/12/9 09:12:36")
    t("{ value | date('<格式名称>') }",1661084229790)
    ```
    不同格式化器的预定义格式名称不同，但是一般：
    - `long` = 长格式
    - `short` = 短格式
    - `number` = 原始数值，如星期一=1，八月=8

- **自定义格式** 
    ```javascript | pure
    t("{ value | date('<模板字符串>') }",new Date())
    t("{ value | date('<模板字符串>') }","2022/12/9 09:12:36")
    t("{ value | date('<模板字符串>') }",1661084229790)
    ```
    根据指定的模板字符串进行插值后输出。模板字符串中可以使用如`YYYY`、`MM`、`DD`等`占位符`来表示日期时间中的年月日等，可用的模板占位符见本文最后。

## 格式化器

### 日期 - `date`

`date`格式化器用来对日期类型的变量进行格式化。

#### **用法**

```javascript | pure
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

#### **参数**

`date`格式化器支持参数：

| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `local` |  输出样式，取值`local`,`long`,`short`,`iso`,`gmt`,`utc`,`<模板字符串>`  |

**说明**
- **`local`** : 调用`toLocalString()`输出日期时间。
- **`long`** ： 按每种语言预设的`long`模板输出
- **`short`**： 按每种语言预设的`short`模板输出
- **`iso`** : 调用`toISOString()`输出日期时间。
- **`gmt`** : 调用`toGMTString()`输出日期时间。
- **`utc`** : 调用`toUTCString()`输出日期时间。
- **`<模板字符串>`** : 自定义格式输出，支持各种占位符，详见本文最后。


#### **示例**

**当`activeLanguage == "zh"`时：**
| 翻译  |  输出  |
| --- | --- |
|  `t("现在是{ value }",NOW)`                  | `现在是2022/8/12 10:12:36`|
|  `t("现在是{ value \| date }",NOW)`           | `现在是2022/8/12 10:12:36`|
|  `t("现在是{ value \| date('local') }",NOW)`  | `现在是2022/8/12 10:12:36` |
|  `t("现在是{ value \| date('long') }",NOW)`   | `现在是2022年08月12日 10点12分36秒` |
|  `t("现在是{ value \| date('short') }",NOW)`  | `现在是2022/08/12` |
|  `t("现在是{ value \| date('iso') }",NOW)`    | `现在是2022-08-12T02:12:36.000Z` |
|  `t("现在是{ value \| date('gmt') }",NOW)`    | `现在是Fri, 12 Aug 2022 02:12:36 GMT` |
|  `t("现在是{ value \| date('utc') }",NOW)`    | `现在是Fri, 12 Aug 2022 02:12:36 GMT` |
| **自定义格式**                            |                   |                     
|  `t("现在是{ value \| date('YYYY-MM-DD HH:mm:ss')}",NOW)`| `现在是2022-08-12 10:12:36`|
|  `t("现在是{ value \| date('YYYY/MM/DD') }",NOW)",NOW)` | `现在是2022-08-12`|
|  `t("现在是{ value \| date('HH:mm:ss') }",NOW)`       | `10:12:36` |

**当`activeLanguage == "en"`时：**
| 翻译  |  输出  |
| --- | --- |
|  `t("现在是 { value }",NOW)`                  | `Now is 2022/8/12 10:12:36`|
|  `t("现在是 { value \| date }",NOW)`           | `Now is 2022/8/12 10:12:36`|
|  `t("现在是 { value \| date('local') }",NOW)`  | `Now is 2022/8/12 10:12:36` |
|  `t("现在是 { value \| date('long') }",NOW)`   | `Now is 2022/08/12 10:12:36` |
|  `t("现在是 { value \| date('short') }",NOW)`  | `Now is 2022/08/12` |
|  `t("现在是 { value \| date('iso') }",NOW)`    | `Now is 2022-08-12T02:12:36.000Z` |
|  `t("现在是 { value \| date('gmt') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT` |
|  `t("现在是 { value \| date('utc') }",NOW)`    | `Now is Fri, 12 Aug 2022 02:12:36 GMT` |
| **自定义格式**                            |                   |                     
|  `t("现在是 { value \| date('YYYY-MM-DD HH:mm:ss') }",NOW`| `Now is 2022-08-12 10:12:36`|
|  `t("现在是 { value \| date('YYYY/MM/DD')}",NOW"),` | `Now is 2022-08-12`|
|  `t("现在是 { value \| date('HH:mm:ss') }",NOW)`       | `Now is 10:12:36` |

#### **配置**

除了`local`,`iso`,`gmt`,`utc`是调用`Date原型方法`外，`date`格式化器的支持以下配置：

- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.date`
- **配置参数**：
    ```javascript  | pure
    export default {
        $config:{ 
            datetime:{
                date:{
                    long:"<模板字符串>",
                    short:"<模板字符串>",
                    format:"<local | iso | gmt | utc | long | short | [模板字符串]>"
                }
            }
        }
    }

    ```


### 时间 - `time`
`date`格式化器用来对日期类型的变量进行格式化。`date`格式化器支持参数：
#### 用法

```javascript | pure
t("{ value | time }",new Date())
t("{ value | time('local') }","2022/12/9 09:12:36")      
t("{ value | timetime('long') }",new Date())
t("{ value | time('short') }","2022/12/9 09:12:36")      
t("{ value | time('timestamp')}",1661084229790)
t("{ value | time('HH点mm分ss秒') }",1661084229790)
t("{ value | time('HH:mms:ss') }",1661084229790)
```
#### 参数
| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `local` |  输出样式，取值`local`,`long`,`short`,`timestamp`,`<模板字符串>`  |

- **`local`** : 调用`toLocaleTimeString()`输出时间。
- **`long`** ： 按每种语言预设的`long`模板输出
- **`short`**： 按每种语言预设的`short`模板输出
- **`<模板字符串>`** : 按自定义的格式输出，变量可参阅上述`date`.

####  示例

**当`activeLanguage == "zh"`时：**
| 翻译  |  输出  |
| --- | --- |
| `t("现在时间 - { value \| time }",NOW)` | `现在时间 - 10:12:36`    | 
| `t("现在时间 - { value \| time('local') }",NOW)` | `现在时间 - 10:12:36`   | 
| `t("现在时间 - { value \| time('long') }",NOW)` | `现在时间 - 10点12分36秒`    | 
| `t("现在时间 - { value \| time('short') }",NOW)` | `现在时间 - 10:12:36`   | 
| `t("现在时间 - { value \| time('timestamp') }",  ",NOW)` | `现在时间 - 1660270356000`   | 

| **自定义格式**                   
| `t("现在时间 - { value \| time('HH:mm:ss') }",NOW)` | `现在时间 - 10:12:36`    | 
| `t("现在时间 - { value \| time('mm:ss') }",NOW)` | `现在时间 - 12:36`   | 
| `t("现在时间 - { value \| time('ss') ",NOW)` | `现在时间 - 36`   | 

**当`activeLanguage == "en"`时：**
| 翻译  |  输出  |
| --- | --- |
| `t("现在时间 - { value \| time }",NOW)` | `Now is  - 10:12:36`    | 
| `t("现在时间 - { value \| time('local') }",NOW)` | `Now is  - 10:12:36`   | 
| `t("现在时间 - { value \| time('long') }",NOW)` | `Now is  - 10点12分36秒`    | 
| `t("现在时间 - { value \| time('short') }",NOW)` | `Now is  - 10:12:36`   | 
| `t("现在时间 - { value \| time('timestamp') }",NOW)` | `Now is  - 1660270356000`   | 
| **自定义格式**                   
| `t("现在时间 - { value \| time('HH:mm:ss') }",NOW)` | `Now is  - 10:12:36`    | 
| `t("现在时间 - { value \| time('mm:ss') }",NOW)` | `Now is  - 12:36`   | 
| `t("现在时间 - { value \| time('ss') },NOW) ` | `Now is  - 36`   | 

####  配置

- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.time`
- **配置参数**：
    ```javascript  | pure
    export default {
        $config:{ 
            datetime:{
                time:{
                    long:"<模板字符串>",
                    short:"<模板字符串>",
                    format:"<local | long | short | [模板字符串]>"
                }
            }
        }
    }
    ```

### 季度 - `quarter`
输出一年中第几个季度。
####  用法
```javascript | pure
t("{ value | quarter }",new Date())
t("{ value | quarter('long') }",new Date())
t("{ value | quarter('short') }","2022/12/9 09:12:36")      
t("{ value | quarter('number') }","2022/12/9 09:12:36")   
```

####  参数
| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `short` |  输出样式，取值`short`,`long`,`number` |

#### 示例
**当`activeLanguage == "zh"`时：**
| 文本  |  输出  |
| --- | --- |
| `t("今年{ value \| quarter }",NOW)` | `今年Q1 `    | 
| `t("今年{ value \| quarter("long") }",NOW)` | `今年一季度 `    | 
| `t("今年{ value \| quarter("short") }",NOW)` | `今年Q1 `    |
| `t("今年{ value \| quarter("number") }",NOW)` | `今年1`    |

**当`activeLanguage == "en"`时：**
| 文本  |  输出  |
| --- | --- |
| `t("今年{ value \| quarter }",NOW)` | `Q1 of this year`    | 
| `t("今年{ value \| quarter("long") }",NOW)` | `First Quarter of this year`    | 
| `t("今年{ value \| quarter("short") }",NOW)` | `Q1 of this year`    |
| `t("今年{ value \| quarter("number") }",NOW)` | `1 of this year`    |

#### 配置

- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.quarter`
- **配置参数**：
    ```javascript  | pure
    export default {
        $config:{ 
            datetime:{
                quarter:{
                    long:"<模板字符串>",
                    short:"<模板字符串>",
                    format:"< 0:long | 1:short | 2:number>"
                }
            }
        }
    }
    ```

### 月份 - `month`
输出月份

`month`格式化器用来输出月份。
#### 用法

```javascript | pure
t("{ value | month }",new Date())
t("{ value | month('long') }",new Date())
t("{ value | month('short') }","2022/12/9 09:12:36")      
t("{ value | month('number') }","2022/12/9 09:12:36")   
```

#### 参数
| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `long` |  输出样式，取值`long`,`short`,`number`  |

- **`long`** ： 按每种语言预设的`long`模板输出
- **`short`**： 按每种语言预设的`short`模板输出
- **`number`**： 输出月份的数字
- **`<模板字符串>`** : 按自定义的格式输出，变量可参阅上述`date`.

#### 示例

**当`activeLanguage == "zh"`时：**
| 翻译  |  输出  |
| --- | --- |
| `t("现在时间 - { value \| month }",NOW)` | `现在时间 - 八月 `    | 
| `t("现在时间 - { value \| month('long') }",NOW)` | `现在时间 - 八月`    | 
| `t("现在时间 - { value \| month('short') }",NOW)` | `现在时间 - 八`   | 
| `t("现在时间 - { value \| month('number') }",  ",NOW)` | `现在时间 - 8`   | 

**当`activeLanguage == "en"`时：**
| 翻译  |  输出  |
| --- | --- |
| `t("现在时间 - { value \| time }",NOW)` | `Now is  - August`    | 
| `t("现在时间 - { value \| month('long') }",NOW)` | `Now is  - August`    | 
| `t("现在时间 - { value \| month('short') }",NOW)` | `Now is  - Aug`   | 
| `t("现在时间 - { value \| month('number') }",NOW)` | `Now is  - 8`   | 


#### 配置

- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.month`
- **配置参数**：
    ```javascript  | pure
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

### 星期 - `weekday`
输出一星期中的第几天，如星期一、星期二、...星期日。
#### 用法
```javascript | pure
t("{ value | weekday }",new Date())
t("{ value | weekday('long') }",new Date())
t("{ value | weekday('short') }","2022/12/9 09:12:36")      
t("{ value | weekday('number') }","2022/12/9 09:12:36")   
```

#### 参数
| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |
| `format` | `String`  | `long` |  输出样式，取值`long`,`short`,`number` |

#### 示例

**当`activeLanguage == "zh"`时：**
| 文本  |  输出  |
| --- | --- |
| `t("今天是{ value \| weekday }",NOW)` | `今天是星期一 `    | 
| `t("今天是{ value \| weekday("long") }",NOW)` | `今天是星期一 `    | 
| `t("今天是{ value \| weekday("short") }",NOW)` | `今天是周一 `    |
| `t("今天是{ value \| weekday("number") }",NOW)` | `今天是1`    |

**当`activeLanguage == "en"`时：**

| 文本  |  输出  |
| --- | --- |
| `t("今天是{ value \| weekday }",NOW)` | `Today is Monday `    | 
| `t("今天是{ value \| weekday("long") }",NOW)` | `Today is Monday`    | 
| `t("今天是{ value \| weekday("short") }",NOW)` | `Today is Mon`    |
| `t("今天是{ value \| weekday("number") }",NOW)` | `Today is 1`    |

#### 配置
- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.weekday`
- **配置参数**：
    ```javascript  | pure
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

### 相对时间 - `relativeTime`
显示相对当前时间，如6分钟前、一小时后等。
#### 用法
```javascript | pure
t("{ value | relativeTime }","2022/12/9 09:12:36")
// 指定基准时间
t("{ value | relativeTime('2022/12/2 09:12:36') }","2022/12/9 09:12:36")
t("{ value | relativeTime('"+"2022/12/2 09:12:36" + "') }","2022/12/9 09:12:36")
```
#### 参数
| 参数  | 类型  | 默认值  |  说明  |
| ---  | ---  | ---  |  ---  |

**特别注意:**

  当`t`函数中使用字符中拼接来生成格式化器参数时也可以生效,`t("{ value | relativeTime('"+"2022/12/2 09:12:36" + "') }","2022/12/9 09:12:36")`也可以输出基于`"2022/12/2 09:12:36"`的相对时间，但是由于`voerkai18n extract`扫描时无法识别，所以无法提取翻译的内容。因此，一般`relativeTime`格式化器只用在相对当前时间时使用。
#### 示例

```javascript | pure
const NOW =  new Date("2022/08/12 10:12:36")
t("{value | relativeTime }",NOW)
```
执行以下翻译，当时间和语言不同时的输出如下：

| 时间   | zh  |  en  |
| ---  | ---  | ---  |  
| 2022/08/12 10:12:30  | `6秒前`  |  `6 seconds ago` |    
| 2022/08/12 10:2:36  |  `10分钟前` | `10 minutes ago`  |
| 2022/08/12 8:12:36  | `2小时前`  | `2 hours ago`  |
| 2022/08/08 8:12:36  | `4天前`  | `4 days ago`  |
| 2022/07/12 10:12:36  | `1月前`  | `1 months ago`  |
| 2018/08/12 10:12:36  | `4年前`   | `4 years ago`  | 
| 2022/08/12 10:12:45 | `9秒后`  | `after 9 seconds`  |
| 2022/08/12 10:18:36 | `6分钟后`  | `after 6 minutes`  |
| 2022/08/12 12:12:36 | `2小时后`  | `after 2 hours`  |
| 2022/08/13 10:12:36 | `1天后`  |  `after 1 days` |

#### 配置
- **配置文件**：`languages/formatters/<语言名称>.js`
- **配置位置**： `$config.datetime.relativeTime`
- **配置参数**：
    ```javascript  | pure
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

## 扩展配置
`voerkai18n`运行时已经内置了`zh`、`en`两种语言的日期时间相关的的格式化器。
为了满足复杂的应用需要求，日期时间格式化器被设计为可以进行配置。当以上格式化器不能满足要求，或者缺少某种语言的日期时间格式化时，可以非常容易地进行扩展。

扩展支持不同语言言的日期时间格式化非常简单，当使用`voerkai18n compile`后，项目结构中会生成`formatters`如下：

```javascript | pure
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
`formatters`文件夹中的`zh.js`、`en.js`、`de.js`文件中包括了您自定义的格式化器。

当您第一次打开这些文件时，会发现里面除了一些注释来引导您如何编写扩展格式化器外，并没有其他有效的内容。

如果您对现有的日期格式化器的输出不满意，或者缺少某种语言的日期时间格式化，您可以按下面介绍的方式来进行扩展。

**放心**，整个扩展过程非常简单，大部分情况下，只需要配置一些模板字符串即可。

以下开始介绍内容:

- **通过简单的配置修改内置的日期时间格式化规则**
- **为运行时没有支持的语言增加日期时间格式化规则**
- **自定义预设的规则**
- **编写日期时间格式化模板**

###  **修改内置规则**
由于`@voerkai18n/runtime`中已经内置了`zh`和`en`两种语言的日期时间格式化器，大多数情况下，我们会定时更新确保其有效工作，一般情况下，您是不需要修改`zh.js`、`en.js`这两个文件了。
但是如果内置的`zh`和`en`两种语言的日期时间格式化器不能满足要求，您可以选择性地修改`zh.js`、`en.js`这两个文件，这些文件会覆盖合并到内置的日期和时间格式化规则。

当您第一次打开`languages/formatters/<语言名称>.js`时会发现里面是空的(除了一些注释外)。内容大概如下：
```javascript | pure
export default {
    $config:{
    }
}    
```
现在假设我们需要将`zh`语言的日期时间`long`格式的输出从默认的`YYYY年MM月DD日 HH点mm分ss秒`调整为`北京时间: YYYY年MM月DD日 HH点mm分ss秒`，那么只需要修改 `languages/formatters/zh.js`，如下:
```javascript | pure
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
`languages/formatters/zh.js`中的配置优先级最高，会覆盖内置的格式化规则。

**为什么可以通过修改`$config.datetime.date`来修改默认的日期时间格式化？**

因为`date`格式化器是可配置的，该格式化器函数会从`$config.datetime.date`读取模板字符串来进行格式化输出。因此，只需要修改`$config.datetime.date`中的配置参数即可实现自定义格式化。

事实上，`date`/`quarter`/`month`/`weekday`/`time`等格式化器均是可配置的，对应的配置位置是：
```javascript | pure
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
按照这样的机制，我们就可以很容易分别配置在不种语言下对日期时间等显示方式。并且在多包模下，这种修改只会对当前应用或库生效。

###  **增加格式化规则**
由于开发者对各语种日期时间格式化知识的缺失。目前，`voerkai18n`只内置了`zh`,`en`两种语言的日期时间规则支持。
其中，`en`语言的日期时间格式化器被注册到全局。当切换到`zh`,`en`两种语言之外的其他语言时，会使用`en`语言的日期时间格式化规则。

很明显，`en`语言的日期时间格式化规则并不能适应所有语言的要求，在官方提供该语言支持前,您可以自行配置语言支持。

方法很简单，以`de`语言为例，打开`languages/formatters/de.js`文件。

```javascript | pure
export default {
    $config:{
        datetime:{
            date:{                
                long:"<de语言的长日期时间格式模板>"
                short:"<de语言的长日期时间格式模板>"
                format:"long"         // 默认使用long格式，也可以使用一个模板字符串
            }
        }
    }
}    
```
这样，当切换到`de`语言时，date格式化器就会读取`languages/formatters/de.js`文件中的配置，从而实现符合要求的`de`语言的日期时间格式化。

最后，欢迎大家贡献其他语种的日期时间格式化规则，贡献方法可以直接提交在[issues](https://gitee.com/zhangfisher/voerka-i18n/issues)，也可以通过[源码方式](https://gitee.com/zhangfisher/voerka-i18n)提交PR。

###  **扩展预设规则**

除了预设的`long`、`short`、`number`等规则外，您可以通过模板字符串来自定义更加灵活的格式化规则。
您也可以自己定义一个预设格式化规则。

比如可以为`date`格式化器定义一个`full`的规则来显示更加完整的日期时间：
```javascript | pure
t("现在是{ value | date('full') }")        // 北京时间：2022年08月12日 10点12分36秒 上午
```

方法如下：
在`languages/formatters/zh.json`中，增加一个`full`配置项即可。
```javascript | pure
export default {
    $config: {
        full: "北京时间：YYYY年MM月DD日 HH点mm分ss秒 a"
    }
}
```
有了自定义的`full`预设规则，应用中就可以直接使用`t("现在是{ value | date('full') }") `进行格式化，而不需要使用自定义模板字符串的形式。

### 自定义模板

日期时间格式化时可以自定义显示格式模板，模板字符串中支持以下占位符：

| 占位符  |  说明  |
| --- | --- |
|YYYY     |   2018	年，四位数|
|YY     |   18	年，两位数     |   
|MMM     |   Jan-Dec	月，英文缩写|
|MM     |   01-12	月，两位数字|
|M     |   1-12	月，从1开始|
|DD     |   01-31	日，两位数|
|D     |   1-31	日|
|HH     |   00-23	24小时，两位数|
|H     |   0-23	24小时|
|hh     |   01-12	12小时，两位数|
|h     |   1-12	12小时|
|mm     |   00-59	分钟，两位数|
|m     |   0-59	分钟|
|ss     |   00-59	秒，两位数|
|s     |   0-59	秒|
|SSS     |   000-999	毫秒，三位数|
|A     |   AM / PM	上/下午，大写|
|a     |   am / pm	上/下午，小写|
|t     | 时间段，如凌晨、早上、上午、中午、下午、晚上  |
|T     | 时间段，如凌晨、早上、上午、中午、下午、晚上  |