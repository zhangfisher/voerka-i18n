

# 前言

基于`javascript`的国际化方案很多，比较有名的有`fbt`、`i18next`、`react-i18next`、`vue-i18n`、`react-intl`等等，每一种解决方案均有大量的用户。为什么还要再造一个轮子？好吧，再造轮子的理由不外乎不满足于现有方案，总想着现有方案的种种不足之处，然后就撸起袖子想造一个轮子，也不想想自己什么水平。

哪么到底是对现有解决方案有什么不满？最主要有三点：

- 大部份均为要翻译的文本信息指定一个`key`，然后在源码文件中使用形如`$t("message.login")`之类的方式，然后在翻译时将之转换成最终的文本信息。此方式最大的问题是，在源码中必须人为地指定每一个`key`，在中文语境中，想为每一句中文均配套想一句符合语义的`英文key`是比较麻烦的，也很不直观。我希望在源文件中就直接使用中文，如`t("中华人民共和国万岁")`，然后国际化框架应该能自动处理后续的一系列麻烦。

- 要能够比较友好地支持多包`monorepo`场景下的国际化协作，当主程序切换语言时，其他包或库也可以自动切换，并且在开发上每个包或库均可以独立地进行开发，集成到主程序时能无缝集成。这点在现有方案上没有找到比较理想的解决方案。

- 大部份国际化框架均将中文视为二等公民，大部份情况下您应该采用英文作为第一语言，虽然这不是太大的问题，但是既然要再造一个轮子，为什么不将中文提升到一等公民呢。

  

当然，在使用方式上要尽可能简洁，便

基于此

# 安装

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

- **@voerkai18/runtime**

  必须的运行时，安装到运行依赖`dependencies`中

  ```javascript
  npm install --save @voerkai18/runtime
  yarn add @voerkai18/runtime
  pnpm add @voerkai18/runtime
  ```

- **@voerkai18/tools**

  包含文本提取/编译等命行工具，应该安装到开发依赖`devDependencies`中

  ```javascript
  npm install --save-dev @voerkai18/tools
  yarn add -D @voerkai18/tools
  pnpm add -D @voerkai18/tools
  ```

- **@voerkai18/formatters**

  可选的，一些额外的格式化器，可以按需进行安装到`dependencies`中

  

# 快速入门

本节以标准的`Nodejs`应用程序为例，简要介绍`VoerkaI18n`国际化框架的基本使用。其他`vue`或`react`应用的使用也基本相同。

```shell
myapp
  |--package.json
  |--index.js
```

## 第一步：使用翻译函数

在源码文件中直接使用`t`翻译函数对要翻译文本信息进行封装，简单而粗暴。

```javascript
// index.js
    
console.log(t("中华人民共和国万岁"))
console.log(t("中华人民共和国成立于{}",1949))
```

`t`翻译函数是在哪里声明的？先卖个关子，后续揭晓。

##  第二步：提取要翻译的内容

接下来我们使用`voerkai18n extract`命令来自动扫描工程源码文件中的需要的翻译的文本信息。

```shell
myapp>voerkai18n extract --languages cn,en,de,jp  --default cn --active cn
```

以上命令代表：

- 扫描当前文件夹下所有源码文件
- 计划支持`cn`、`en`、`de`、`jp`四种语言
- 默认语言是中文。（指在源码文件中我们直接使用中文，好象其他方案大部份均要求采用英文）
- 激活语言是中文（即默认切换到中文）

执行`voerkai18n extract`命令后，就会在`myapp/languages`通过生成`translates/default.json`文件，该文件就是需要进行翻译的文本信息，形式如下：

```json
{
    "中华人民共和国万岁":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>"
        "jp":"<在此编写对应的日文翻译内容>",
        "$files":["index.js"]    // 记录了该信息是从哪几个文件中提取的
    },
	"中华人民共和国成立于{}":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>"
        "jp":"<在此编写对应的日文翻译内容>",
        "$files":["index.js"]
    }
}
```

最后文件结构如下：

```shell
myapp
  |-- languages
    |-- settings.js                  // 语言配置文件
    |-- translates                   // 此文件夹是所有需要翻译的内容
      |-- default.json
  |-- package.json
  |-- index.js

```

> **注：**当我们修改了源文件后，可以多次执行`voerkai18n extract`命令，该命令会自动同步合并已翻译的内容，不会导致进行了一半的翻译内容丢失，可以放心执行。

## 第三步：编码语言包

当我们完成`myapp/languages/translates`下的所有`JSON语言文件`的翻译后（如果配置了名称空间后，每一个名称空间会对应生成一个文件，详见后续`名称空间`介绍），接下来需要对翻译后的文件进行编译。

```shell
myapp> voerkai18n compile
```

`compile`命令根据`myapp/languages/translates/*.json`和`myapp/languages/settings.js`文件编译生成以下文件：

