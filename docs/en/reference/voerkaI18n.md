# VoerkaI18n

When you `import { i18nScope } from "./languages"`, a global singleton `VoerkaI18n` will be automatically created.

```javascript | pure
// Subscribe to language change events
VoerkaI18n.on((newLanguage)=>{...})
// Unsubscribe from language change events
VoerkaI18n.off(callback)
// Unsubscribe from all language change events
VoerkaI18n.offAll()
                              
// Return current default language
VoerkaI18n.defaultLanguage
// Return current active language
VoerkaI18n.activeLanguage
// Return currently supported languages
VoerkaI18n.languages                              
// Switch language
await VoerkaI18n.change(newLanguage)
// Return global formatters
VoerkaI18n.formatters                              
// Register global formatter
VoerkaI18n.registerFormatter(name,formatter,{language:"*"})                              
```
