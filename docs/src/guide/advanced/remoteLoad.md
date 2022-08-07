# 远程加载语言包

## 前言
`voerkaI18n`默认将要翻译的文本内容经编译后保存在当`languages`文件夹下,当打包应用时会与工程一起进行打包进工程源码中。这会带来以下问题：
- 翻译语言包是源码工程的一部分，当要翻译的语种较多时，会增加源码包大小。
- 如果产品上线后发现翻译问题，则需要重新进行整个工程的打包
- 上线后要增加一种语言，同样需要再次进行走一次打包流程

`voerkaI18n`针对这些问题，支持了远程加载语言包的功能，可以支持线上`动态增加支持语种`，`语言包在线补丁`等特性。


## 使用方法

### 准备

为说明如何从远程加载语言包，我们将假设以下的应用：
应用`chat`，依赖于`user`、`manager`、`log`等三个库，均使用了`voerkiai18n`作为多语言解决方案
当执行完`voerkai18n compile`后，项目结构大概如下：
```javascript | pure
chat
  |-- languages
  | |-- index.js
  | |-- idMap.js   
  | |-- runtime.js
  | |-- settings.json                  
  | |-- cn.js
  | |-- en.js
  |    |-- translates
  |       |-- default.json
  |-- index.js
  |-- package.json                  //name=chat

```
打开`languages/index.js`,大概如下:
```javascript | pure
// ....
const scope = new i18nScope({
    id: "chat",                          // 当前作用域的id，自动取当前工程的package.json的name
    loaders:{ 
        "en" : ()=>import("./en.js")
    },
    //.....
}) 
/// ....
```
- 可以看到在`languages/index.js`中创建了一个以当前工程`package.json`的`name`为`id`的`i18nScope`实例，其会自动注册到全局`voerkaI18n`实例中。
- 为`en`语言创建了一个异步加载器，用来异步加载`en`语言包。
- 当打包`chat`应用时，`zh.js`、`en.js`等语言包均作为源码的一部分打包，差别在于非默认语言`en.js`单独作为一个`chunk`打包以便能异步加载。

**下面假设**，当应用上线后，客户要求增加`de`语言，但是我们的源码包中并没有包含`de`语言，利用`voerkiai18n`语言加载器功能，可以比较方便地实现`动态增加语种`的功能。

### 第一步：注册默认的语言加载器

 `voerkiai18n`是采用语言加载器来加载语言包的，默认语言包以静态方法打包到源码中，而非默认语言则采用异步加载方式进行加载。 
当注册了一个默认的语言包加载器后,如果切换到一个未注册的语言时，会调用默认的语言包加载器来获取语言包。
利用此特性就可以实现随时动态为应用增加语言支持的特性。

首先需要在应用中(例如`app.js`或`main.js`等)导入`i18nScope`实例，然后注册一个默认的语言加载器。

```javascript | pure

// 从当前工程导入`scope`实例
import { i18nScope } from "./languages"

// 注册默认的语言加载器
i18nScope.registerDefaultLoader(async (language,scope)=>{
    // language: 要切换到此语言
    // scope: 语言作用域实例   
    // 在此向服务器发起请求，请返回翻译后的其他语言文本
    return {.....}
})
```

### 第二步：编写语言包加载器

然后，我们就可以在此向服务器发起异步请求来读取语言包文件。

```javascript | pure

// 从当前工程导入`scope`实例
import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```

语言加载器函数需要返回JSON格式的语言包，大概如下：
```json
{
    "1":"xxxxx",
    "2":"xxxxx",
    "3":"xxxxx",
    //....
}
```

**重点：为什么要向服务器传递`scope.id`参数？** 
在多包环境下，按照多包/库开发的规范，每一个库或包均具有一个**唯一的id**,默认会使用`package.json`中的`name`字段。
  **例如**：
- 应用`A`，依赖于包/库`X`、`Y`、`Z`，并且`A/X/Y/Z`均使用了`voerkiai18n`作为多语言解决方案
- 当应用启动时，`A/X/Y/Z`均会创建一个`i18nScope`实例，其`id`分别是`A/X/Y/Z`，然后这些`i18nScope`实例会注册到全局的`voerkaI18n`实例中（详见多库联动介绍）。
- 假如应用`A`配置支持`zh`、`en`两种语言,当应用要切换到`de`语言时，那么不仅是`A`应用本身需要切换到`de`语言,所依赖的库也需要切换到`de`语言。但是库`X`、`Y`、`Z`本身可能支持`de`语言，也可能不支持。如果不支持，则同样需要向服务器请求该库的翻译语言。因此，在向服务器请求时就需要带上`scope.id`,这样服务器就可以分别为应用`A`和依赖库`X`、`Y`、`Z`均准备对应的语言包了。


### 第三步：将语言包文件保存在服务器

