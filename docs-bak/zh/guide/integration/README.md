# 框架集成

`voerkai18n`可用应用于绝大多数框架，包括但不限于`Vue`、`React`、`Angular`、`Svelte`等等。要为某个框架或库集成`VoerkaI18n`的功能非常简单，一般需要完成以下几件事：

## 执行`t`翻译函数

翻译本质上是非常简单的查表功能，原则上只需要将所有需要翻译的字符串使用`t`函数包装起来即可。因此，只需要为`t`函数提供执行条件即可。而这是比较容易做到的，没有任何难度。

一般只需要`import { t } from "./languages"`即可直接使用`t`函数，不需要任何配置。`./languages`里面的文件本身就是您项目源码的一部分。

至此，您的应用就具备翻译功能了。

## 自动导入`t`翻译函数

由于需要在所有需要使用`t`翻译函数的文件均需要导入，比较麻烦。为了简化导入工作，`voerkai18n`提供了`babel`、`vite`、`webpack`插件，配置好以后，可以自动扫描源码，如果发现在源码中使用了`t`函数，就自动进行导入。这几个插件基本上涵盖了大部份`Javascrip`工程场景，应用这些插件后，`t`函数就相当于是一个全局函数，可以在项目中直接使用而不必进行导入。

自动导入`t`翻译函数仅是改善编程体验，并不是必须的。

## 动态切换语言

动态切换语言指的是用户在界面上选择其他语言，整个界面自动更新为新的语言，即重新渲染。基本步骤如下：

- **切换语言**

    ```javascript
    import { i18nScope } from "./languages"
    await i18nScope.change("<新语言>")
    // 或者调用全局实例
    VoerkaI18n.change("<新语言>")
    ```

- **响应语言切换事件**

    ```javascript
    import { i18nScope } from "./languages"
    i18nScope.on((newLanguage)=>{...})
    // 或者调用全局
    VoerkaI18n.on((newLanguage)=>{...})
    ```

- **重新渲染界面**

    应用程序可以在侦听到语言切换事件后对整个应用程序进行重新渲染。而这种全局重新渲染各个框架的实现就有所差别，但是总体上并不难。比如在Vue中，可以这样：

    ```javascript
    import { i18nScope } from "./languages"
    i18nScope.on((newLanguage)=>{
         app._instance.update()   // 强制重新渲染
         //......
    })
    ```

## 小结

了解了上述基本原理，为`Vue`、`React`、`Angular`、`Svelte`、`Solid`、`uniapp`、`ReactNative`等应用程序集成`voerkaI18n`就非常容易。 













