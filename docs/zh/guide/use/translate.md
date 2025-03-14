# 翻译组件

## 关于

除了使用`t`函数外，在前端代码中推荐使用`<Translate>`组件替代`t`函数。

`Translate`组件与`t`函数的区别在于：

- `Translate`翻译组件可以在语言切换时自动重新渲染，而`t`函数不会。
- `Translate`翻译组件支持段落翻译，而`t`函数不支持。见[段落翻译](./paragraph)。
- `Translate`翻译组件一般会为翻译内容包裹一个`<span>`标签，而`t`函数仅返回一个字符串。
- `Translate`翻译组件支持在线编辑翻译内容进行提交，而`t`函数不支持。


:::warning 提示
一般推荐在UI模板中使用`<Translate>`翻译组件，而在脚本代码里使用`t`翻译函数。
比如在`Vue`的`template`部份使用`<Translate>`组件，而在`script`部份使用`t`函数。
:::

## 使用方法

### 第1步：配置框架支持

显然，`<Translate>`组件是需要框架支持的，如Vue组件，React组件，Svelte组件等，不同的前端框架组件实现是不一样的。

所以我们需要先配置框架支持，具体如何配置请参考对应的框架文档。

**以`Vue 3`为例**，我们需要执行`voerkai18n apply`命令来自动配置`Vue 3`框架支持。

```shell
> voerkai18n apply 
```

- 在`apply`命令中选择`Vue3`，会自动安装本配置`@voerkai18n/vue`支持, 更具体的配置详见[集成Vue 3](../integration/vue)。
- 如果执行`voerkai18n apply`命令失败，可以手动配置支持，详见集成框架文件。

### 第2步：导入组件

接下，我们需要在代码中从`languages`导入`Translate`翻译组件。

```ts
// 从当前语言文件夹导入翻译组件
import { Translate } from "<myapp>/languages"

```

- 无论是`React/Vue/Solid/Svelte`等框架，均是同样从从`languages`导入`Translate`翻译组件

### 第3步：使用翻译组件

`Translate`翻译组件的作用就是将翻译内容渲染到页面上，并且可以在切换语言时自动重新渲染。

以`Vue`为例，我们可以在`template`中使用`<Translate>`翻译组件。

```vue
<template>
    <div>
        <Translate message="hello"/>  
        <!-- 动态翻译内容，向服务器发起请求 -->
        <Translate :message="(language)=>{.....}"/>  
    </div>
</template>

```

## 指南

### 组件属性

`<Translate>`组件支持以下属性：

| 属性 |类型 | 默认值 | 说明 | 
| --- | --- | --- | --- |
| `id` | `string` | - | 段落id，详见[段落](./paragraph) |
| `message` | `string \| VoerkaI18nToBeTranslatedMessage` | - | 文本信息 |
| `vars` | `string \| number \| Object \| Array` | - | 插值变量 |
| `tag` | `string` | `span` | 标签名称 |
| `options` | `object` | - | 用来传递创建组件的参数 |
| `style` | `string` | - | 传递给组件的样式 |
| `className` | `string` | - | 传递给组件的类名 |
| `default` | `string` | - | 默认文本，当message是一个异步函数时提供默认值 |


- `message`属性的类型是`VoerkaI18nToBeTranslatedMessage`

```ts
type VoerkaI18nToBeTranslatedMessage = string 
    | ((
        language:string,
        vars?:VoerkaI18nTranslateVars,
        options?: VoerkaI18nTranslateOptions
    )=>string | Promise<string>)
```

:::warning 特殊提醒
`<Translate>`翻译组件是框架相关的，不同的前端框架组件实现是不一样的。
:::


### 启用组件支持

`<Translate>`翻译组件是框架相关的，不同的前端框架(React/Vue/Vue2/Svelte/Solid)的翻译组件实现是不一样的。

以`Vue`为例，可以通过修改`languages/component.{ts|js}`文件来启用`<Translate>`组件支持。

<lite-tree>
myapp
    languages
        settings.json                   // 语言配置文件        
        index.ts                        // 包含该应用作用域下的翻译函数等
        storage.ts
        loader.ts
        component.ts                        //! 修改此翻译组件
        api.json                            // 翻译API配置
        messages/                            //+ 编译生成的语言包
        translates/                          // 此文件夹包含了所有需要翻译的内容        
    package.json
    index.ts
</lite-tree>

编辑`component.ts`文件，启用`<Translate>`组件支持,如下：

```ts
// languages/component.ts
import { createTranslateComponent, type VueTranslateComponentType } from "@voerkai18n/vue";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```

- 更多框架支持详见[集成框架](../integration)

### 自动启用组件支持

也可以通过`voerkai18n apply`命令来自动配置`Vue 3`框架支持。

```shell
> voerkai18n apply 
```

### 动态翻译

`<Translate>`组件支持动态翻译，可以在`message`属性中传递一个函数，函数的参数是当前语言和插值变量。

```vue
<template>
    <div>
        <Translate :message="async (language)=>{return language==='zh-CN' ? '你好':'Hello'}" />  
    </div>
</template>
```

- 利用此特性可以实现动态翻译，比如从服务器获取翻译内容。
- `message`属性可以是一个异步函数，返回一个字符串或者一个`Promise<string>`。
- `tag`属性可以指定渲染的标签名称。
- `t`函数不支持动态翻译。

### 自定义翻译组件

除了官方提供的`@voerkai18n/{vue|vue2|react|svelte|nextjs|solid}`翻译组件外，您也可以自定义翻译组件。

```ts
// languages/component.ts
// import type { VoerkaI18nTranslateProps } from "@voerkai18n/runtime";

export const component = (scope:VoerkaI18nScope)=>{
      return (props:VoerkaI18nTranslateProps)=>{
         // 在此编写组件代码 // [!code ++]
      }
}
export type TranslateComponentType = ReturnType<typeof component>

```

`VoerkaI18nTranslateProps`类型声明如下：

```ts
export type VoerkaI18nTranslateProps<
    Options extends VoerkaI18nTranslateOptions = VoerkaI18nTranslateOptions,
    Children=any
>= {
    id?       : string
    message?  : VoerkaI18nToBeTranslatedMessage
    vars?     : VoerkaI18nTranslateVars
    default?  : any
    tag?      : string
    options?  : Options    
    children? : Children 
    style?    : any
    className?: string
}
```




