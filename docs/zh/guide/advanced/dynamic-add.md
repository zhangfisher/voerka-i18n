# 动态增加语言支持

## 前言
`voerkaI18n`默认将要翻译的文本内容经编译后保存在当`languages`文件夹下,当打包应用时会与工程一起进行打包进工程源码中。这会带来以下问题：
- 翻译语言包是源码工程的一部分，当要翻译的语种较多时，会增加源码包大小。
- 如果产品上线后发现翻译问题，则需要重新进行整个工程的打包
- 上线后要增加一种语言，同样需要再次进行走一次打包流程

`voerkaI18n`针对这些问题，支持了远程加载语言包的功能，可以支持线上`动态增加支持语种`，`语言包在线补丁`等特性。


## 使用方法

### 第1步：准备

为说明如何利用远程加载语言包的机制为应用动态增加语言支持，我们将假设以下的应用：
应用`chat`，依赖于`user`、`manager`、`log`等三个库，均使用了`voerkiai18n`作为多语言解决方案
当执行完`voerkai18n compile`后，项目结构大概如下：

<Tree>
chat
    languages
        + translates
            messages
                default.json
            paragraphs/
        messages
            zh-CN.ts
            en-US.ts
            idMap.json
        loader.ts
        index.ts
        settings.json                  
  index.js
  package.json      // name=chat
</Tree>


打开`languages/index.ts`,大概如下:

```ts
import { VoerkaI18nScope } from "@voerkai18n/runtime"
import storage  from "./storage"
import formatters from "@voerkai18n/formatters"
import idMap from "./messages/idMap.json"
import { component,type TranslateComponentType } from "./component"
import paragraphs from "./paragraphs"
import settings from "./settings.json"
import defaultMessages from "./messages/zh-CN"  

const messages = { 
    'zh-CN'    : defaultMessages,
    'en-US'    : ()=>import("./messages/en-US"), 
}

export const i18nScope = new VoerkaI18nScope<TranslateComponentType>({    
    id: "chat_1_0_0",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    ...settings
}) 
export const t = i18nScope.t
export const Translate = i18nScope.Translate
```


- 当打包`chat`应用时，`zh.js`、`en.js`等语言包均作为源码的一部分打包，差别在于非默认语言`en-US.ts`单独作为一个`chunk`打包以便能异步加载。

**下面假设**，当应用上线后，客户要求增加`de`语言，但是我们的源码包中并没有包含`de`语言，利用`voerkiai18n`语言加载器功能，可以比较方便地实现`动态增加语种`的功能。

### 第2步：修改语言加载器

`voerkiai18n`是采用`loader.ts`来从服务器加载语言包。

`languages/loader.ts`负责从服务器加载语言包。

<Tree>
chat
    languages
        + translates
            messages
                default.json
            paragraphs/
        messages
            zh-CN.ts
            en-US.ts
            idMap.json
        loader.ts            //! 语言加载器
        index.ts
        settings.json                  
  index.js
  package.json      // name=chat
</Tree>

修改`languages/loader.ts`文件内容，大概如下：

```ts
export const loader = async (language:string,scope:VoerkaI18nScope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
}
```

`loader`函数需要返回JSON格式的语言包，大概如下：

```json
{
    "1":"xxxxx",
    "2":"xxxxx",
    "3":"xxxxx",
    //....
}
```

### 第3步：将语言包文件保存在服务器

在上一步中，我们通过`fetch(/languages/${scope.id}/${language}.json)`来传递读取语言包（您可以使用任意您喜欢的方式,如`axios`），这意味着我们需要在web服务器上根据此`URL`来组织语言包，以便可以下载到语言包。比如可以这样组织：

<Tree>
webroot
    languages
        chat          //!
            de.json        
        user          //!     
            de.json    
        manager       //!  
            de.json   
        log           //!      
            de.json               
</Tree>

`voerkaI18n`将编写**如何语言加载器**和**如何在服务器上组织语言包**交由开发者自行决定，您完全可以根据自己的喜好来决定如何组织语言包在服务器的位置以及如何加载，你甚至可以采用数据库来保存语言包，然后为之编写编辑界面，让用户可以自行修改。


### 第四步：生成语言包文件

在本例中，我们要增加`de`语言，这就需要在服务器上生成一个对应的`de`语言包文件。

