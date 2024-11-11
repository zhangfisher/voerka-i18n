# Events<!-- {docsify-ignore-all} -->

`VoerkaI18n`和`i18nScope``I18nScope provides some events to listen for events such as language switching and language pack loading.

- The `VoerkaI18n` instance inherits from a `LiteEventEmitter` class and can listen for events through the `on`/`off`/`once` methods.
- `I18nScope` references the `on`/`off`/`once` method of the global `VoerkaI18n` instance.

## ready

When the `i18nScope` instance completes the first language switch, the `ready` event will be triggered, which is equivalent to the first `change` event being triggered.

- This method is generally used in applications such as `Vue/React` to wait for the language pack to load before initializing.
- The `ready` event will only be triggered once, and switching languages again will not trigger it again.
- The `ready` event has the `retain` feature, which means that if you subscribe to the `ready` event after it is triggered, you can also listen to the `ready` event.
- The `ready` event was introduced because language packs may be loaded asynchronously. If the `t` function is used before the language pack is loaded, it may lead to inaccurate translation. Therefore, the application can be initialized in the `ready` event.
- `ready` event callback function: `({language, scope})=>void `, where `language` is the current language and `scope` is the current scope `id`.

```typescript
import { i18nScope } from "./languages"

i18nScope.on("ready",({language,scope})=>{
    // The initial language pack has been loaded and can be initialized in applications such as Vue/React here
    const app = createApp(App)
    // 应用插件
    app.use<VoerkaI18nPluginOptions>(i18nPlugin as any,{
        i18nScope
    })
    app.mount('#app')
})
```

## change

When switching languages, the `change` event will be triggered。

When each time the `i18nScope.change` or `VoerkaI18n.change` method is called, `VoekaI18n` will perform a series of operations such as loading and switching language packs, loading remote language patches, storing language parameters, and then triggering the `change` event after completion

```typescript

import { i18nScope } from "./languages"

i18nScope.on("change",(newLanguage)=>{
    // Language switch completed, you can re render the interface here
    // ...
})

```

## registered

When the `scope` is registered to the global `VoerkaI18n` instance, the `registered` event will be triggered。

```typescript

i18nScope.on("registered",({language,scope})=>{
    //  Language switch completed, you can re render the interface here
    // ...
})

```

- `registered` event callback function:`({language, scope})=>void`, where `language` is the current language and `scope` is the current scope `id`.
- An application may have multiple `scopes`, each of which triggers a `registered` event.


## restore

Every time a language switch is made (including initialization), `VoerkaI18n` will restore the language patch from storage and trigger the `restore` event.

```typescript

i18nScope.on("restore",({language,scope})=>{
    // Restore language patch from storage complete
    // ...
})

```

## patched

Every time a language switch is made (including initialization), `VoerkaI18n` will remotely load the language patch on the server and trigger the `patched` event

```typescript

i18nScope.on("patched",({language,scope})=>{
    //  Remote language patch loaded complete
    // ...
})

```


