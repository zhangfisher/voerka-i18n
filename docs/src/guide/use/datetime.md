# 日期时间

## 概述

得益于`voerkai18n`强大的格式化机制，`@voerkai18n/runtime`内置了对强大灵活的日期时间处理机制，可以很轻松实现多语言场景下的灵活多变的日期时间显示。
`voerkai18n`支持丰富的格式化器用来支持本地化日期时间显示：
- `date`
- `time`
- `year`
- `quarter`
- `month`
- `day`
- `weekday`
- `hour`
- `hour12`
- `minute`
- `second`
- `millisecond`
- `timestamp`

关于格式化器的更完整说明请[参阅](../advanced/customformatter)

## 指南
### 基本用法

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


### 配置方法
`voerkai18n`运行时已经内置了`zh`、`en`两种语言的日期时间相关的的格式化器。为了满足复杂的应用需要求，可以根据需要对日期时间格式化进行配置定制。

配置定制日期时间格式化非常简单，当使用`voerkai18n compile`后，项目结构中会生成`formatters`如下：
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
现在一般您可以选择:
- 修改内置的日期时间格式化
- 配置指定语言的日期时间格式化
####  **修改内置的日期时间格式**
由于`@voerkai18n/runtime`中已经内置了`zh`和`en`两种语言的日期时间格式化器，大多数情况下，我们会定时更新确保其有效工作，一般情况下，您是不需要修改`zh.js`、`en.js`这两个文件了。
但是如果内置的`zh`和`en`两种语言的日期时间格式化器不能满足要求，您可以选择性地修改`zh.js`、`en.js`这两个文件，这些文件会覆盖合并到内置的日期和时间格式化规则。

当您第一次打开`languages/formatters/<语言名称>.js`时会发现里面是空的，除了一些注释外。如下：
```javscript | pure
export default {
    $config:{
    }
}    
```
现在假设我们需要将`zh`语言的日期时间`long`格式的输出从默认的`YYYY年MM月DD日 HH点mm分ss秒`调整为`北京时间: YYYY年MM月DD日 HH点mm分ss秒`，那么只需要修改 `languages/formatters/zh.js`，如下:
```javscript | pure
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
`languages/formatters/zh.js`中的配置优先级最高，会合并覆盖内置的配置。

**为什么可以通过修改`$config.datetime.date`来修改默认的日期时间格式化？**

因为`date`格式化器是可配置的，当该格式化器会从`$config.datetime.date`读取模板字符串来进行格式化输出。因此，只需要覆盖`$config.datetime.date`参数即可实现自定义格式化。

事实上，`date`/`quarter`/`month`/`weekday`/`time`等格式化器均是可配置的，对应的配置位置是：
```javscript | pure
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
按照这样的机制，我们就可分别配置在不种语言下，对日期时间等显示方式。
####  **配置指定语言的日期时间格式化**
默认情况下，`en`语言的日期时间格式化器被注册到全局，当任何一种语言的指定格式化器没有定义时，会在全局格式化器中查找，因此`en`语言的日期时间格式化器是适用于所有语言。

如果`en`语言的日期时间格式化不符合`de`语言的要求，修改`languages/formatters/de.js`文件。

```javscript | pure
export default {
    $config:{
        datetime:{
            date:{
                long:"<de语言的长日期时间格式模板>"
                short:"<de语言的长日期时间格式模板>"
                format:"long"
            }
        }
    }
}    
```
这样，当切换到`de`语言时，date格式化器就会读取`languages/formatters/de.js`文件中的配置，从而实现符合要求的`de`语言的日期时间格式化。


### 格式模板占位符


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
|  `t("现在是{ value \| date('local') }",NOW)`  | `` |
|  `t("现在是{ value \| date('long') }",NOW)`   | `现在是2022年08月12日 10点12分36秒` |
|  `t("现在是{ value \| date('short') }",NOW)`  | `现在是2022/08/12` |
|  `t("现在是{ value \| date('iso') }",NOW)`    | `` |
|  `t("现在是{ value \| date('gmt') }",NOW)`    | `` |
|  `t("现在是{ value \| date('utc') }",NOW)`    | `` |
| **自定义格式**                            |                   |                     
|  `t("现在是{ value \| date('YYYY-MM-DD HH:mm:ss')}",NOW)`| `现在是2022-08-12 10:12:36`|
|  `t("现在是{ value \| date('YYYY/MM/DD') }",NOW)",NOW)` | `现在是2022-08-12`|
|  `t("现在是{ value \| date('HH:mm:ss') }",NOW)`       | `10:12:36` |

