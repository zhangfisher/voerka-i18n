
适用于`Javascript/Vue/React/ReactNative`的国际化解决方案


[官方网站](zhangfisher.github.io/voerka-i18n/)


基于`javascript`的国际化方案很多，比较有名的有`fbt`、`i18next`、`react-i18next`、`vue-i18n`、`react-intl`等等，每一种解决方案均有大量的用户。为什么还要再造一个轮子？好吧，再造轮子的理由不外乎不满足于现有方案，总想着现有方案的种种不足之处，然后就撸起袖子想造一个轮子，也不想想自己什么水平。

哪么到底是对现有解决方案有什么不满？最主要有三点：

- 大部份均为要翻译的文本信息指定一个`key`，然后在源码文件中使用形如`$t("message.login")`之类的方式，然后在翻译时将之转换成最终的文本信息。此方式最大的问题是，在源码中必须人为地指定每一个`key`，在中文语境中，想为每一句中文均配套想一句符合语义的`英文key`是比较麻烦的，也很不直观不符合直觉。我希望在源文件中就直接使用中文，如`t("中华人民共和国万岁")`，然后国际化框架应该能自动处理后续的一系列麻烦。

- 要能够比较友好地支持多库多包`monorepo`场景下的国际化协作，当主程序切换语言时，其他包或库也可以自动切换，并且在开发上每个包或库均可以独立地进行开发，集成到主程序时能无缝集成。这点在现有方案上没有找到比较理想的解决方案。

- 大部份国际化框架均将中文视为二等公民，大部份情况下您应该采用英文作为第一语言，虽然这不是太大的问题，但是既然要再造一个轮子，为什么不将中文提升到一等公民呢。

  

  基于此就开始造出`VoerkaI18n`这个**全新的国际化多语言解决方案**，主要特性包括：

  

- 全面工程化解决方案，提供初始化、提取文本、自动翻译、编译等工具链支持。

- 符合直觉，不需要手动定义文本`Key`映射。

- 强大的插值变量`格式化器`机制，可以扩展出强大的多语言特性。

- 支持`babel`插件自动导入`t`翻译函数。

- 支持`nodejs`、浏览器(`vue`/`react`)前端环境。

- 采用`工具链`与`运行时`分开设计，发布时只需要集成很小的运行时。

- 高度可扩展的`复数`、`货币`、`数字`等常用的多语言处理机制。

- 翻译过程内，提取文本可以自动进行同步，并保留已翻译的内容。

- 可以随时添加支持的语言

- 支持调用在线自动翻译对提取文本进行翻译。

  

# 安装

`VoerkaI18n`国际化框架是一个开源多包工程，主要由以下几个包组成：

- **@voerkai18/cli**

  包含文本提取/编译等命令行工具，一般应该安装到全局。

  ```javascript
  npm install --g @voerkai18/cli
  yarn global add @voerkai18/cli
  pnpm add -g @voerkai18/cli
  ```
  
- **@voerkai18/runtime**

  **可选的**，运行时，`@voerkai18/cli`的依赖。大部分情况下不需要手动安装，一般仅在开发库项目时采用独立的运行时依赖。

  ```javascript
  npm install --save @voerkai18/runtime
  yarn add @voerkai18/runtime
  pnpm add @voerkai18/runtime
  ```
  
- **@voerkai18/formatters**

  **可选的**，一些额外的格式化器，可以按需进行安装到`dependencies`中，用来扩展翻译时对插值变量的额外处理。
  
- **@voerkai18/babel**
  
  可选的`babel`插件，用来实现自动导入翻译函数和翻译文本映射自动替换。
  
- **@voerkai18/vue**
  
  可选的`vue`插件，用来为Vue应用提供语言动态切换功能。
  
- **@voerkai18/vite**
  
  可选的`vite`插件，用来为`vite`应用提供自动导入翻译函数和翻译文本映射自动替换。


# 快速入门

本节以标准的`Nodejs`应用程序为例，简要介绍`VoerkaI18n`国际化框架的基本使用。其他`vue`或`react`应用的使用也基本相同。

```shell
myapp
  |--package.json
  |--index.js  
```

在本项目的所有支持的源码文件中均可以使用`t`函数对要翻译的文本进行包装，简单而粗暴。

```javascript
// index.js
console.log(t("中华人民共和国万岁"))
console.log(t("中华人民共和国成立于{}",1949))
```

`t`翻译函数是从`myapp/languages/index.js`文件导出的翻译函数，但是现在`myapp/languages`还不存在，后续会使用工具自动生成。`voerkai18n`后续会使用正则表达式对提取要翻译的文本。

## 第一步：安装命令行工具

```shell
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
>pnpm add -g @voerkai18/cli
```

## 第二步：初始化工程

在工程目录中运行`voerkai18n init`命令进行初始化。

```javascript
> voerkai18n init 
```

上述命令会在当前工程目录下创建`languages/settings.json`文件。如果您的源代码在`src`子文件夹中，则会创建在`src/languages/settings.json`

`settings.json`内容如下:

```json
{
    "languages": [
        {
            "name": "zh",
            "title": "zh"
        },
        {
            "name": "en",
            "title": "en"
        }
    ],
    "defaultLanguage": "zh",
    "activeLanguage": "zh",
    "namespaces": {}
}
```

上述命令代表了：

- 本项目拟支持`中文`和`英文`两种语言。
- 默认语言是`中文`(即在源代码中直接使用中文)
- 激活语言是`中文`

**注意：**

- `voerkai18n init`是可选的，`voerkai18n extract`也可以实现相同的功能。
- 一般情况下，您可以手工修改`settings.json`，如定义名称空间。

##  第三步：提取文本

接下来我们使用`voerkai18n extract`命令来自动扫描工程源码文件中的需要的翻译的文本信息。

```shell
myapp>voerkai18n extract
```

执行`voerkai18n extract`命令后，就会在`myapp/languages`通过生成`translates/default.json`、`settings.json`等相关文件。

- **translates/default.json** ： 该文件就是需要进行翻译的文本信息。

- **settings.json**： 语言环境的基本配置信息，可以进行修改。

最后文件结构如下：

```shell
myapp
  |-- languages
    |-- settings.json                // 语言配置文件
    |-- translates                   // 此文件夹是所有需要翻译的内容
      |-- default.json               // 默认名称空间内容
  |-- package.json
  |-- index.js

```

**如果略过第一步中的`voerkai18n init`，也可以使用以下命令来为创建和更新`settinbgs.json`**

```javascript
myapp>voerkai18n extract -D -lngs zh en de jp -d zh -a zh
```

以上命令代表：

- 扫描当前文件夹下所有源码文件，默认是`js`、`jsx`、`html`、`vue`文件类型。
- 计划支持`zh`、`en`、`de`、`jp`四种语言
- 默认语言是中文。（指在源码文件中我们直接使用中文即可）
- 激活语言是中文（即默认切换到中文）
- `-D`代表显示扫描调试信息

## 第四步：翻译文本

