# Switch languages <!-- {docsify-ignore-all} -->

## Switch languages

You can switch languages by global singletons or by the method of the current scope instance `change`.

```javascript
import { i18nScope } from "./languages"

// 切换到英文
await i18nScope.change("en")
// VoerkaI18n是一个全局单例，可以直接访问
await VoerkaI18n.change("en")
```

## Listen for language switch event

```javascript
import { i18nScope } from "./languages"

// 切换到英文
i18nScope.on("change",(newLanguage)=>{
    ...
})
// 直接在全局单例上调用
VoerkaI18n.on("change",(newLanguage)=>{
    ...
})
```