```javascript
  |-- languages
    |-- settings.js                  // 语言配置文件
    |-- idMap.js                     // 文本信息id映射表
    |-- index.js                     // 包含该应用作用域下的翻译函数等
    |-- cn.js                        // 语言包
    |-- en.js
    |-- jp.js
    |-- de.js
    |-- translates                   // 此文件夹是所有需要翻译的内容
      |-- default.json
  |-- package.json
  |-- index.js

```



## 第四步：导入翻译函数

第一步中我们在源文件中直接使用了`t`翻译函数包装要翻译的文本信息，该`t`翻译函数就是在编译环节自动生成并声明在`myapp/languages/index.js`中的。



import { t } from "./languages"   



是`myapp/languages/index.js`文件导出的翻译函数，但是现在`myapp/languages`还不存在，后续会使用工具自动生成。

# 指南

## 翻译函数

默认提供翻译函数`t`用来进行翻译。
```javascript

// 从当前语言包文件夹index.js中导入翻译函数
import { t } from "<myapp>/languages"

t("中华人民共和国")

// 位置插值变量
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",1949,"北京")
// 当仅有两个参数且第2个参数是[]类型时，自动展开第一个参数进行位置插值
t("中华人民共和国成立于{year}年，首都{capital}",[1949,"北京"]) 

、
// 当仅有两个参数且第2个参数是{}类型时，启用字典插值变量
t("中华人民共和国成立于{year}年，首都{capital}",{year:1949,capital:"北京"})

// 插值变量可以是同步函数，在进行插值时调用。
t("中华人民共和国成立于{year}年，首都{capital}",()=>1949,"北京")

// 对插值变量启用格式化器
t("中华人民共和国成立于{date | year}年",{date:new Date('')})

```



## 复数

默认情况下，`t`函数仅仅处理单数形式的翻译，当翻译文本内容是一个`数组`时启用复数处理机制。

### 启用复数处理机制
假设在index.html文件中具有一个翻译内容
```javascript
    t("我{}一辆车")
```
经过`extract`命令提取为翻译文件后，如下：
```json
// languages/translates/default.json
{
    "我有{}辆车":{
        "en":"",
        "de":"...." 
    }
}
```
现在我们要求引入复数处理机制，为不同数量采用不同的翻译，只需要将上述翻译文本更改为数组形式。
```json
{
    "我有{}辆车":{
        "en":["I don't have a car","I have a car","I have two cars","I have {} cars"],
        "en":["I don't have a car","I have a car","I have {} cars"],
        "en":["I don't have a car","I have {} cars"],
        "de":"...." 
    }
}
```
上例中，只需要在翻译文件中将上述的`en:""`更改为`[<0对应的复数文本>,<1对应的复数文本>,...,<n对应的复数文本>]`形式代表启动复数机制.
- 可以灵活地为每一个数字(`0、1、2、...、n`)对应的复数形式进行翻译
- 数量数字大于数组长度，则总是取最后一个复数形式
- 复数形式的文本同样机制位置插值和变量插值。


### 对应的翻译函数


启用复数处理机制后，在`t`函数按如下方式进行处理。


- **不存在插值变量且t函数的第2个参数是数字**

```javascript

t("我有一辆车",0)  // ==   "I don't have a car"
t("我有一辆车",1)  // ==   "I have a car"
t("我有一辆车",2)  // ==   "I have two cars"
t("我有一辆车",100)  // == "I have 100 cars"
```

- **存在插值变量且t函数的第2个参数是数字**

就中文而言，上述没有指定插值变量是比较别扭的，一般可以引入一个位置插值变量更加友好。
```javascript

t("我{}一辆车",0)  // ==   "I don't have a car"
t("我{}一辆车",1)  // ==   "I have a car"
t("我{}一辆车",2)  // ==   "I have two cars"
t("我{}一辆车",100)  // == "I have 100 cars"
```

- **复数命名插值变量**

当启用复数功能时，`t`函数需要知道根据哪个变量来决定采用何种复数形式。


```javascript
t("{}有{}辆车","张三",0)
```


以上采用位置插值变量时只能处理第一个位置插值复数，当翻译内容存在多个位置插值变量时,因为无法获取哪一个位置变量是数字，因此就不能有效处理。如:
```javascript
t("{}有{}辆车","张三",0)
t("{}有{}辆车","张三",1)
```
此种情况下就需要采用命名插值变量来处理。
具体的方式是约定当插值字典中存在以`$字符开头`的变量时，并且值是`数字`时，根据该变量来引用复数。以下例中，`t`函数根据`$count`值来处理复数。
```javascript
t("{name}有{$count}辆车",{name:"Tom",$count:0})    // == "Tom don't have a car"
t("{name}有{$count}辆车",{name:"Tom",$count:1})    // == "Tom have a car"
t("{name}有{$count}辆车",{name:"Tom",$count:2})    // == "Tom have two cars"
t("{name}有{$count}辆车",{name:"Tom",$count:100})  // == "Tom have 100 cars"
```