接下来就可以分别对`language/translates`文件夹下的所有`JSON`文件进行翻译了。每个`JSON`文件大概如下：

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

我们只需要修改该文件翻译对应的语言即可。

**重点：如果翻译期间对源文件进行了修改，则只需要重新执行一下`voerkai18n extract`命令，该命令会进行以下操作：**

- 如果文本内容在源代码中已经删除了，则会自动从翻译清单中删除。
- 如果文本内容在源代码中已修改了，则会视为新增加的内容。
- 如果文本内容已经翻译了一部份了，则会保留已翻译的内容。

因此，反复执行`voerkai18n extract`命令是安全的，不会导致进行了一半的翻译内容丢失，可以放心执行。

大部分国际化解决方案至此就需要交给人工进行翻译了，但是`voerkai18n`除了手动翻译外，通过`voerkai18n translate`命令来实现**调用在线翻译服务**进行自动翻译。

```javascript
>voerkai18n translate --provider baidu --appkey <在百度翻译上申请的密钥> --appid <在百度翻译上申请的appid>
```

 在项目文件夹下执行上面的语句，将会自动调用百度的在线翻译API进行翻译，以现在的翻译水平而言，您只需要进行少量的微调即可。关于`voerkai18n translate`命令的使用请查阅后续介绍。

## 第五步：编译语言包

当我们完成`myapp/languages/translates`下的所有`JSON语言文件`的翻译后（如果配置了名称空间后，每一个名称空间会对应生成一个文件，详见后续`名称空间`介绍），接下来需要对翻译后的文件进行编译。

```shell
myapp> voerkai18n compile
```

`compile`命令根据`myapp/languages/translates/*.json`和`myapp/languages/settings.json`文件编译生成以下文件：

```javascript
  |-- languages
    |-- settings.json                // 语言配置文件
    |-- idMap.js                     // 文本信息id映射表
    |-- runtime.js                   // 运行时源码
    |-- index.js                     // 包含该应用作用域下的翻译函数等
    |-- zh.js                        // 语言包
    |-- en.js
    |-- jp.js
    |-- de.js
    |-- translates                   // 此文件夹包含了所有需要翻译的内容
      |-- default.json
  |-- package.json
  |-- index.js

```

## 第六步：导入翻译函数

第一步中我们在源文件中直接使用了`t`翻译函数包装要翻译的文本信息，该`t`翻译函数就是在编译环节自动生成并声明在`myapp/languages/index.js`中的。

```javascript
import { t } from "./languages"   
```

因此，我们需要在需要进行翻译时导入该函数即可。

但是如果源码文件很多，重次重复导入`t`函数也是比较麻烦的，所以我们也提供了一个`babel/vite`等插件来自动导入`t`函数。

## 第六步：切换语言

当需要切换语言时，可以通过调用`change`方法来切换语言。

```javascript
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// VoerkaI18n是一个全局单例，可以直接访问
await VoerkaI18n.change("en")
```

`i18nScope.change`与`VoerkaI18n.change`两者是等价的。

一般可能也需要在语言切换后进行界面更新渲染，可以订阅事件来响应语言切换。

```javascript
import { i18nScope } from "./languages"

// 切换到英文
i18nScope.on((newLanguage)=>{
    ...
})
// 
VoerkaI18n.on((newLanguage)=>{
    ...
})
```

# 指南

## 翻译函数

默认提供翻译函数`t`用来进行翻译。一般情况下，`t`函数在执行`voerkai18n compile`命令生成在工程目录下的`languages`文件夹中。
```javascript

// 从当前语言包文件夹index.js中导入翻译函数
import { t } from "<myapp>/languages"

// 不含插值变量
t("中华人民共和国")

// 位置插值变量
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",1949,"北京")

// 当仅有两个参数且第2个参数是[]类型时，自动展开第一个参数进行位置插值
t("中华人民共和国成立于{year}年，首都{capital}",[1949,"北京"]) 
 
// 当仅有两个参数且第2个参数是{}类型时，启用字典插值变量
t("中华人民共和国成立于{year}年，首都{capital}",{year:1949,capital:"北京"})

// 插值变量可以是同步函数，在进行插值时自动调用。
t("中华人民共和国成立于{year}年，首都{capital}",()=>1949,"北京")

// 对插值变量启用格式化器
t("中华人民共和国成立于{birthday | year}年",{birthday:new Date()})

```

**注意：**

- `voerkai18n`使用正则表达式来提取要翻译的内容，因此`t()`可以使用在任意地方。

## 插值变量

`voerkai18n`的`t`函数支持使用**插值变量**，用来传入一个可变内容。

插值变量有`命名插值变量`和`位置插值变量`。

### **命名插值变量**

可以在t函数中使用`{变量名称}`表示一个命名插值变量。

```javascript
t("我姓名叫{name},我今年{age}岁",{name:"tom",age:12})
// 如果值是函数会自动调用
t("我姓名叫{name},我今年{age}岁",{name:"tom",age:()=>12})
```

仅当`t`函数仅有两个参数且第2个参数是`{}`类型时，启用字典插值变量，翻译时会自动进行插值。

### 位置插值变量

可以在t函数中使用一个空的`{}`表示一个位置插值变量。

```javascript
t("我姓名叫{},我今年{}岁","tom",12)
// 如果值是函数会自动调用
t("我姓名叫{},我今年{}岁","tom",()=>12})
// 如果只有两个参数，且第2个参数是一个数组，会自动展开
t("我姓名叫{},我今年{}岁",["tom",12])
//如果第2个参数不是{}时就启用位置插值。
t("我姓名叫{name},我今年{age}岁","tom",()=>12)
```


## 插值变量格式化

`voerka-i18n`支持强大的插值变量格式化机制，可以在插值变量中使用`{变量名称 | 格式化器名称 | 格式化器名称(...参数) | ... }`类似管道操作符的语法，将上一个输出作为下一个输入，从而实现对变量值的转换。此机制是`voerka-i18n`实现复数、货币、数字等多语言支持的基础。

我们假设定义以下格式化器（如果定义格式化器，详见后续）来进行示例。

- **UpperCase**：将字符转换为大写
- **division**：对数字按每n位一个逗号分割，支持一个可选参数分割位数，如`division(123456)===123,456`，`division(123456,4)===12,3456`
- **mr** : 自动添加一个先生称呼

```javascript
// My name is TOM
t("My name is { name | UpperCase }",{name:"tom"})

// 我国2021年的GDP是￥14,722,730,697,890
t("我国2021年的GDP是￥{ gdp | division}",{gdp:14722730697890})

// 支持为格式化器提供参数，按4位一逗号分割
// 我国2021年的GDP是￥14,7227,3069,7890
t("我国2021年的GDP是￥{ gdp | division(4)}",{gdp:14722730697890})

// 支持连续使用多个格式化器
// My name is Mr.TOM
t("My name is { name | UpperCase | mr }",{name:"tom"})


```

