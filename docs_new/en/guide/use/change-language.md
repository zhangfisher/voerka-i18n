# Change languages <!-- {docsify-ignore-all} -->

## Change languages

You can switch languages by global singletons or by the method of the current scope instance `change`.

```javascript
import { i18nScope } from "./languages"

// change to english
await i18nScope.change("en")
// or 
await VoerkaI18n.change("en")
```

## Listen for language change event

```javascript
import { i18nScope } from "./languages"

// change to english
i18nScope.on("change",(newLanguage)=>{
    ...
})
// Or
VoerkaI18n.on("change",(newLanguage)=>{
    ...
})
```