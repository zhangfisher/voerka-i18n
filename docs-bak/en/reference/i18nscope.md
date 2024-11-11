# i18nScope

Each project creates an `i18nScope` instance and automatically registers with the global singleton `VoerkaI18n`.
- In a multi-package project, each package typically creates its own `i18nScope` instance.
- When a third-party library also uses voerkai18n as a multilingual solution, its own `i18nScope` instance is also created when the library is introduced


```javascript | pure
import { i18nScope } from "./languages"

// 订阅语言切换事件
i18nScope.on((newLanguage)=>{...})
// 取消语言切换事件订阅
i18nScope.off(callback)
// 当前语言作用域配置
i18nScope.settings
// 当前语言名称
i18nScope.activeLanguage         // 如zh
// 默认语言名称
i18nScope.defaultLanguage         
// 返回当前支持的语言列表，可以用来显示
i18nScope.languages    // [{name:"zh",title:"中文"},{name:"en",title:"英文"},...]
// 返回当前作用域的格式化器                         
i18nScope.formatters   
// 当前作用id
i18nScope.id
// 切换语言，异步函数
await i18nScope.change(newLanguage)
// 当前语言包                         
i18nScope.messages        // {1:"...",2:"...","3":"..."}
// 引用全局VoerkaI18n实例                         
i18nScope.global
// 注册当前作用域格式化器
i18nScope.registerFormatter(name,formatter,{language:"*"})      
// 注册默认的语言包加载器
i18nScope.registerDefaultLoader(async function(language,scope){....})
```

|Member| 类型 | 说明 |
| --- |--- |--- |
