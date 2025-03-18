# 语言包

## 异步加载 

当使用`webpack`、`rollup`、`esbuild`进行项目打包时，默认语言包采用静态加载，会被打包进行源码中，而其他语言则采用异步打包方式。在`languages/index.{ts|js}`中。

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

- 利用异步打包机制,从而避免将多个语言静态打包到源码包,减少应用的打包体积。
- 一般情况下，我们会将**默认语言包**静态打包到源码中，而其他语言包采用异步加载方式。

## 等待加载

以上代码中，我们使用了`import`函数来加载语言包，但是这样会导致在加载语言包时，会有一段时间的等待。为了避免这种情况，我们可以在`ready`函数中加载应用。

```ts {2-4}
import { i18nScope } from "./languages"
i18nScope.ready(()={
    // 在此处加载应用   
})
```

以`Vue`为例，我们可以在`main.ts`中加载应用。

```ts {2,7}
import { i18nPlugin } from '@voerkai18n/vue' 
i18nScope.ready(()=>{
    createApp(App)
        .use(i18nPlugin,{})
        .use(router)
        .mount('#app')
})
```


## 优化缓存

如果应用的默认语言(`defaultLanguage`)是`zh-CN`，但是激活语言(`activeLanguage`)是`en-US`,但是由于默认语言包是静态加载的,而是`en-US`是异步加载的，这样会导致应用在加载`en-US`语言包时，会有一段时间的等待。

因此，在部署时，建议利用`HTML 5`的应用缓存机制来优化异步语言包的加载。

我们可能将所有异步语言包加入到了HTML5应用程序缓存清单文件(`Manifest File`)中,如下：


```ts {2-4}

CACHE MANIFEST
# Version 1.1

// 在此加入异步语言包文件对应的chunk文件

```

这样，当用户访问应用时，浏览器会自动下载所有异步语言包文件进行缓存，从而避免了在加载异步语言包时的等待。

:::warning 提示
`HTML 5`的应用缓存机制，需要在服务器端进行配置。请参考[HTML 5 Application Cache](https://en.wikipedia.org/wiki/Cache_manifest_in_HTML5)。
:::


## 补丁缓存

`VoerkaI18n`也支持补丁缓存机制,默认情况下，会对语言包的补丁文件进行缓存。

```ts
// settings.json
{
    "cachePatch": <true/false>      // [!code ++]    
}
```


