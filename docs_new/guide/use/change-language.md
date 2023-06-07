# 切换语言<!-- {docsify-ignore-all} -->

## 切换语言

可以通过全局单例或当前作用域实例的`change`方法来切换语言。

```javascript | pure
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// VoerkaI18n是一个全局单例，可以直接访问
await VoerkaI18n.change("en")
```

## 侦听语言切换事件

```javascript | pure
import { i18nScope } from "./languages"

// 切换到英文
i18nScope.on((newLanguage)=>{
    ...
})
// 直接在全局单例上调用
VoerkaI18n.on((newLanguage)=>{
    ...
})
```