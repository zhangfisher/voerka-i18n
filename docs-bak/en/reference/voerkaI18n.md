# VoerkaI18n

The global singleton `VoerkaI18n` is automatically created at `import { i18nScope} form "./languages"` that time.


```javascript | pure
// 订阅语言切换事件
VoerkaI18n.on((newLanguage)=>{...})
// 取消语言切换事件订阅
VoerkaI18n.off(callback)
// 取消所有语言切换事件订阅
VoerkaI18n.offAll()
                              
// 返回当前默认语言
VoerkaI18n.defaultLanguage
// 返回当前激活语言
VoerkaI18n.activeLanguage
// 返回当前支持的语言
VoerkaI18n.languages                              
// 切换语言
await VoerkaI18n.change(newLanguage)
// 返回全局格式化器
VoerkaI18n.formatters                              
// 注册全局格式化器
VoerkaI18n.registerFormatter(name,formatter,{language:"*"})                              
                              
```