每个格式化器本质上是一个`(value)=>{...}`的函数，并且能**将上一个格式化器的输出作为下一个格式化器的输入**，格式化器具有如下特性：

- **无参数格式化器**

  使用无参数格式化器时只需传入名称即可。例如:`My name is { name | UpperCase }`

- **有参数格式化器**

  格式化器支持传入参数，如`{ gdp | division(4)}`、`{ date | format('yyyy/MM/DD')}`

  特别需要注意的是，格式化器的参数只能支持简单的类型的参数，如`数字`、`布尔型`、`字符串`。

  **不支持数组、对象和函数参数，也不支持复杂的表达式参数。**

- **支持连续使用多个格式化器**

  就如您预期的一样，**将上一个格式化器的输出作为下一个格式化器的输入**。

  `｛data | f1 | f2 | f3(1)｝`等效于` f3(f2(f1(data)),1)`

## 日期时间

`@voerkai18n/runtime`内置了对日期时间进行处理的格式化器，可以直接使用，不需要额外的安装。

```javascript
// 切换到中文
t("现在是{d | date}",new Date())   	// ==  现在是2022年3月12日
t("现在是{d | time}",new Date())   	// ==  现在是18点28分12秒
t("现在是{d | shorttime}",new Date())  // ==  现在是18:28:12
t("现在是{}",new Date())   			// ==  现在是2022年3月12日 18点28分12秒

// 切换到英文
t("现在是{d | date}",new Date())   // ==  Now is 2022/3/12
t("现在是{d | time}",new Date())   // ==  Now is 18:28:12
t("现在是{}",new Date())   		// ==  Now is 2022/3/20 19:17:24'
```
## 复数

当翻译文本内容是一个`数组`时启用复数处理机制。即在`langauges/tranclates/*.json`中的文本翻译项是一个数据。

### 启用复数处理机制
假设在`index.html`文件中具有一个翻译内容
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
        "en":["I don't have car","I have a car","I have two cars","I have {} cars"],
        "en":["I don't have car","I have a car","I have {} cars"],
        "en":["I don't have car","I have {} cars"],
        "de":"...." 
    }
}
```
上例中，只需要在翻译文件中将上述的`en:""`更改为`[<0对应的复数文本>,<1对应的复数文本>,...,<n对应的复数文本>]`形式代表启动复数机制.
- 可以灵活地为每一个数字(`0、1、2、...、n`)对应的复数形式进行翻译
- 数量数字大于数组长度，则总是取最后一个复数形式
- 复数形式的文本同样支持位置插值和变量插值。


### 对应的翻译函数


启用复数处理机制后，在`t`函数根据变量值来决定采用单数还是复数，按如下规则进行处理。


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

t("我有{}辆车",0)  		// ==   "I don't have a car"
t("我有{}辆车",1)  		// ==   "I have a car"
t("我有{}辆车",2)  		// ==   "I have two cars"
t("我有{}辆车",100)  	// == "I have 100 cars"
```

- **复数命名插值变量**

当启用复数功能时，`t`函数需要知道根据哪个变量来决定采用何种复数形式。

**当采用位置变量插值时，`t`函数取第一个数字类型参数作为位置插值复数。**


```javascript
t("{}有{}辆车","张三",0)
```

**当采用命名变量插值时，`t`函数约定当插值字典中存在以`$字符开头`的变量时，并且值是`数字`时，根据该变量来引用复数。**

下例中，`t`函数根据`$count`值来处理复数。

```javascript
t("{name}有{$count}辆车",{name:"张三",$count:1})
```

- **示例**

```javascript
// languages/translates/default.json
{
    "第{}章":{
        en:[
            "Chapter Zero","Chapter One", "Chapter Two", "Chapter Three","Chapter Four",
            "Chapter Five","Chapter Six","Chapter Seven","Chapter Eight","Chapter Nine",
            "Chapter {}"
        ],
        zh:["起始","第一章", "第二章", "第三章","第四章","第五章","第六章","第七章","第八章","第九章",“第{}章”]
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
// 超过取最后一项
t("第{}章",100)  // == Chapter 100
```


## 字典

`voerkiai18n`内置一个`dict`格式化器，可以直接使用。

```javascript
// 假设网络状态取值：0=初始化,1=正在连接，2=已连接,3=正在断开.4=已断开,>4=未知

t("当前状态:{status | dict(0,'初始化',1,'正在连接'，2,'已连接',3,'正在断开',4,'已断开','未知') }",status)
```

## 货币



## 名称空间

`voerkai18n `的名称空间是为了解决当源码文件非常多时，通过名称空间对翻译内容进行分类翻译的。

假设一个大型项目，其中源代码文件有上千个。默认情况下，`voerkai18n extract`会扫描所有源码文件将需要翻译的文本提取到`languages/translates/default.json`文件中。由于文件太多会导致以下问题：

- 内容太多导致`default.json`文件太大，有利于管理
- 有些翻译往往需要联系上下文才可以作出更准确的翻译，没有适当分类，不容易联系上下文。

因此，引入`名称空间`就是目的就是为了解决此问题。

配置名称空间，需要配置`languages/settings.json`文件。

```javascript
// 工程目录：d:/code/myapp
// languages/settings.json
module.exports = {
    namespaces:{
        //"名称":"相对路径"，
        “routes”:“routes”,
        "auth":"core/auth",
        "admin":"views/admin"
    }
}
```

以上例子代表：

- 将`d:\code\myapp\routes`中扫描到的文本提取到`routes.json`中。
- 将`d:\code\myapp\auth`中扫描到的文本提取到`auth.json`中。
- 将`d:\code\myapp\views/admin`中扫描到的文本提取到`admin.json`中。

最终在` languages/translates`中会包括：

```shell
languages
  |-- translates
      |-- default.json
      |-- routes.sjon
      |-- auth.json
      |-- admin.json      
```

然后，`voerkai18n compile`在编译时会自动合并这些文件，后续就不再需要名称空间的概念了。

`名称空间`仅仅是为了解决当翻译内容太多时的分类问题。



## 切换语言

可以通过全局单例或当前作用域实例切换语言。

```javascript
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// VoerkaI18n是一个全局单例，可以直接访问
VoerkaI18n.change("en")
```

侦听语言切换事件：

```javascript
import { i18nScope } from "./languages"

// 切换到英文
i18nScope.on((newLanguage)=>{
    ...
})
// 
VoerkaI18n.on((newLanguage)=>{
    ...
})
```

## Vue应用

在`Vue3`应用中引入`voerkai18n`来添加国际化应用需要由两个插件来简化应用。

- **@voerkai18n/vue**

  **Vue插件**，在初始化`Vue`应用时引入，提供访问`当前语言`、`切换语言`、`自动更新`等功能。

- **@voerkai18n/vite**

  **Vite插件**，在`vite.config.js`中配置，用来实现`自动文本映射`、`自动导入t函数`等功能。

  

