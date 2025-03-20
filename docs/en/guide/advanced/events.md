# Events

`VoerkaI18n` and `i18nScope` provide several events to listen for language switching, language pack loading, and other events.

- The `VoerkaI18n` instance inherits from a `LiteEventEmitter` class and can listen for events using the `on`/`off`/`once` methods.
- `i18nScope` references the global `VoerkaI18n` instance's `on`/`off`/`once` methods.

## ready

The `ready` event is triggered when the `i18nScope` instance completes its first language switch, equivalent to the first `change` event.

- This method is typically used in applications like `Vue/React` to wait for language pack loading completion before initialization.
- The `ready` event is only triggered once; subsequent language switches will not trigger it.
- The `ready` event has a `retain` feature, meaning that if you subscribe to the `ready` event after it has been triggered, you can still receive the `ready` event.
- The `ready` event is introduced because language packs might be loaded asynchronously. If you start using the `t` function before the language pack is loaded, translations might be inaccurate. Therefore, you can initialize your application in the `ready` event.
- `ready` event callback function: `({language,scope})=>void`, where `language` is the current language and `scope` is the current scope `id`.

```typescript
import { i18nScope } from "./languages"

i18nScope.on("ready",({language,scope})=>{    
    const app = createApp(App)    
    app.mount('#app')
})
```

You can also use the shorthand:

```typescript
import { i18nScope } from "./languages"

i18nScope.ready(()=>{    
    const app = createApp(App)    
    app.mount('#app')
})
```

## change

The `change` event is triggered when switching languages.

When calling `i18nScope.change` or `VoerkaI18n.change` method, `VoerkaI18n` performs a series of operations including language pack loading and switching, loading remote language patches, storing language parameters, etc., and then triggers the `change` event upon completion.

```typescript
import { i18nScope } from "./languages"

i18nScope.on("change",(newLanguage)=>{
    // Language switch completed, you can re-render the interface here
    // ...
})
```

## restore

Every time the language is switched (including during initialization), `VoerkaI18n` restores language patches from storage and then triggers the `restore` event.

```typescript
i18nScope.on("restore",({language,scope})=>{
    // Language patch restoration from storage completed
    // ...
})
```

## patched

Every time the language is switched (including during initialization), `VoerkaI18n` loads language patches from the remote server and then triggers the `patched` event.

```typescript
i18nScope.on("patched",({language,scope})=>{
    // Language patch loading from remote server completed
    // ...
})
```

## Supported Events

```ts
export type VoerkaI18nEvents = {
    // When there is log output
    log             : { level: string, message:string }                  
    // When the first application Scope is registered
    init            : ()=>string                                             
    // When initial switch is completed
    ready           : string                                             
    // When language is switched, payload=language
    change          : string                                             
    // When Scope loads and merges language pack from local storage, data={language,scope}
    restore         : { scope:string,language:string }                   
    // When Scope loads and merges language pack from local storage, data={language,scope}    
    patched         : { scope:string,language:string }                   
    // When an error occurs    
    error           : Error                                              
    "scope/change"  : { scope:string,language:string }                   
    // When switching to an invalid language or load fails, fallback occurs
    "scope/fallback": { scope:string,from:string,to:string}             
} 
```