**当`activeLanguage == "en"`时：**
| 翻译  |  输出  |
| --- | --- |
|  `t("现在是 { value }",NOW)`                  | `Now is 2022/8/12 10:12:36`|
|  `t("现在是 { value \| date }",NOW)`           | `Now is 2022/8/12 10:12:36`|
|  `t("现在是 { value \| date('local') }",NOW)`  | `Now is ` |
|  `t("现在是 { value \| date('long') }",NOW)`   | `Now is 2022/08/12 10:12:36` |
|  `t("现在是 { value \| date('short') }",NOW)`  | `Now is 2022/08/12` |
|  `t("现在是 { value \| date('iso') }",NOW)`    | `Now is ` |
|  `t("现在是 { value \| date('gmt') }",NOW)`    | `Now is ` |
|  `t("现在是 { value \| date('utc') }",NOW)`    | `Now is ` |
| **自定义格式**                            |                   |                     
|  `t("现在是 { value \| date('YYYY-MM-DD HH:mm:ss') }",NOW`| `Now is 2022-08-12 10:12:36`|
|  `t("现在是 { value \| date('YYYY/MM/DD')}",NOW"),` | `Now is 2022-08-12`|
|  `t("现在是 { value \| date('HH:mm:ss') }",NOW)`       | `Now is 10:12:36` |

#### **配置**

除了`local`,`iso`,`gmt`,`utc`是调用`Date原型方法`外，`long`,`short`两种预设的格式是采用可配置的模板字符串来定义的。默认情况下其预设格式是：

| 格式名称  |  中文(zh)  |  英文(en)  |
| --- | --- | --- |
|  `long` |  `YYYY年MM月DD日 HH点mm分ss秒` | `YYYY/MM/DD HH:mm:ss` |
|  `short` | `YYYY/MM/DD` | `YYYY/MM/DD` |


### 时间 - `time`
`date`格式化器用来对日期类型的变量进行格式化。`date`格式化器支持参数：
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
| `t("现在时间 - { value \| time }",NOW)` | `现在时间 - `    | 
| `t("现在时间 - { value \| time('local') }",NOW)` | `现在时间 - `   | 
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
| `t("现在时间 - { value \| time }",NOW)` | `Now is  - `    | 
| `t("现在时间 - { value \| time('local') }",NOW)` | `Now is  - `   | 
| `t("现在时间 - { value \| time('long') }",NOW)` | `Now is  - 10点12分36秒`    | 
| `t("现在时间 - { value \| time('short') }",NOW)` | `Now is  - 10:12:36`   | 
| `t("现在时间 - { value \| time('timestamp') }",NOW)` | `Now is  - 1660270356000`   | 
| **自定义格式**                   
| `t("现在时间 - { value \| time('HH:mm:ss') }",NOW)` | `Now is  - 10:12:36`    | 
| `t("现在时间 - { value \| time('mm:ss') }",NOW)` | `Now is  - 12:36`   | 
| `t("现在时间 - { value \| time('ss') },NOW) ` | `Now is  - 36`   | 

####  配置

`time`格式化器的配置方式同`date`格式化器。

### 年份 - `year`
简单输出年份数值，如`t("现在是{ value | year}",new Date())`输出`现在是2022`
### 季度 - `quarter`
输出一年中第几个季度。
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
| `t("今年{ value \| quarter }",NOW)` | `First Quarter of this year`    | 
| `t("今年{ value \| quarter("long") }",NOW)` | `First Quarter of this year`    | 
| `t("今年{ value \| quarter("short") }",NOW)` | `Q1 of this year`    |
| `t("今年{ value \| quarter("number") }",NOW)` | `1 of this year`    |

#### 配置
配置方式同`date`格式化器。可以选择性地修改`languages/formatters/<语言名称>.js`
```javascript | pure 
export default {
    $config:{
        datetime:{
            quarter：{
                long:["Q1","Q2","Q3","Q4"],
                short:["Q1","Q2","Q3","Q4"],
                format : "short", 
            }
        }
    }    
}
```


### 月份 - `month`
输出月份

`month`格式化器用来输出月份。
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

`month`格式化器的配置方式同`date`格式化器。
可以选择性地修改`languages/formatters/<语言名称>.js`
```javascript | pure 
export default {
    $config:{
        datetime:{
            month：{
                long : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                short  : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                format : "short", 
            }
        }
    }    
}
```

### 天 - `day`
输出每个月的几号。如`t("现在是{ value | day }号",new Date())`输出`现在是28号`。
### 星期 - `weekday`
输出一星期中的第几天，如星期一、星期二、...星期日。
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
| `t("今天是{ value \| weekday("short") }",NOW)` | `今天是一 `    |
| `t("今天是{ value \| weekday("number") }",NOW)` | `今天是1`    |

**当`activeLanguage == "en"`时：**

| 文本  |  输出  |
| --- | --- |
| `t("今天是{ value \| weekday }",NOW)` | `Today is Monday `    | 
| `t("今天是{ value \| weekday("long") }",NOW)` | `Today is Monday`    | 
| `t("今天是{ value \| weekday("short") }",NOW)` | `Today is Mon`    |
| `t("今天是{ value \| weekday("number") }",NOW)` | `Today is 1`    |

#### 配置
配置方式同`date`格式化器。可以选择性地修改`languages/formatters/<语言名称>.js`

```javascript | pure 
export default {
    $config:{
        datetime:{
            long :["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            short : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
            format      : 0,         // 默认格式: 0:long-长名称，1:short-短名称，2:number-数字 
        }
    }    
}
```

### 小时 - `hour`


### 分钟 - `minute`
### 秒 - `second`  
### 毫秒 - `millisecond` 
### 时间戳 - `timestamp`  