`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，安装配置好这两个插件后，就可以在`Vue`文件使用多语言`t`函数。

**重点：`t`函数会在使用`@voerkai18n/vite`插件后自动注入，因此在`Vue`文件中可以直接使用。**

```Vue
<Script setup>
// 如果没有在vite.config.js中配置`@voerkai18n/vite`插件，则需要手工导入t函数
// import { t } from "./languages"
</Script>
<script>
export default {
    data(){
        return {
            username:"",
            password:"",
            title:t("认证")
        }
    },
    methods:{
        login(){
            alert(t("登录"))
        }
    }
}
</script>
<template>
	<div>
        <h1>{{ t("请输入用户名称") }}</h1>
        <div>
            <span>{{t("用户名:")}}</span><input type="text" :placeholder="t('邮件/手机号码/帐号')"/>
            <span>{{t("密码:")}}</span><input type="password" :placeholder="t('至少6位的密码')"/>            
    	</div>            
    </div>
        <button @click="login">{{t("登录")}}</button>
    </div>
</template>
```

**说明：**

- 事实上，就算没有`@voerkai18n/vue`和`@voerkai18n/vite`两件插件相互配合，只需要导入`t`函数也就可以直接使用。这两个插件只是很简单的封装而已。
- 如果要在应用中进行`语言动态切换`，则需要在应用中引入`@voerkai18n/vue`，请参阅`@voerkai18n/vue`插件使用说明。
- `@voerkai18n/vite`的使用请参阅后续说明。

## React应用



# 高级特性

## 运行时

`@voerkai18n/runtime`是`voerkai18n`的运行时依赖，支持两种依赖方式。

- **源码依赖**

  默认情况下，运行`voerkai18n compile`时会在`languages`文件下生成运行时文件`runtime.js`，该文件被`languages/index.js`引入，里面是核心运行时`ES6`源代码（`@voerkai18n/runtime`源码），也就是在您的工程中是直接引入的运行时代码，因此就不需要额外安装`@voerkai18n/runtime`了。

  此时，`@voerkai18n/runtime`源码就成为您工程是一部分。

- **库依赖**

  当运行`voerkai18n compile --no-inline-runtime`时，就不会生成运行时文件`runtime.js`，而是采用`import "@voerkai18n/runtime`的方式导入运行时，此时会自动/手动安装`@voerkai18n/runtime`到运行依赖中。

  

**那么应该选择`源码依赖`还是`库依赖`呢？**

问题的重点在于，在`monorepo`工程或者`开发库`时，`源码依赖`会导致存在重复的运行时源码。而采用`库依赖`，则不存在此问题。因此：

- 普通应用采用`源码依赖`方式，运行`voerkai18n compile `来编译语言包。
- `monorepo`工程或者`开发库`采用`库依赖`，`voerkai18n compile --no-inline-runtime`来编译语言包。



**注意：**

- `@voerkai18n/runtime`发布了`commonjs`和`esm`两个经过`babel/rollup`转码后的`ES5`版本。

- 每次运行`voerkai18n compile`时均会重新生成`runtime.js`源码文件，为了确保最新的运行时，请及时更新`@voerkai18n/cli`

- 当升级了`@voerkai18n/runtime`后，需要重新运行`voerkai18n compile`以重新生成`runtime.js`文件。

  

## 文本映射

虽然`VoerkaI18n`推荐采用`t("中华人民共和国万岁")`形式的符合直觉的翻译形式，而不是采用`t("xxxx.xxx")`这样不符合直觉的形式，但是为什么大部份的国际化方案均采用`t("xxxx.xxx")`形式？

在我们的方案中，t("中华人民共和国万岁")形式相当于采用原始文本进行查表，语言名形式如下：

```javascript
// en.js
{
    "中华人民共和国":"the people's Republic of China"
}
// jp.js
{
    "中华人民共和国":"中華人民共和国"
}
```

很显然，直接使用文本内容作为`key`，虽然符合直觉，但是会造成大量的冗余信息。因此，`voerkai18n compile`会将之编译成如下：

```javascript
//idMap.js
{
    "1":"中华人民共和国万岁"
}
// en.js
{
    "1":"Long live the people's Republic of China"
}
// jp.js
{
    "2":"中華人民共和国"
}
```

如此，就消除了在`en.js`、`jp.js`文件中的冗余。但是在源代码文件中还存在`t("中华人民共和国万岁")`，整个运行环境中存在两份副本，一份在源代码文件中，一份在`idMap.js`中。

为了进一步减少重复内容，因此，我们需要将源代码文件中的`t("中华人民共和国万岁")`更改为`t("1")`，这样就能确保无重复冗余。但是，很显然，我们不可能手动来更改源代码文件，这就需要由`voerkai18n`提供的一个编译区插件来做这一件事了。

以`babel-plugin-voerkai18n`插件为例，该插件同时还完成一份任务，就是自动读取`voerkai18n compile`生成的`idMap.js`文件，然后将`t("中华人民共和国万岁")`自动更改为`t("1")`，这样就完全消除了重复冗余信息。

所以，在最终形成的代码中，实际上每一个t函数均是`t("1")`、`t("2")`、`t("3")`、`...`、`t("n")`的形式，最终代码还是采用了用`key`来进行转换，只不过这个过程是自动完成的而已。

**注意：**

- 如果没有启用`babel-plugin-voerkai18n`或`vite`等编译区插件，还是可以正常工作，但是会有一份默认语言的冗余信息存在。

## 多库联动

`voerkai18n `支持多个库国际化的联动和协作，即**当主程序切换语言时，所有引用依赖库也会跟随主程序进行语言切换**，整个切换过程对所有库开发都是透明的。

![结构图](./images/arch.png)

当我们在开发一个应用或者库并`import "./languages"`时，在`langauges/index.js`进行了如下处理：

- 创建一个`i18nScope`作用域实例
- 检测当前应用环境下是否具有全局单例`VoerkaI18n`
  - 如果存在`VoerkaI18n`全局单例，则会将当前`i18nScope`实例注册到`VoerkaI18n.scopes`中
  - 如果不存在`VoerkaI18n`全局单例，则使用当前`i18nScope`实例的参数来创建一个`VoerkaI18n`全局单例。
- 在每个应用与库中均可以使用`import  { t } from ".langauges`导入本工程的`t`翻译函数，该`t`翻译函数被绑定当前`i18nScope`作用域实例，因此翻译时就只会使用到本工程的文本。这样就割离了不同工程和库之间的翻译。
- 由于所有引用的`i18nScope`均注册到了全局单例`VoerkaI18n`，当切换语言时，`VoerkaI18n`会刷新切换所有注册的`i18nScope`，这样就实现了各个`i18nScope`即独立，又可以联动语言切换。

## 自动导入翻译函数

使用`voerkai18 compile`后，要进行翻译时需要从`./languages`导入`t`翻译函数。

```javascript
import { t } from "./languages"
```

由于默认情况下，`voerkai18 compile`命令会在当前工程的`/languages`文件夹下，这样我们为了导入`t`翻译函数不得不使用各种相对引用，这即容易出错，又不美观，如下：

