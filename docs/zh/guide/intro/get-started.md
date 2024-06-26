# 快速入门<!-- {docsify-ignore-all} -->


本节以标准的`Nodejs`应用程序为例，简要介绍`VoerkaI18n`国际化框架的基本使用。

`vue`或`react`应用的使用流程也基本相同，可以参考[Vue集成](../integration/vue)和[React集成](../integration/react)。


<lite-tree>
myapp
  package.json
  index.js
</lite-tree>

> 上述树组件基于[Lite-Tree](https://zhangfisher.github.io/lite-tree/)构建。

在本项目的所有支持的源码文件中均可以使用`t`函数对要翻译的文本进行包装，简单而粗暴。

```javascript 
// index.js
console.log(t("中华人民共和国万岁"))
console.log(t("中华人民共和国成立于{}",1949))
```

`t`翻译函数是从`myapp/languages/index.js`文件导出的翻译函数，但是现在`myapp/languages`还不存在，后续会使用工具自动生成。`voerkai18n`后续会使用正则表达式对提取要翻译的文本。

## 第一步：安装命令行工具
安装`@voerkai18n/cli`到全局。
```shell
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18n/cli
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
            "title": "zh",
            "default": true,    // 默认语言
        },
        {
            "name": "en",
            "title": "en"
        }
    ],
    "namespaces": {}
}
```

上述命令代表了：

- 本项目拟支持`中文`和`英文`两种语言。
- 默认语言是`中文`（即在源代码中直接使用中文）
- 激活语言是`中文`（代表当前生效的语言）

**注意：**

- 可以修改该文件来配置支持的语言、默认语言、激活语言等。可支持的语言可参阅[语言代码列表](../../reference/lang-code)。
- `voerkai18n init`是可选的，`voerkai18n extract`也可以实现相同的功能。
- 一般情况下，您可以手工修改`settings.json`，如定义名称空间。
- `voerkai18n init`仅仅是创建`languages`文件，并且生成`settings.json`,因此您也可以自己手工创建。
- 针对`js/typescript`或`react/vue`等不同的应用，`voerkai18n init`可以通过不同的参数来配置生成`ts`文件或`js`文件。
- 更多的`voerkai18n init`命令的使用请查阅[这里](../tools/cli.md)

##  第三步：标识翻译内容

接下来在源码文件中，将所有需要翻译的内容使用`t`翻译函数进行包装，例如下：
```javascript 
import { t } from "./languages"
// 不含插值变量
t("中华人民共和国")
// 位置插值变量
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",1949,"北京")
```
`t`翻译函数只是一个普通函数，您需要为之提供执行环境，关于`t`翻译函数的更多用法见[这里](../use/t.md)

##  第四步：提取文本

接下来我们使用`voerkai18n extract`命令来自动扫描工程源码文件中的需要的翻译的文本信息。
`voerkai18n extract`命令会使用正则表达式来提取`t("提取文本")`包装的文本。

```shell
myapp>voerkai18n extract
```

执行`voerkai18n extract`命令后，就会在`myapp/languages`通过生成`translates/default.json`、`settings.json`等相关文件。

- **translates/default.json** ： 
    该文件就是从当前工程扫描提取出来的需要进行翻译的文本信息。所有需要翻译的文本内容均会收集到该文件中。
- **settings.json**： 语言环境的基本配置信息,包含支持的语言、默认语言、激活语言等信息。

最后文件结构如下：


<lite-tree>
myapp
  languages
    settings.json                // 语言配置文件
    translates                   // 此文件夹是所有需要翻译的内容
        default.json               // 默认名称空间内容
  package.json
  index.js
</lite-tree>

**如果略过第一步中的`voerkai18n init`，也可以使用以下命令来为创建和更新`settings.json`**

```javascript 
myapp>voerkai18n extract -D -lngs zh en de jp -d zh -a zh
```

**以上命令代表：**

- 扫描当前文件夹下所有源码文件，默认是`js`、`jsx`、`html`、`vue`文件类型。
- 支持`zh`、`en`、`de`、`jp`四种语言
- 默认语言是中文。（指在源码文件中我们直接使用中文即可）
- 激活语言是中文（即默认切换到中文）
- `-D`代表显示扫描调试信息,可以显示从哪些文件提供哪些文本

## 第五步：人工翻译

接下来就可以分别对`language/translates`文件夹下的所有`JSON`文件进行翻译了。每个`JSON`文件大概如下：

```json
{
    "中华人民共和国万岁":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>",
        "jp":"<在此编写对应的日文翻译内容>",
        "$files":["index.js"]    // 记录了该信息是从哪几个文件中提取的
    },
	"中华人民共和国成立于{}":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>",
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

**总之，反复执行`voerkai18n extract`命令是安全的，不会导致进行了一半的翻译内容丢失，可以放心执行。**

## 第六步：自动翻译

`voerkai18n`支持通过`voerkai18n translate`命令来实现**调用在线翻译服务**进行自动翻译。

```javascript 
>voerkai18n translate --appkey <在百度翻译上申请的密钥> --appid <在百度翻译上申请的appid>
```

在项目文件夹下执行上面的语句，将会自动调用`百度的在线翻译API`进行翻译，以现在的翻译水平而言，您只需要进行少量的微调即可。关于`voerkai18n translate`命令的使用请查阅后续介绍。

## 第七步：编译语言包

当我们完成`myapp/languages/translates`下的所有`JSON语言文件`的翻译后（如果配置了名称空间后，每一个名称空间会对应生成一个文件，详见后续`名称空间`介绍），接下来需要对翻译后的文件进行编译。

```shell
myapp> voerkai18n compile
```

`compile`命令根据`myapp/languages/translates/*.json`和`myapp/languages/settings.json`文件编译生成以下文件： 

<lite-tree>
myapp
    languages
        settings.json                // 语言配置文件
        idMap.js                     // 文本信息id映射表
        index.js                     // 包含该应用作用域下的翻译函数等
        storage.js
        zh.js                        // 语言包
        en.js
        jp.js
        de.js
        formatters                   // 自定义扩展格式化器
            zh.js                     
            en.js
            jp.js
            de.js
        translates                   // 此文件夹包含了所有需要翻译的内容
            default.json
    package.json
    index.js

</lite-tree>

## 第八步：导入翻译函数

第一步中我们在源文件中直接使用了`t`翻译函数包装要翻译的文本信息，该`t`翻译函数就是在编译环节自动生成并声明在`myapp/languages/index.js`中的。

```javascript 
import { t } from "./languages"   
```

因此，我们需要在需要进行翻译时导入该函数即可。

但是如果源码文件很多，重次重复导入`t`函数也是比较麻烦的，所以我们也提供了一个`babel/vite`等插件来自动导入`t`函数，可以根据使用场景进行选择。

## 第九步：切换语言

当需要切换语言时，可以通过调用`change`方法来切换语言。

```javascript 
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// 或者VoerkaI18n是一个全局单例，可以直接访问
await VoerkaI18n.change("en")
```

`i18nScope.change`与`VoerkaI18n.change`两者是等价的。

一般可能也需要在语言切换后进行界面更新渲染，可以订阅事件来响应语言切换。

```javascript 
import { i18nScope } from "./languages"

// 切换到英文
i18nScope.on("change",(newLanguage)=>{
    // 在此重新渲染界面
    ...

})
// 
VoerkaI18n.on("change",(newLanguage)=>{
     // 在此重新渲染界面
     ...
})
```
[@voerkai18n/vue](../integration/vue)和[@voerkai18n/react](../integration/react.md)提供了相对应的插件和库来简化重新界面更新渲染。

## 第十步：语言包补丁

一般情况下，多语言的工程化过程就结束了，`voerkai18n`在多语言实践考虑得更加人性化。有没有经常发现这样的情况，当项目上线后，才发现：
- 翻译有误
- 客户对某些用语有个人喜好，要求你更改。
- 临时要增加支持一种语言

一般碰到这种情况，只好重新打包构建工程，重新发布，整个过程繁琐而麻烦。
现在`voerkai18n`针对此问题提供了完美的解决方案，可以通过服务器来为应用`打语言包补丁`和`动态增加语言`支持，而不需要重新打包应用和修改应用。

**方法如下：**

1. 注册一个默认的语言包加载器函数，用来从服务器加载语言包文件。
```javascript 
import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```

2. 将语言包补丁文件保存在Web服务器上指定的位置`/languages/<应用名称>/<语言名称>.json`即可。
3. 当应用启动后会自动从服务器上加载语言补丁包合并，从而实现动为语言包打补丁的功能。
4. 利用该特性也可以实现动态增加临时支持一种语言的功能

更完整的说明详见[`动态加载语言包`](../advanced/dynamic-add)和[`语言包补丁`](../advanced/lang-patch)功能介绍。


 