方法很简单，打开`languages/messages/zh-CN.ts`文件，该文件大概如下：

```ts
export default {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
复制一份修改和更名为`de.json`，内容大概概如下：

```ts
export default {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
然后将`de.json`复制到`languages/chat/de.json`即可。
同样地，我们也需要对`user`、`manager`、`log`等三个库的语言文件如法泡制，生成语言包文件`languages/user/de.json`,`languages/manager/de.json`,`languages/log/de.json`,这样这三个库也能实现扩展支持`de`语言。

 
### 小结

 - `languages/loader.{ts|js}`负责从服务器加载语言包
 - 需要自己在服务器上组织存放配套的语言包文件，然后编写通过`fetch/axios`等从服务器加载
 

## 指南

### 语言包加载器

`languages/loader.{ts|js}`是一个普通`异步函数`或者`返回Promise`的函数，可以用来从远程加载语言包文件。

语言加载器时会传入两个参数：

| 参数 | 说明 |
| --- | --- |
| **language** | 要切换的此语言|
| **scope** |语言作用域实例,其中`scope.id`值默认等于`package.json`中的`name`字段。详见[参考](../../reference/i18nscope)。 |
 

- 为什么要应用自己编写语言加载器,而不是提供开箱即用的功能？
  主要原因是编写语言加载器很简单，只是简单地使用HTTP从服务器上读取JSON语言包文件，不存在任何难度，甚至您可以直接使用上面的例子即可。
  而关键是语言包在服务器上的如何组织与保存，可以让应用开发者自行决定。比如，开发者完全可以将语言包保存在数据库表中，以便能扩展其他功能。另外考虑安全、兼容性等原因，因此`voerkaI18n`就将此交由开发者自行编写。
  

### 编写语言切换界面

当编写语言切换界面时，对未注册的语言是无法枚举出来的，需要应用自行处理逻辑。例如在Vue应用中

```javascript
   	<div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
			{{ lng.title }}        
	    </button>
    </div>
```

还是以本例来说明，上面的Vue应用是无法枚举出来`de`语言的，因为这是在开发阶段时未定义的。

我们需要UI做简单的扩展，以便能在未来动态添加语种时能进行切换，比如：

```html
<template> 
    <div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
            {{ lng.title }}        
        </button>
        <!-- 预期要支持的语言 -->
        <button  @click="i18n.activeLanguage=lng.name" 
            v-for="lng of ['de','jp',.......]">
            {{ lng }} 
        </button>
    </div>
</template>
```

通过编写合适的语言切换界面，您可以在后期随时在线增加语种支持。

### `scope.id`参数

**重点：为什么要向服务器传递`scope.id`参数？** 
在多包环境下，按照多包/库开发的规范，每一个库或包均具有一个**唯一的id**,默认会使用`package.json`中的`name`字段。

**例如**：
- 应用`A`，依赖于包/库`X`、`Y`、`Z`，并且`A/X/Y/Z`均使用了`voerkiai18n`作为多语言解决方案
- 当应用启动时，`A/X/Y/Z`均会创建一个`i18nScope`实例，其`id`分别是`A/X/Y/Z`，然后这些`i18nScope`实例会注册到全局的`voerkaI18n`实例中（详见多库联动介绍）。
- 假如应用`A`配置支持`zh`、`en`两种语言,当应用要切换到`de`语言时，那么不仅是`A`应用本身需要切换到`de`语言,所依赖的库也需要切换到`de`语言。但是库`X`、`Y`、`Z`本身可能支持`de`语言，也可能不支持。如果不支持，则同样需要向服务器请求该库的翻译语言。因此，在向服务器请求时就需要带上`scope.id`,这样服务器就可以分别为应用`A`和依赖库`X`、`Y`、`Z`均准备对应的语言包了。

**按此机制，如果您的应用使用了任何第三方库，只要第三方库也是使用voerkai18n作为多语言解决方案，那么不需要原开发者支持，您自已就可以为之`增加语言支持`或者`打语言包补丁`。**


### 缓存语言包

当切换到动态增加的语言时会从远程服务器加载语言包，取决于语言包的大小，可能会产生延迟，这可能对用户体验造成不良影响。因此，您可以在客户端对语言包进行缓存。




