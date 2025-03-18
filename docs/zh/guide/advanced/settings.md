# 配置

`VoerkaI18n`的配置分为两种：

- **工作流配置**

为`@voerkai18n/cli`的初始化、提取、翻译、编译等翻译工作流的配置。
一般推荐配置在`package.json`中的`voerkai18n`字段中。如下：

```json
{
  "voerkai18n": {
    "entry": "src",
    "namespaces": {
      "default": "messages"
    },
    "patterns": [
      "!**/*.ts"   
    ]
  }
}
```

- **运行时配置**

构建`VoerkaI18nScope`实例的配置参数，一般推荐配置在:

- `languages/settings.json`
- `languages/index.{ts|js}`

```ts {2,13}
// ....
import settings from "./settings.json" 
export const i18nScope = new VoerkaI18nScope<TranslateComponentType,TransformResultType>({    
    id: "",                                  // 当前作用域的id
    idMap,                                              // 消息id映射列表
    formatters,                                         // 格式化器
    storage,                                            // 语言配置存储器
    messages,                                           // 语言包
    paragraphs,                                         // 段落
    component,                                          // 翻译组件
    loader,                                             // 消息加载器
    transform,                                          // 
    ...settings
})  
```

 
## **工作流配置**

### entry

- 类型: `string`
- 默认值: `src/languages`

默认情况下，语言工作目录是`src/languages`，如果需要更改，可以使用`entry`字段。


### namespaces

- 类型: `Record<string,string>`


命名空间

### patterns

- 类型: `string[]`


配置提取文本的文件匹配清单，使用`glob`匹配规则。

## **运行时配置**


### id

- 类型: `string`
- 默认值: `package.json`中的`name`字段

作用域唯一id，默认情况下`package.json`中的`name`+`version`字段

### attached

- 类型: `boolean`
- 默认值: `false`

是否挂接到appScope


### injectLangAttr

- 类型: `boolean | string`
- 默认值: `false`

是否注入到html元素上注入一个langauge属性指向当前活动语言


### debug

- 类型: `boolean`
- 默认值: `false`

是否开启调试模式，开启后会输出调试信息

### messages

- 类型: `VoerkaI18nLanguageMessagePack`


当前语言包

### paragraphs

- 类型: `VoerkaI18nParagraphs`


段落

### library

- 类型: `boolean`
- 默认值: `false`

当开发库中时应该置为true。

### languages

- 类型: `VoerkaI18nLanguage[]`
- 默认值: `[]`

当前作用域支持的语言列表

```ts
interface VoerkaI18nLanguage {
    name        : string               // 语言代码
    title?      : string               // 语言标题
    nativeTitle?: string               // 用原语言表达的标题
    default?    : boolean              // 是否默认语言
    active?     : boolean              // 是否激活      
    fallback?   : string               // 回退语言
}
```

### fallback

- 类型: `string`


默认回退语言

### idMap

- 类型: `Voerkai18nIdMap`


消息id映射列表

### storage

- 类型: `IVoerkaI18nStorage`

语言包存储器

### formatters

- 类型: `VoerkaI18nFormatters`


当前作用域的格式化

### log

- 类型: `VoerkaI18nLoggerOutput`


配置日志记录器，当`debug`为`true`时用来输出调试信息。

```ts
type VoerkaI18nLoggerLevels = 'warn' | 'error' | 'info' | 'debug'
type VoerkaI18nLoggerOutput = (level:VoerkaI18nLoggerLevels,message:string)=>void
```

### component

- 类型: `VoerkaI18nTranslateComponentBuilder<TranslateComponent>` 

翻译组件

### transform

- 类型: `VoerkaI18nTranslateTransformBuilder<TranslateTransformResult>`


对翻译结果进行变换，比如变换为vue/ref对象

### storageKey

- 类型: `string`
- 默认值: `language`

保存当前语言到`Storage`时的`Key`。

### loader

- 类型: `VoerkaI18nLanguageLoader`

从远程加载语言包

### cachePatch

- 类型: `boolean`
- 默认值: `false`

是否缓存补丁语言包