```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

作为国际化解决方案，一般工程的大部份源码中均会使用到翻译函数，这种使用体验比较差。

为此，我们提供了一个`babel`插件来自动完成翻译函数的自动引入，详见后续`bable`插件、`vite`插件等介绍。

## 自定义格式化器

当我们使用`voerkai18n compile`编译后，会生成`languages/formatters.js`文件，可以在该文件中自定义您自己的格式化器。

`formatters.js`文件内容如下：

```javascript
module.exports = {
    // 在所有语言下生效的格式化器
    "*":{ 
        //[格式化名称]:(value)=>{...},
        //[格式化名称]:(value,arg)=>{...},
    },                                                
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{
		// [数据类型名称]:(value)=>{...},
        // [数据类型名称]:(value)=>{...},
    },                                          
    zh:{
        $types:{
            // 所有类型的默认格式化器
            "*":{                
            },
            Date:{},
            Number:{},
            Boolean:{ },
            String:{},
            Array:{

            },
            Object:{

            }
        },
        [格式化名称]:(value)=>{.....},
        //.....
    },
    en:{
        $types:{
            // [数据类型名称]:(value)=>{...},
        },
        [格式化名称]:(value)=>{.....},
        //.....更多的格式化器.....
    }
}
```

### 格式化器函数

**每一个格式化器就是一个普通的同步函数**，不支持异步函数，格式化器函数可以支持无参数或有参数。

- 无参数的格式化器：`(value)=>{....返回格式化的结果...}`。

- 带参数的格式化器：`(value,arg1,...)=>{....返回格式化的结果...}`，其中`value`是上一个格式化器的输出结果。

### 类型格式化器

可以为每一种数据类型指定一个默认的格式化器，支持对`String`、`Date`、`Error`、`Object`、`Array`、`Boolean`、`Number`等数据类型的格式化。

当插值变量传入时，如果有定义了对应的的类型格式化器，会默认调用该格式化器对数据进行转换。

比如我们定义对`Boolean`类型格式化器，

```javascript
//formatters.js

module.exports = {
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{
		Boolean:(value)=> value ? "ON" : "OFF"
    }
} 
t("灯状态：{status}",true)  // === 灯状态：ON
t("灯状态：{status}",false)  // === 灯状态：OFF
```

在上例中，如果我们想在不同的语言环境下，翻译为不同的显示文本，则可以为不同的语言指定类型格式化器

```javascript
//formatters.js
module.exports = {
    zh:{
        $types:{
			Boolean:(value)=> value ? "开" : "关"
        }
    },
    en:{
      $types:{
		Boolean:(value)=> value ? "ON" : "OFF" 
      }
    }
} 
// 当切换到中文时
t("灯状态：{status}",true)  // === 灯状态：开
t("灯状态：{status}",false)  // === 灯状态：关
// 当切换到英文时
t("灯状态：{status}",true)  // === 灯状态：ON
t("灯状态：{status}",false)  // === 灯状态：OFF
```

**说明：**

- 完整的类型格式化器定义形式

  ```javascript
  module.exports = {
      "*":{
          $types:{...}
      },    
      zh:{
          $types:{...}
      },
      en:{
        $types:{....}
      }
  }
  ```

  在匹配应用格式化时会先在当前语言的`$types`中查找匹配的格式化器，如果找不到再上`*.$types`中查找。

- `*.$types`代表当所有语言中均没有定义时才匹配的类型格式化。

- 类型格式化器是**默认执行的，不需要指定名称**。

- 当前作用域的格式化器优先于全局的格式化器。

### 通用的格式化器

类型格式化器只针对特定数据类型，并且会默认调用。而通用的格式化器需要使用`|`管道符进行显式调用。

同样的，通用的格式化器定义在`languages/formatters.js`中。

```javascript
module.exports = {
    "*":{
        $types:{...},
         [格式化名称]:(value)=>{.....},       
    },    
    zh:{
        $types:{...},
        [格式化名称]:(value)=>{.....},
    },
    en:{
      $types:{....},
      [格式化名称]:(value)=>{.....},
      [格式化名称]:(value,arg)=>{.....},        
    }
}
```

每一个格式化器均需要指定一个名称，在进行插值替换时会优先依据当前语言来匹配查找格式化器，如果找不到，再到键名为`*`中查找。

```javascript
module.exports = {
    "*":{
		uppercase:(value)=>value
    },    
    zh:{
        uppercase:(value)=>["一","二","三","四","五","六","七","八","九","十"][value-1]
    },
    en:{
		uppercase:(value)=>["One","Two","Three","Four","Five","Six","seven","eight","nine","ten"][value-1]
    },
    jp:{
        
    }
}
// 当切换到中文时
t("{value | uppercase}",1)  // == 一
t("{value | uppercase}",2)  // == 二
t("{value | uppercase}",3)  // == 三
// 当切换到英文时
t("{value | uppercase}",1)  // == One
t("{value | uppercase}",2)  // == Two
t("{value | uppercase}",3)  // == Three
// 当切换到日文时，由于在该语言下没有定义uppercase格式式，因此到*中查找
t("{value | uppercase}",1)  // == 1
t("{value | uppercase}",2)  // == 2
t("{value | uppercase}",3)  // == 3
```

### 作用域格式化器

定义在`languages/formatters.js`里面的格式化器仅在当前工程生效，也就是仅在当前作用域生效。一般由应用开发者自行扩展。

### 全局格式化器

定义在`@voerkai18n/runtime`里面的格式化器则全局有效，在所有场合均可以使用，但是其优先级低于作用域内的同名格式化器。目前内置的格式化器有：

| 名称 |      | 说明 |
| ---- | ---- | ---- |
|      |      |      |
|      |      |      |
|      |      |      |

### 扩展格式化器

除了可以在当前项目`languages/formatters.js`自定义格式化器和`@voerkai18n/runtime`里面的全局格式化器外，单列了`@voerkai18n/formatters`项目用来包含了更多的格式化器。

作为开源项目，欢迎大家提交贡献更多的格式化器。

## 语言包

当使用`webpack`、`rollup`、`esbuild`进行项目打包时，默认语言包采用静态加载，会被打包进行源码中，而其他语言则采用异步打包方式。在`languages/index.js`中。

```javascript
const defaultMessages =  require("./zh.js")  
const activeMessages = defaultMessages
  
