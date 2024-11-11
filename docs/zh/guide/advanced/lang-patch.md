# 语言包补丁

在实际应用中，我们经常会在应用上线后，有没有经常碰到这样的问题：
- 发现应用中的翻译错误
- 不同的客户可能会一些用词提出不同的要求
- 甚至有些客户要求能自定义一些显示用语

一般解决方案是重新打包应用重新发布，显然这是比较麻烦的解决方案。

`voerkai18n`的语言包补丁特性针对此问题，提供了完美的解决方案,您就可以随时修复翻译错误，而不需要重新打包应用。

**基本思路:应用上线后发现翻译错误时，可以在服务器上约定位置放置语言包补丁，应用会自动进行更新修复，很实用的一个特性。**

## 指南


### 准备
为说明如何使用`语言包补丁`特性支持，我们将假设以下的应用：
应用`chat`，依赖于`user`、`manager`、`log`等三个库，均使用了`voerkiai18n`作为多语言解决方案。
其拟支持`zh`、`en`、`de`共三种语言。
当执行完`voerkai18n compile`后，项目结构大概如下：

<Tree>
chat
    languages
        index.js
        idMap.js   
        runtime.js
        settings.json                  
        zh.js
        en.js
        formatters
            zh.js
            en.js
        translates
            default.json
    index.js
    package.json                  // name=chat
<Tree>

打开`languages/index.js`,大概如下:
```javascript
// ....
const scope = new i18nScope({
    id: "chat",                          // 当前作用域的id，自动取当前工程的package.json的name
    messages:{ 
        "en" : ()=>import("./en.js"),
        "de" : ()=>import("./de.js")
    },
    //.....
}) 
/// ....
```
- 可以看到在`languages/index.js`中创建了一个以当前工程`package.json`的`name`为`id`的`i18nScope`实例，其会自动注册到全局`voerkaI18n`实例中。

### 第一步：注册默认的语言加载器

 `voerkiai18n`是采用语言加载器来加载语言包的，为了从服务器上远程加载语言包补丁，需要注册一个加载器。
 
需要在应用中(例如`app.js`或`main.js`等)导入`i18nScope`实例或者直接在`languages/index.js`中并注册一个默认的语言加载器。

```javascript

// 从当前工程导入`scope`实例
import { i18nScope } from "./languages"

// 注册默认的语言加载器
// 在此向服务器发起请求，请返回翻译后的其他语言文本
i18nScope.registerDefaultLoader(async (language,scope)=>{
    // language: 要切换到此语言
    // scope: 语言作用域实例   
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```


### 第二步：编写语言包补丁文件

假设我们发现`zh`语言的翻译错误，这就需要在服务器上生成一个对应的`zh`语言包补丁文件。
方法很简单，打开`languages/zh.js`文件，该文件大概如下：
```javascript
module.exports = {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
复制一份修改和更名为`zh.json`，其中仅保留需要修复的条目，内容大概如下：
```javascript
{
    "1": "支持的语言",       
}
```
然后将`zh.json`复制到`languages/chat/zh.json`即可。
同样地，我们如果要修复`user`、`manager`、`log`等三个库的翻译错误，如法泡制，生成语言包文件`languages/user/de.json`,`languages/manager/de.json`,`languages/log/de.json`。

### 第三步：组织语言包补丁文件
在上面中，我们通过`fetch(/languages/${scope.id}/${language}.json)`来读取语言包（您可以使用任意您喜欢的方式,如`axios`），这意味着我们需要在web服务器上根据此`URL`来组织语言包补丁，以便可以下载到语言包补丁。需要将语言包补丁保存在服务器的指定位置，如下：

<Tree>
webroot
    languages
        chat          
            de.json        
        user               
            de.json    
        manager
            de.json   
        log                 
            de.json               
</Tree>

### 完成：自动打语言包补丁

至此，语言包补丁功能已配置完毕。当应用启动时就会自动加载该补丁合并到线上应用的语言包中。
 ## 说明

- 语言包补丁仅对在`settings.json`配置的语言起作用
- 语言包补丁会在加载时自动合并到源码中的语言包，并且会自动在本地`localStorage`中缓存，这样就能避免滞后更新的问题。
- 如何从服务器加载语言包以及语言包补丁放在服务器上的哪里完全是由开发者决定。

