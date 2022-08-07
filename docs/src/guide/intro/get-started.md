---
title: 快速入门
---


# 快速入门


本节以标准的`Nodejs`应用程序为例，简要介绍`VoerkaI18n`国际化框架的基本使用。其他`vue`或`react`应用的使用也基本相同。

```shell
myapp
  |--package.json
  |--index.js  
```

在本项目的所有支持的源码文件中均可以使用`t`函数对要翻译的文本进行包装，简单而粗暴。

```javascript | pure
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

```javascript | pure
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

```javascript | pure
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

```javascript | pure
>voerkai18n translate --provider baidu --appkey <在百度翻译上申请的密钥> --appid <在百度翻译上申请的appid>
```

 在项目文件夹下执行上面的语句，将会自动调用百度的在线翻译API进行翻译，以现在的翻译水平而言，您只需要进行少量的微调即可。关于`voerkai18n translate`命令的使用请查阅后续介绍。

## 第五步：编译语言包

当我们完成`myapp/languages/translates`下的所有`JSON语言文件`的翻译后（如果配置了名称空间后，每一个名称空间会对应生成一个文件，详见后续`名称空间`介绍），接下来需要对翻译后的文件进行编译。

```shell
myapp> voerkai18n compile
```

`compile`命令根据`myapp/languages/translates/*.json`和`myapp/languages/settings.json`文件编译生成以下文件：

```javascript | pure
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

```javascript | pure
import { t } from "./languages"   
```

因此，我们需要在需要进行翻译时导入该函数即可。

但是如果源码文件很多，重次重复导入`t`函数也是比较麻烦的，所以我们也提供了一个`babel/vite`等插件来自动导入`t`函数。

## 第六步：切换语言

当需要切换语言时，可以通过调用`change`方法来切换语言。

```javascript | pure
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// VoerkaI18n是一个全局单例，可以直接访问
await VoerkaI18n.change("en")
```

`i18nScope.change`与`VoerkaI18n.change`两者是等价的。

一般可能也需要在语言切换后进行界面更新渲染，可以订阅事件来响应语言切换。

```javascript | pure
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

## 第七步：语言包补丁

一般情况下，多语言的工程化过程就结束了，`voerkai18n`在多语言实践考虑得更加人性化。有没有经常发现这样的情况，当项目上线后，才发现：
- 翻译有误
- 客户对某些用语有个人喜好，要求你更改。
- 临时要增加支持一种语言

一般碰到这种情况，只好重新打包构建工程，重新发布，整个过程繁琐而麻烦。
现在`voerkai18n`针对此问题提供了完美的解决方案，可以通过服务器来为应用打语言包补丁和增加语言支持，而不需要重新打包应用和修改应用。
方法如下：

1. 注册一个默认的语言包加载器函数，用来从服务器加载语言包文件
```javascript | pure
import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```

2. 将语言包补丁文件保存在服务器上指定的位置`/languages/<应用名称>/<语言名称>.json`即可。
3. 当应用启动后会自动从服务器上加载语言补丁包，从而实现动为语言包打补丁的功能。也可以实现动态增加临时支持一种语言的功能

更完整的说明详见[`动态加载语言包`](../advanced/remote-load.md)和[`语言包补丁`](../advanced/lngpatch.md)功能介绍。


 