// 语言作用域
const scope = new i18nScope({
    default:   defaultMessages,                 // 默认语言包
    messages : activeMessages,                  // 当前语言包
    ....
    // 以下为每一种语言生成一个异步打包语句
    loaders:{ 
        "en" : ()=>import("./en.js") 
        "de" : ()=>import("./de.js") 
        "jp" : ()=>import("./jp.js") 
    })
```

## 自动翻译

内置的`voerkai18n translate`命令能调用在线翻译服务完成对提取的文本的自动翻译。

目前支持访问百度在线API进行自动翻译。百度提供了免费的在线API，虽然只支持`QPS=1`，即每秒调用一次。但是`voerkai18n translate`命令会对要翻译的文本进行合并后再调用，因此大部分情况下，均足够使用了。

执行`voerkai18n translate`命令后，将大大提高您国际化的效率。

## 语言代码

请参阅https://fanyi-api.baidu.com/doc/21。

# 扩展工具

## babel插件

全局安装`@voerkai18n/babel`插件用来进行自动导入`t`函数和自动文本映射。

```javascript
> npm install -g @voerkai18n/babel
> yarn global add @voerkai18n/babel
> pnpm add -g @voerkai18n/babel
```

使用方法如下：

- 在`babel.config.js`中配置插件

```javascript
const i18nPlugin =  require("@voerkai18n/babel")
module.expors = {
    plugins: [
        [
            i18nPlugin,
            {
                // 可选，指定语言文件存放的目录，即保存编译后的语言文件的文件夹
                // 可以指定相对路径，也可以指定绝对路径
                // location:"",
                autoImport:"#/languages"  
            }            
        ]
    ]
}
```

这样，当在进行`babel`转码时，就会自动在`js`源码文件中导入`t`翻译函数。

`babel-plugin-voerkai18n`插件支持以下参数:

- **location**

  配置`langauges`文件夹位置，默认会使用当前文件夹下的`languages`文件。

  因此，如果你的`babel.config.js`在项目根文件夹，而`languages`文件夹位于`src/languages`，则可以将`location="src/languages"`，这样插件会自动从该文件夹读取需要的数据。

- **autoImport**

  用来配置导入的路径。比如 `autoImport="#/languages"  `，则当在babel转码时，如果插件检测到t函数的存在并没有导入，就会自动在该源码中自动导入`import { t } from "#/languages"`

  配置`autoImport`时需要注意的是，为了提供一致的导入路径，视所使用的打包工具或转码插件，如`webpack`、`rollup`等。比如使用`babel-plugin-module-resolver`

  ```javascript
  module.expors = {
      plugins: [
          [
              "module-resolver",
              {
                  root:"./",
  				alias:{
                      "languages":"./src/languages"
                  }
              }            
          ]
      ]
  }
  ```

  这样配置`autoImport="languages"`，则自动导入`import { t } from "languages"`。

  如`webpack`、`rollup`等打包工具也有类似的插件可以实现别名等转换，其目的就是让`babel-plugin-voerkai18n`插件能自动导入固定路径，而不是各种复杂的相对路径。

## Vue插件

在`vue3`项目中可以安装`@voerkai18n/vue`来实现`枚举语言`、`语言切换`等功能。

### **安装**

将`@voerkai18n/vue`安装为运行时依赖

```javascript
npm install @voerkai18n/vue
pnpm add @voerkai18n/vue
yarn add @voerkai18n/vue
```

### 启用插件

```javascript
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })   // 重点，需要引入i18nScope
    app.mount('#app')
```

插件安装成功后，在当前`Vue App`实例上`provide`一个`i18n`响应式实例。

### 注入`i18n`实例

接下来在组件中按需注入`i18n`实例，可以用来访问当前的`激活语言`、`默认语言`、`切换语言`等。

```javascript
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],    // 注入i18n实例，该实例由@voerkai18n/vue插件提供
  ....
}
</script>  
```

声明`inject: ['i18n']`后在当前组件实例中就可以访问`this.i18n`，该实例是一个经过`reactive`封闭的响应式对象，其内容是：

```javascript
this.i18n = {
  	activeLanguage,					// 当前激活语言，可以通过直接赋值来切换语言
    defaultLanguage,				// 默认语言名称
    languages						// 支持的语言列表=[{name,title},...]
}
```

### 应用示例

注入`i18n`实例后就可以在此基础上实现`激活语言`、`默认语言`、`切换语言`等功能。

```vue
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],    // 注入i18n实例，该实例由@voerkai18n/vue插件提供
  ....
}
</script>  
<template>
	<div>当前语言:{{i18n.activeLanguage}}</div>
	<div>默认语言:{{i18n.defaultLanguage}}</div>	
	<div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
			{{ lng.title }}        
	    </button>
    </div>
</templage>
```

### 插件参数

`@voerkai18n/vue`插件支持以下参数：

```javascript
import { i18nScope } from './languages'
app.use(i18nPlugin,{ 
    i18nScope,				// 重点，需要引入当前作用域的i18nScope
    forceUpdate:true		// 当语言切换时是否强制重新渲染
})   

```

- 当`forceUpdate=true`时，`@voerkai18n/vue`插件在切换语言时会调用`app._instance.update()`对整个应用进行强制重新渲染。大部分情况下，切换语言时强制对整个应用进行重新渲染的行为是符合预期的。您也可以能够通过设`forceUpdate=false`来禁用强制重新渲染，此时，界面就不会马上看到语言的切换，需要您自己控制进行重新渲染。

## Vite插件

`@voerkai18n/babel`插件在`vite`应用中不能正常使用，需要使用`@voerkai18n/vite`插件来完成类似的功能，包括自动文本映射和自动导入`t`函数。

### 安装

`@voerkai18n/vite`只需要作为开发依赖安装即可。

```javascript
npm install --save-dev @voerkai18n/vite
yarn add -D @voerkai18n/vite
pnpm add -D @voerkai18n/vite 
```

### 启用插件

接下来在`vite.config.js`中配置启用`@voerkai18n/vite`插件。

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'// 可选的
import Voerkai18nPlugin from "@voerkai18n/vite"
export default defineConfig({
    plugins: [
        Inspect(),  // 可选的
        Voerkai18nPlugin({debug:true}),
        vue()
    ]
})

```

- ` vite-plugin-inspect`是开发`vite`插件时的调试插件，启用后就可以通过`localhost:3000/__inspect/ `查看Vue源码文件经过插件处理前后的内容，一般是Vite插件开发者使用。上例中安装后，就可以查看`Voerkai18nPlugin`对`Vue`文件干了什么事，可以加深理解，**正常使用不需要安装**。

### 插件功能

`@voerkai18n/vite`插件配置启用后，`vite`在进行`dev`或`build`时，就会在`<script setup>....</script>`自动注入`import { t } from "languages"	`，同时会扫描源代码文件（包括`vue`,`js`等），根据`idMap.js`文件里面的文本映射表，将`t('"xxxx")`转换成`t("<id>")`的形式。

不同于`@voerkai18n/babel`插件，`@voerkai18n/vite`插件不需要配置`location`和`autoImport`参数，能正确地处理导入`languages`路径。

### 插件参数

`vite`插件支持以下参数：

```javascript
import Voerkai18nPlugin from "@voerkai18n/vite"
export default defineConfig({
    plugins: [
        Inspect(),  										// 可选的
        Voerkai18nPlugin({
            location: "./",                                 // 可选的，指定当前工程目录
            autoImport: true,                               // 是否自动导入t函数
            debug:false,                                    // 是否输出调试信息，当=true时，在控制台输出转换匹配的文件清单
            patterns:[
                "!(?<!.vue\?.*).(css|json|scss|less|sass)$",          // 排除所有css文件
                /\.vue(\?.*)?/,                                     // 所有vue文件
            ]    
        }),
        vue()
    ]
})
```

