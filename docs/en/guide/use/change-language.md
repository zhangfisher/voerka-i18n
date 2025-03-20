# Switching Languages

## Change Language

You can switch languages using the `change` method from either the global singleton or the current scope instance.

```javascript
import { i18nScope } from "./languages"

// Switch to English
await i18nScope.change("en")
// VoerkaI18n is a global singleton, can be accessed directly
await VoerkaI18n.change("en")
```

## Listen to Language Change Events

```javascript
import { i18nScope } from "./languages"

// Switch to English
i18nScope.on("change",(newLanguage)=>{
    ...
})
// Call directly on the global singleton
VoerkaI18n.on("change",(newLanguage)=>{
    ...
})
```
