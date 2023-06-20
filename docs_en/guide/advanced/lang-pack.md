# Language Pack <!-- {docsify-ignore-all} -->

When using `webpack`, `rollup`, `esbuild` to package the project, the default language pack is statically loaded and will be packaged into the source code, while other languages are packaged asynchronously. In `languages/index.js`.

```javascript
const defaultMessages =  require("./zh.js")   
// 语言作用域
const scope = new i18nScope({
    // 以下为每一种语言生成一个异步打包语句
    messages:{ 
        'zh' :  defaultMessages,
        "en" : ()=>import("./en.js") 
        "de" : ()=>import("./de.js") 
        "jp" : ()=>import("./jp.js") 
    }
})
```

Leverage asynchronous packaging to avoid statically packaging multiple languages into a source package.