- `location`：可选的，用来指定当前工程目录，一般情况是不需要配置的，会自动取当前文件夹。并且假设`languages`文件夹在`<location>/src/languages`文件夹下。

- `autoImport`：可选的，默认`true`，用来配置是否自动导入`t`函数。当vue文件没有指定导入时才会自动导入，并且根据当前vue文件的路径处理好导入位置。

- `debug`：可选的，开启后会在控制台输出一些调试信息，对一般用户没有用。

- `patterns`：可选的，一些正则表达式匹配规则，用来过滤匹配哪一些文件需要进行扫描和处理。默认的规则：

  ```javascript
  const patterns={
     	"!(?<!.vue\?.*).(css|json|scss|less|sass)$",          	// 排除所有css文件
     	/\.vue(\?.*)?/,                                     	// 所有vue文件
     	"!.*\/node_modules\/.*",								// 排除node_modules
     	"!/.*\/languages\/.*",           					 	// 默认排除语言文件
      "!\.babelrc",											// 排除.babelrc
  	"!babel\.config\.js",									// 排除babel.config.js
      "!package\.json$",										// 排除package.json
      "!vite\.config\.js",									// 排除vite.config.js
      "!^plugin-vue:.*"										// 排除plugin-vue
  }
  ```

  `patterns`的匹配规则语法支持`正则表达式字符串`和`正则表达式`两种，用来对经vite处理的文件名称进行匹配和处理。

  - `正则表达式`比较容易理解，匹配上的就进行处理。
  - `正则表达式字符串`支持一些简单的语法扩展，包括：
    - `!`符号：添加在字符串前面来进行排除匹配。
    - `**`：将`**`替换为`.*`，允许使用类似`"/code/apps/test/**/node_modules/**"`的形式来匹配连续路径。
    - `？`：将`？`替换为`[^\/]?`，用来匹配单个字符
    - `*`：将`*`替换为`[^\/]*`，匹配路径名称

## React扩展



# 命令行

全局安装`@voerkai18n/cli`工具。

```javascript
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18n/cli
```

然后就可以执行：

```javascript
> voerkai18n init
> voerkai18n extract
> voerkai18n compile
```

如果没有全局安装，则需要：

```javascript
> yarn voerkai18n init
> yarn voerkai18n extract
> yarn voerkai18n compile
---
> pnpm voerkai18n init
> pnpm voerkai18n extract
> pnpm voerkai18n compile
```

## init

用于在指定项目创建`voerkai18n`国际化配置文件。

```shell
> voerkai18n init --help
初始化项目国际化配置
Arguments:
  location                           工程项目所在目录
Options:
  -D, --debug                        输出调试信息
  -r, --reset                        重新生成当前项目的语言配置
  -lngs, --languages <languages...>  支持的语言列表 (default: ["zh","en"])
  -d, --defaultLanguage              默认语言
  -a, --activeLanguage               激活语言
  -h, --help                         display help for command
```

**使用方法如下：**

首先需要在工程文件下运行`voerkai18n init`命令对当前工程进行初始化。

```javascript
//- `lngs`参数用来指定拟支持的语言名称列表
> voerkai18n init . -lngs zh en jp de -d zh
```

运行`voerkai18n init`命令后，会在当前工程中创建相应配置文件。

```javascript
myapp
  |-- languages 
    |-- settings.json               // 语言配置文件
  |-- package.json
  |-- index.js
```

`settings.json`文件很简单，主要是用来配置要支持的语言等基本信息。

```javascript
module.exports = {
    // 拟支持的语言列表
    "languages": [
        {
            "name": "zh",
            "title": "中文"
        },
        {
            "name": "en",
            "title": "英文"
        }
    ],
    // 默认语言，即准备在源码中写的语言，一般我们可以直接使用中文
    "defaultLanguage": "zh",
    // 激活语言，即默认要启用的语言，一般等于defaultLanguage
    "activeLanguage": "zh",
    // 翻译名称空间定义，详见后续介绍。
    "namespaces": {}
}
```

**说明：**

- 您也可以手动自行创建`languages/settings.json`文件。这样就不需运行`voerkai18n init`命令了。

- 如果你的源码放在`src`文件夹，则`init`命令会自动在在`src`文件夹下创建`languages`文件夹。

- `voerkai18n init`是可选的，直接使用`extract`时也会自动创建相应的文件。

- `-m`参数用来指定生成的`settings.json`的模块类型：
  - 当`-m=auto`时，会自动读取前工程`package.json`中的`type`字段
  - 当`-m=esm`时，会生成`ESM`模块类型的`settings.json`。
  - 当`-m=cjs`时，会生成`commonjs`模块类型的`settings.json`。
  
- `location`参数是可选的，如果没有指定则采用当前目录。

  如果你想将`languages`安装在`src/languages`下，则可以指定`voerkai18n init ./src`

## extract

扫描提取当前项目中的所有源码，提取出所有需要翻译的文本内容并保存在到`<工程源码目录>/languages/translates/*.json`。

```shell
> voerkai18n extract --help
扫描并提取所有待翻译的字符串到<languages/translates>文件夹中

Arguments:
  location                     工程项目所在目录 (default: "./")

Options:
  -D, --debug                  输出调试信息
  -lngs, --languages           支持的语言
  -d, --defaultLanguage  默认语言
  -a, --activeLanguage    激活语言
  -ns, --namespaces            翻译名称空间
  -e, --exclude <folders>      排除要扫描的文件夹，多个用逗号分隔
  -u, --updateMode             本次提取内容与已存在内容的数据合并策略,默认取值sync=同步,overwrite=覆盖,merge=合并
  -f, --filetypes              要扫描的文件类型
  -h, --help                   display help for command
```

**说明：**

- 启用`-d`参数时会输出提取过程，显示从哪些文件提取了几条信息。
- 如果已手动创建或通过`init`命令创建了`languages/settings.json`文件，则可以不指定`-ns`，`-lngs`，`-d`，`-a`参数。`extract`会优先使用`languages/settings.json`文件中的参数来进行提取。
- `-u`参数用来指定如何将提取的文本与现存的文件进行合并。因为在国际化流程中，我们经常面临源代码变更时需要更新翻译的问题。支持三种合并策略。
  - **sync**：同步（默认值）,两者自动合并，并且会删除在源码文件中不存在的文本。如果某个翻译已经翻译了一半也会保留。此值适用于大部情况，推荐。
  - **overwrite**：覆盖现存的翻译内容。这会导致已经进行了一半的翻译数据丢失，**慎用**。
  - **merge**：合并，与sync的差别在于不会删除源码中已不存在的文本。