### 示例

```javascript
// languages/translates/default.json
{
    "第{}章":{
        en:[
            "Chapter Zero","Chapter One", "Chapter Two", "Chapter Three","Chapter Four",
            "Chapter Five","Chapter Six","Chapter Seven","Chapter Eight","Chapter Nine",
            "Chapter {}"
        ],
        cn:["第零章","第一章", "第二章", "第三章","第四章","第五章","第六章","第七章","第八章","第九章"]
    }
}
// 翻译函数
t("第{}章",0)  // == Chapter Zero
t("第{}章",1)  // == Chapter One
t("第{}章",2)  // == Chapter Two
t("第{}章",3)  // == Chapter Three
t("第{}章",4)  // == Chapter Four
t("第{}章",5)  // == Chapter Five
t("第{}章",6)  // == Chapter Six
t("第{}章",7)  // == Chapter Seven
...
t("第{}章",100)  // == Chapter 100
```


## 插值变量格式化

voerka-i18n支持对插值变量进行格式化
{{value | filter}} 过滤器语法类似管道操作符，它的上一个输出作为下一个输入。
```javascript

new VoerkaI18n({
    formats:{
        Date:{                    // 日期格式
            en:{
                default:(value)=>dayjs(value).format("YYYY/MM/DD"),       
                time:(value)=>dayjs(value).format("HH:hh:mm"),
                // 可以定义多种自定义格式...
            },
            cn:{
                default:(value)=>dayjs(value).format("YYYY年MM月DD日"),       
                time:(value)=>dayjs(value).format("HH:hh:mm"),
                // 可以定义多种自定义格式...
            },
        },
        String:{
            en:{
                firstUpper:(value)=>value[0].toUpperCase()+value.substr(1)         // 首字母大写
            }
        }
    }
})
```
以上代码定义了：
- `Date`类型的英文和中文的两个格式化函数
- `String`类型变量的`firstUpper`格式化函数

接下来，在翻译内容中使用。

```javascript

// languages/translates/default.json
{
    "今天是{date}":{
        en:"Today is {date}",   // 使用默认的格式化器
    },
    "现在是北京时间：{date}":{
        en:"Now is { date | time}" // 使用指定的格式化器time
    },

t("今天是{date}",{date:new Date()})

```

### 字典

当翻译内容是一个{}时，启用字典插值模式。
```javascript
// 源文件
// 假设网络状态取值：0=初始化,1=正在连接，2=已连接,3=正在断开.4=已断开,>4=未知

    t("当前状态:{status}",{status})

// translates/default.json

{
    "当前状态:{status}":{
        cn:{0:"初始化",1:"正在连接"，2:"已连接",3:"正在断开",4:"已断开",unknow:"未知"},
        en:{
            to:"Status:{}",
            vars:{"Init","Connecting","Connected","Disconnecting","Disconnected","unknow"}
        },
        en:"Status : {status | dict({0:"Init",1:"Connecting",2:"Connected",3:"Disconnecting",4:"Disconnected",5:"unknow"})}"
    }
}


```


### 异步格式化器

大部分情况下，`formatter`均应该是一个简单的同步函数。VoerkaI18n也支持采用异步`formatter`，也就是说`formatter`函数可以是一个`async`函数。
但是由于`t`函数是一个普通的同步函数，并且在应用程序中使用翻译时采用异步的意义并不大，比如我们打印到日志。

```javascript
    console.log(t("用户{ username | friend }没有权限",username))
```
上述语句中的friend格式化器如果是异步不可行的，但是在某此情况下，我们又的的确确需要异步的格式化器。
比如在使用字典时，以下例子中,假设用户职位采用一个字典描述（`0-普通员工`、`1-主管`、`2-经理`、`3-总经理`）。
常规情况下，应该由应用程序自行读取该字典
```javascript
    const post = await getDict(1)
    console.log(t("您的身份是{ post }",post.name))
```

```javascript
    console.log(t("您的身份是{ post | dict }",post))
```



用异步`formatter`需要遵循一定的流程约定。

- 首先定义一个异步`formatter`

```javascript
{
    cn:{
        dict:async ()=>{
            return {

            }
        }
    }
}
```

```javascript

t(" {value | dict() }",{value:2})

```

## 合并第三方库语言


```javascript

import i18n from "voerka-i18n"
import { t } from "./languages" 
  
t("xxxxx")

VoerkaI18n实例

messages:{
    cn:{
        default:{
            text1:""
        },
        namespace:{
            text1:""
        },
    }
}
```


## 一语多译

一语多译指同一句文本在不同的语景下，需要翻译成不同的内容。比如