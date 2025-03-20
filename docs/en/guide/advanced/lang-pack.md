# Language Packs

## Asynchronous Loading

When using `webpack`, `rollup`, or `esbuild` for project bundling, the default language pack is loaded statically and will be bundled into the source code, while other languages use asynchronous bundling. In `languages/index.{ts|js}`:

```ts
import defaultMessages from "./zh-CN"

const i18nScope = new VoerkaI18nScope({
    messages:{ 
        'zh-CN' :  defaultMessages,
        "en-US" : ()=>import("./messages/en-US") 
        "de-DE" : ()=>import("./messages/de-DE") 
        "ja-JP" : ()=>import("./messages/ja-JP") 
    }
})
```

- Using the asynchronous bundling mechanism avoids statically bundling multiple languages into the source package, reducing the application bundle size.
- Generally, we statically bundle the **default language pack** into the source code, while other language packs are loaded asynchronously.

## Waiting for Loading

In the code above, we use the `import` function to load language packs, but this will result in a waiting period during language pack loading. To avoid this situation, we can load the application in the `ready` function.

```ts {2-4}
import { i18nScope } from "./languages"
i18nScope.ready(()={
    // Load application here   
})
```

Taking `Vue` as an example, we can load the application in `main.ts`.

```ts {2,7}
import { i18nPlugin } from '@voerkai18n/vue' 
i18nScope.ready(()=>{
    createApp(App)
        .use(i18nPlugin,{})
        .use(router)
        .mount('#app')
})
```

## Cache Optimization

If the application's default language (`defaultLanguage`) is `zh-CN`, but the active language (`activeLanguage`) is `en-US`, since the default language pack is loaded statically while `en-US` is loaded asynchronously, this will result in a waiting period when loading the `en-US` language pack.

Therefore, during deployment, it's recommended to use the `HTML 5` application cache mechanism to optimize asynchronous language pack loading.

We can add all asynchronous language packs to the HTML5 application cache manifest file (`Manifest File`), as follows:

```ts {2-4}
CACHE MANIFEST
# Version 1.1

// Add chunk files corresponding to asynchronous language packs here
```

This way, when users access the application, the browser will automatically download and cache all asynchronous language pack files, avoiding waiting during asynchronous language pack loading.

:::warning Note
The `HTML 5` application cache mechanism needs to be configured on the server side. Please refer to [HTML 5 Application Cache](https://en.wikipedia.org/wiki/Cache_manifest_in_HTML5).
:::

## Patch Caching

`VoerkaI18n` also supports a patch caching mechanism. By default, it caches language pack patch files.

```ts
// settings.json
{
    "cachePatch": <true/false>      // [!code ++]    
}
```