在上一步中，我们通过`fetch(/languages/${scope.id}/${language}.json)`来传递读取语言包（您可以使用任意您喜欢的方式,如`axios`），这意味着我们需要在web服务器上根据此`URL`来组织语言包，以便可以下载到语言包。比如可以这样组织：
```javascript | pure
webroot
  |-- languages
    <chat>          
       |-- de.json        
    <user>               
       |-- de.json    
    <manager>                 
       |-- de.json   
    <log>                 
       |-- de.json               
```

`voerkaI18n`将编写**如何语言加载器**和**如何在服务器上组织语言包**交由开发者自行决定，您完全可以根据自己的喜好来决定如何组织语言包在服务器的位置以及如何加载，你甚至可以采用数据库来保存语言包，然后为之编写编辑界面，让用户可以自行修改。


### 第四步：生成语言包文件

在本例中，我们要增加`de`语言，这就需要在服务器上生成一个对应的`de`语言包文件。
方法很简单，打开`languages/cn.js`文件，该文件大概如下：
```javascript | pure
module.exports = {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
复制一份修改和更名为`de.json`，内容大概概如下：
```javascript | pure
{
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
然后将`de.json`复制到`languages/chat/de.json`即可。
同样地，我们也需要对`user`、`manager`、`log`等三个库的语言文件如法泡制，生成语言包文件`languages/user/de.json`,`languages/manager/de.json`,`languages/log/de.json`,这样这三个库也能实现支持`de`语言。

### 第五步：编写语言包补丁

至此，我们已经实现了可以为应用动态添加语言支持的功能。但是默认语言加载器只是针对的未知的语言起作用，而对内置的语言是不起作用的。也就是说上例中的内置语言`zh`和`en`不能通过此方法来加载。

在实际应用中，我们经常会在应用上线的，发现应用中的某此语言翻译错误，此时就可以利用`voerkaI18n`的语言包补丁特性来解决此问题。
利用`voerkaI18n`的语言包补丁特性,您就可以随时修复翻译错误，而不需要重新打包应用。

`voerkaI18n`的语言包补丁特性的工作机制同样也是利用了默认语言加载器来加载语言包补丁。其工作原理很简单，如下：
- 按上例中的方式注册默认语言加载器
- 当`i18nScope`注册到全局`VoerkaI18n`时，会调用默认的语言加载器,从服务器加载语言包，然后**合并到本地语言包中**，这样就很轻松地实现了为语言包打补丁的功能。

在本例中，我们假设`chat`应用的中文语言发现翻译错误，需要一个语言包补丁来修复，方法如下：
```javascript | pure
webroot
  |-- languages
    <chat>
       |-- zh.json    

```
按上例说明的方式，在服务器上编辑一个`zh.json`文件，保存到`languages/char/zh.json`，里面内容只需要包括出错的内容修复即可，其会自动合并到目标语言包中，整个过程对用户是无感的。

```javascript | pure
{
    "4": "名称空间"
}
```
然后，当应用切换到指定`zh`语言时，就会下载该语言包合并到源码中的语言包，从而实现为语言包打补丁的功能，修复翻译错误。**此功能简单而实用，强烈推荐。**

### 小结

 - 当注册了一个默认的语言加载器后，当切换到未配置过的语言时，会调用默认的文本加载器来从服务器加载语言文本。
 - 对于已配置的语言，会在注册时从服务器加载进行合并，从而实现为语言包打补丁的功能。
 - 您需要自己在服务器上组织存放配套的语言包文件，然后编写通过`fetch/axios`等从服务器加载
 

## 指南

### 语言包加载器

语言加载器是一个普通`异步函数`或者`返回Promise`的函数，可以用来从远程加载语言包文件。

语言加载器时会传入两个参数：
| 参数 | 说明 |
| --- | --- |
| language | 要切换的此语言|
| scope |语言作用域实例,其中`scope.id`值默认等于`package.json`中的`name`字段。详见[参考](../../reference/i18nscope)。 |

- 典型的语言加载器非常简单，如下：
```javascript | pure
import { i18nScope } from "./languages"
i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```
- 为什么要应用自己编写语言加载器,而不是提供约定开箱即用？
  主要原因是编写语言加载器很简单，但是如何组织在服务器上的保存，想让应用开发者自行决定。比如，开发者完全可以将语言包保存在数据库中等。  另外考虑安全、兼容性等原因，因此`voerkaI18n`就将此交由开发者自行编写。
  

### 编写语言切换界面

 当编写语言切换界面时，对未注册的语言是无法枚举出来的，需要应用自行处理逻辑。例如在Vue应用中

```javascript | pure
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

### 关于语言包补丁
语言包补丁仅对在`settings.json`配置的语言起作用，而动态增加的语种因为其语言包本身就保存在服务器，因此就不存在补丁的问题。
语言包补丁会在加载时自动合并到源码中的语言包，并且会自动在本地`localStorage`中缓存。

