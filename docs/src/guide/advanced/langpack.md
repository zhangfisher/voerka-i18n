# 语言包

当使用`webpack`、`rollup`、`esbuild`进行项目打包时，默认语言包采用静态加载，会被打包进行源码中，而其他语言则采用异步打包方式。在`languages/index.js`中。

```javascript | pure
const defaultMessages =  require("./zh.js")  
const activeMessages = defaultMessages
  
// 语言作用域
const scope = new i18nScope({
    default:   defaultMessages,                 // 默认语言包
    messages : activeMessages,                  // 当前语言包
    ....
    // 以下为每一种语言生成一个异步打包语句
    loaders:{ 
        "en" : ()=>import("./en.js") 
        "de" : ()=>import("./de.js") 
        "jp" : ()=>import("./jp.js") 
    })
```

利用异步打包机制，从而避免将多个语言静态打包到源码包。