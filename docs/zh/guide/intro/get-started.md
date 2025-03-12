# 快速入门

`VoerkaI18n`是一个通用的面向`Javascript/Typescript`的国陨化框架，支持`Vue`、`React`、`Svelte`、`Nextjs`等主流框架。

本节以标准的`Nodejs js`应用程序为例，简要介绍`VoerkaI18n`国际化框架的基本使用。

<lite-tree>
myapp
  package.json
  src/
    index.js
</lite-tree>

> 上述树组件基于[Lite-Tree](https://zhangfisher.github.io/lite-tree/)构建。

在本项目的所有支持的源码文件中均可以使用`t`函数对要翻译的文本进行包装。

```javascript 
// index.js
console.log(t("中华人民共和国万岁"))
console.log(t("中华人民共和国成立于{}",1949))
```

`t`翻译函数是从`myapp/languages/index.js`文件导出的翻译函数，但是现在`myapp/languages`还不存在，后续会使用工具自动生成。`voerkai18n`后续会使用正则表达式对提取要翻译的文本。

## 第一步：安装命令行工具

安装`@voerkai18n/cli`到全局，提供`voerkai18n`命令。

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

`voerkai18n init`命令会提供一个交互式的命令行界面，用来初始化多语言环境。

当初始化完成后，会创建创建一个语言工作目录，默认位置是`src/languages`。

该语言目录结构大致如下：

<lite-tree>
myapp
    src
        languages
            api.json
            component.js           // 翻译组件
            index.js                //! 入口文件        
            messages/             
            paragraphs/
            prompts/        
            settings.json
            storage.js
            translates/           // 提取需要翻译的内容
    package.json
    index.js    
</lite-tree>

 
:::warning 提示
更多的`voerkai18n init`命令的使用请查阅[这里](../tools/cli.md)
:::

##  第三步：标识翻译内容

接下来在源码文件中，将所有需要翻译的内容使用`t`翻译函数进行包装，如下：

```javascript 
import { t } from "./languages"
// 不含插值变量
t("中华人民共和国")
// 位置插值变量
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",[1949,"北京"])

```

- `t`翻译函数只是一个普通函数，您需要为之提供执行环境，关于`t`翻译函数的更多用法见[这里](../use/t.md)

##  第四步：提取文本

接下来我们使用`voerkai18n extract`命令来自动扫描工程源码文件中的需要的翻译的文本信息。
`voerkai18n extract`命令会使用正则表达式来提取`t("提取文本")`包装的文本。

```shell
myapp>voerkai18n extract
```

`voerkai18n extract`命令的作用就是提取所有需要翻译的内容，保存到`myapp/languages/translates/messages/default.json`。

- **translates/messages/default.json** ： 
    该文件就是从当前工程扫描提取出来的需要进行翻译的文本信息。所有需要翻译的文本内容均会收集到该文件中。
 
最后文件结构如下：
<lite-tree>
myapp
    src
        languages
            api.json
            component.js           // 翻译组件
            index.js                //! 入口文件        
            messages/             
            paragraphs/
            prompts/        
            settings.json
            storage.js
            translates/           // 提取需要翻译的内容
                messages
                    default.json      //! 需要翻译的内容提取到这里
    package.json
    index.js    
</lite-tree> 
 
## 第五步：人工翻译

接下来就可以分别对`languages/translates/messages`文件夹下的所有`JSON`文件进行翻译了。每个`JSON`文件大概如下：

```json
{
    "欢迎使用VoerkaI18n":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>",
        "jp":"<在此编写对应的日文翻译内容>",
        "$files":["index.js"],    // 记录了该信息是从哪几个文件中提取的
        "$id":1
    },
	"VoerkaI18n是一款非常棒的国际化解决方案":{
        "en":"<在此编写对应的英文翻译内容>",
        "de":"<在此编写对应的德文翻译内容>",
        "jp":"<在此编写对应的日文翻译内容>",
        "$files":["index.js"],
        "$id":2
    }
}
```

我们只需要修改该文件翻译对应的语言即可。

:::warning 提示

如果翻译期间对源文件进行了修改，则只需要重新执行一下`voerkai18n extract`命令,`VoerkaI18n`会自动合并新的翻译内容到`translates/messages`文件夹下的`JSON`文件中。
**反复执行`voerkai18n extract`命令是安全的，不会导致进行了一半的翻译内容丢失，可以放心执行。**
:::


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


 