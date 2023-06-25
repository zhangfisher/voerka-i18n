# 事件<!-- {docsify-ignore-all} -->

`VoerkaI18n`和`i18nScope`提供了一些事件来侦听语言切换、语言包加载等事件。

- `VoerkaI18n`实例继承自一个`LiteEventEmitter`类，可以通过`on`/`off`/`once`方法来侦听事件。
- `i18nScope`引用了全局`VoerkaI18n`实例的`on`/`off`/`once`方法

## ready

当`i18nScope`实例完成第一次语言切换时会触发`ready`事件，相当于第一次触发`change`事件。

- 此方法一般用在`Vue/React`等应用中，用来等待语言包加载完成再进行初始化。
- `ready`事件只会触发一次，之后再次切换语言不会再触发。
- `ready`事件具备`retain`特性，即如果在`ready`事件触发后再订阅了`ready`事件，也可以侦听到`ready`事件。
- 引入`ready`事件是因为语言包可能是异步加载的，如果在语言包加载完成前就开始使用`t`函数，可能会导致翻译不准确。因此，可以在`ready`事件中初始化应用。
- `ready`事件回调函数：`({language,scope})=>void`，其中`language`是当前语言，`scope`是当前作用域`id`。

```typescript
import { i18nScope } from "./languages"

i18nScope.on("ready",({language,scope})=>{
    // 初始语言包加载完成，可以在此初始化`Vue/React`等应用中
    // 在Vue3中可以在此初始化Vue应用
    const app = createApp(App)
    // 应用插件
    app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
        i18nScope
    })
    app.mount('#app')
})
```

## change

当切换语言时会触发`change`事件。

当每次调用`i18nScope.change`或`VoerkaI18n.change`方法时，`VoekaI18n`会进行语言包加载和切换，加载远程语言补丁，存储语言参数等一系列操作，然后完成后再触发`change`事件。

```typescript

import { i18nScope } from "./languages"

i18nScope.on("change",(newLanguage)=>{
    // 语言切换完成，可以在此重新渲染界面
    // ...
})

```

## registered

当`scope`注册到全局`VoerkaI18n`实例时会触发`registered`事件。

```typescript

i18nScope.on("registered",({language,scope})=>{
    // 语言切换完成，可以在此重新渲染界面
    // ...
})

```

- `registered`事件回调函数：`({language,scope})=>void`，其中`language`是当前语言，`scope`是当前作用域`id`。
- 一个应用可能会有多个`scope`，每个`scope`都会触发`registered`事件。


## restore

每次切换语言（包括初始化时），`VoerkaI18n`均会从存储中恢复语言补丁，然后触发`restore`事件。

```typescript

i18nScope.on("restore",({language,scope})=>{
    // 从存储中恢复语言补丁完成
    // ...
})

```

## patched

每次切换语言（包括初始化时），`VoerkaI18n`均会远程服务器加载语言补丁，然后触发`patched`事件。

```typescript

i18nScope.on("patched",({language,scope})=>{
    // 从存储中恢复语言补丁完成
    // ...
})

```