- `-e`参数用来排除扫描的文件夹，多个用逗号分隔。内部采用`gulp.src`来进行文件提取，请参数。如 `-e !libs,core/**/*`。默认会自动排除`node_modules`文件夹
- `-f`参数用来指定要扫描的文件类型，默认`js,jsx,ts,tsx,vue,html`
- `extract`是基于正则表达式方式进行匹配的，而不是像`i18n-next`采用基于`AST`解析。

>**重点：**
>
>默认情况下，`voerkai18n extract`可以安全地反复多次执行，不会导致已经翻译一半的内容丢失。
>
>如果想添加新的语言支持，也`voerkai18n extract`也可以如预期的正常工作。

## translate

在工程文件夹下执行`voerkai18n translate`命令，该命令会读取`languages/settings.json`配置文件，并调用在线翻译服务（如百度在线翻译）对提取的文本(`languages/translates/*.json`)进行自动翻译。

```shell
Usage: voerkai18n translate [options] [location]

调用在线翻译服务商的API翻译译指定项目的语言包,如使用百度云翻译服务

Arguments:
  location                        工程项目所在目录

Options:
  -p, --provider <value>          在线翻译服务提供者名称或翻译脚本文件 (default: "baidu")
  -m, --max-package-size <value>  将多个文本合并提交的最大包字节数 (default: 3000)
  --appkey [key]                  API密钥
  --appid [id]                    API ID
  --no-backup                     备份原始文件
  --mode                          翻译模式，取值auto=仅翻译未翻译的,full=全部翻译
  -q, --qps <value>               翻译速度限制,即每秒可调用的API次数 (default: 1)
  -h, --help                      显示帮助
```

- 内置支持调用百度的在线翻译服务，您需要百度的网站上(http://api.fanyi.baidu.com/)申请开通服务，开通后可以得到`appid`和`appkey`（密钥）。

- `--provider`用来指定在线翻译服务提供者，内置支持的是百度在线翻译。也可以传入一个js脚本，如下：

  ```javascript
  // youdao.js
  module.exports = async function(options){
      let { appkey,appid } = options
      return {
          translate:async (texts,from,to){
          	// texts是一个Array
          	// from,to代表要从哪一种语言翻译到何种语言
          	.....
          	// 在此对texts内容调用在线翻译API
  	        // 翻译结果应该返回与texts对应的数组
              // 如果出错则应该throw new Error()
          	return [...]
  	    }
      }
  }
  ```

- `qps`用来指定调用在线翻译API的速度，默认是1，代表每秒调用一次；此参数的引入是考虑到有些翻译平台的免费API有QPS限制。比如百度在线翻译免费版本限制`QPS`就是1，即每秒只能调用一次。如果您购买了服务，则可以将`QPS`调高。

- 默认情况下，每次运行时均会备份原始的翻译文件至`languages/translates/backup`，`--no-backup`可以禁止备份。

- 默认情况下，`voerkai18n translate`会在每次运行时跳过已经翻译过的内容，这样可以保留翻译成果。此特性在您对自动翻译的内容进行修改后，再多次运行`voerkai18n translate`命令时均能保留翻译内容，不会导致您修改调整过的内容丢失。`--mode full`参数可以完全覆盖翻译，请慎用。

- 为了提高在线翻译的速度，`voerkai18n translate`并不是一条文本调用一次API，而是将多条文本合并起来进行调用，但是单次调用也是有数据包大小的限制的，`--max-package-size`参数用来指定数据包的最大值。比如百度建议，为保证翻译质量，请将单次请求长度控制在 6000 bytes以内（汉字约为输入参数 2000 个）。

- 需要注意的是，自动翻译虽然准确性还不错，真实场景还是需要进行手工调整的，特别是自动翻译一般不能识别插值变量。

## compile

编译当前工程的语言包，编译结果输出在.`/langauges`文件夹。

```shell
Usage: voerkai18n compile [options] [location]

编译指定项目的语言包

Arguments:
  location                  工程项目所在目录 (default: "./")

Options:
  -D, --debug               输出调试信息
  -m, --moduleType [types]  输出模块类型,取值auto,esm,cjs (default: "esm")
  --no-inline-runtime       不嵌入运行时源码
  -h, --help                display help for command
```

`voerkai18n compile`执行后会在`langauges`文件夹下输出：

```javascript
myapp
  |--- langauges
    |-- index.js              // 当前作用域的源码
    |-- idMap.js              // 翻译文本与id的映射文件
    |-- formatters.js         // 自定义格式化器
    |-- zh.js                 // 中文语言包
    |-- en.js       	      // 英文语言包 
    |-- xx.js           	  // 其他语言包
    |-- ...
```

**说明：**

- 在当前工程目录下，一般不需要指定参数就可以反复多次进行编译。
- 您每次修改了源码并`extract`后，均应该再次运行`compile`命令。
- 如果您修改了`formatters.js`，执行`compile`命令不会重新生成和修改该文件。
- `--no-inline-runtime `参数用来指示如何引用运行时。默认会将运行时代码生成保存在`languages/runtime.js`，应用以源码形式引用。当启用`--no-inline-runtime `参数时会采用`require("@voerkai18n/runtime")`的方式。

# API

## i18nScope

每个工程会创建一个`i18nScope`实例。

```javascript
import { i18nScope } from "./languages"

// 订阅语言切换事件
i18nScope.on((newLanguage)=>{...})
// 取消语言切换事件订阅
i18nScope.off(callback)
// 当前作用域配置
i18nScope.settings
// 当前语言
i18nScope.activeLanguage         // 如zh

// 默认语言
i18nScope.defaultLanguage         
// 返回当前支持的语言列表，可以用来显示
i18nScope.languages    // [{name:"zh",title:"中文"},{name:"en",title:"英文"},...]
// 返回当前作用域的格式化器                         
i18nScope.formatters   
// 当前作用id
i18nScope.id
// 切换语言，异步函数
await i18nScope.change(newLanguage)
// 当前语言包                         
i18nScope.messages        // {1:"...",2:"...","3":"..."}
// 引用全局VoerkaI18n实例                         
i18nScope.global
// 注册当前作用域格式化器
i18nScope.registerFormatter(name,formatter,{language:"*"})      
```

## VoerkaI18n

当`import {} form "./languages"`时会自动创建全局单`VoerkaI18n`

```javascript
// 订阅语言切换事件
VoerkaI18n.on((newLanguage)=>{...})
// 取消语言切换事件订阅
VoerkaI18n.off(callback)
// 取消所有语言切换事件订阅
VoerkaI18n.offAll()
                              
// 返回当前默认语言
VoerkaI18n.defaultLanguage
// 返回当前激活语言
VoerkaI18n.activeLanguage
// 返回当前支持的语言
VoerkaI18n.languages                              
// 切换语言
await VoerkaI18n.change(newLanguage)
// 返回全局格式化器
VoerkaI18n.formatters                              
// 注册全局格式化器
VoerkaI18n.registerFormatter(name,formatter,{language:"*"})                              
                              
```
 