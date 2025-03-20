# Translation Component

## About

Besides using the `t` function, it's recommended to use the `<Translate>` component instead of the `t` function in frontend code.

The differences between the `Translate` component and the `t` function are:

- The `Translate` translation component automatically re-renders when switching languages, while the `t` function doesn't.
- The `Translate` translation component supports paragraph translation, while the `t` function doesn't. See [Paragraph Translation](./paragraph).
- The `Translate` translation component generally wraps the translated content in a `<span>` tag, while the `t` function only returns a string.
- The `Translate` translation component supports online editing and submission of translation content, while the `t` function doesn't.

:::warning Note
It's generally recommended to use the `<Translate>` translation component in UI templates and the `t` translation function in script code.
For example, use the `<Translate>` component in the `template` part of `Vue`, and use the `t` function in the `script` part.
:::

## Usage

### Step 1: Configure Framework Support

Obviously, the `<Translate>` component needs framework support, such as Vue component, React component, Svelte component, etc., as different frontend framework components have different implementations.

So we need to configure framework support first. Please refer to the corresponding framework documentation for specific configuration.

**Taking `Vue 3` as an example**, we need to execute the `voerkai18n apply` command to automatically configure `Vue 3` framework support.

```shell
> voerkai18n apply 
```

- In the `apply` command, select `Vue3`, which will automatically install `@voerkai18n/vue` support. For more specific configuration, see [Integrating Vue 3](../integration/vue).
- If the `voerkai18n apply` command fails, you can manually configure support, see the framework integration file for details.

### Step 2: Import Component

Next, we need to import the `Translate` translation component from `languages` in our code.

```ts
// Import translation component from current language folder
import { Translate } from "<myapp>/languages"
```

- Whether it's `React/Vue/Solid/Svelte` or other frameworks, the `Translate` translation component is always imported from `languages`

### Step 3: Use Translation Component

The purpose of the `Translate` translation component is to render translated content to the page and automatically re-render when switching languages.

Taking `Vue` as an example, we can use the `<Translate>` translation component in the `template`.

```vue
<template>
    <div>
        <Translate message="hello"/>  
        <!-- Dynamic translation content, make request to server -->
        <Translate :message="(language)=>{.....}"/>  
    </div>
</template>
```

## Guide

### Component Properties

The `<Translate>` component supports the following properties:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | - | Paragraph ID, see [Paragraphs](./paragraph) |
| `message` | `string \| VoerkaI18nToBeTranslatedMessage` | - | Text message |
| `vars` | `string \| number \| Object \| Array` | - | Interpolation variables |
| `tag` | `string` | `span` | Tag name |
| `options` | `object` | - | Parameters for creating component |
| `style` | `string` | - | Style passed to component |
| `className` | `string` | - | Class name passed to component |
| `default` | `string` | - | Default text, provides default value when message is an async function |

- The type of `message` property is `VoerkaI18nToBeTranslatedMessage`

```ts
type VoerkaI18nToBeTranslatedMessage = string 
    | ((
        language:string,
        vars?:VoerkaI18nTranslateVars,
        options?: VoerkaI18nTranslateOptions
    )=>string | Promise<string>)
```

:::warning Special Note
The `<Translate>` translation component is framework-dependent, with different implementations for different frontend frameworks.
:::

### Enable Component Support

The `<Translate>` translation component is framework-dependent, with different implementations for different frontend frameworks (React/Vue/Vue2/Svelte/Solid).

Taking `Vue` as an example, you can enable `<Translate>` component support by modifying the `languages/component.{ts|js}` file.

<lite-tree>
myapp
    languages
        settings.json                   // Language configuration file        
        index.ts                        // Contains translation functions etc. under this application scope
        storage.ts
        loader.ts
        component.ts                        //! Modify this translation component
        api.json                            // Translation API configuration
        messages/                            //+ Compiled language packs
        translates/                          // This folder contains all content that needs translation        
    package.json
    index.ts
</lite-tree>

Edit the `component.ts` file to enable `<Translate>` component support, as follows:

```ts
// languages/component.ts
import { createTranslateComponent, type VueTranslateComponentType } from "@voerkai18n/vue";
export const component = createTranslateComponent()
export type TranslateComponentType = VueTranslateComponentType
```

### Automatically Enable Component Support

You can also use the `voerkai18n apply` command to automatically configure `Vue 3` framework support.

```shell
> voerkai18n apply 
```

### Dynamic Translation

The `<Translate>` component supports dynamic translation. You can pass a function in the `message` property, with parameters for current language and interpolation variables.

```vue
<template>
    <div>
        <Translate :message="async (language)=>{return language==='zh-CN' ? '你好':'Hello'}" />  
    </div>
</template>
```

- Using this feature, you can implement dynamic translation, such as getting translation content from the server.
- The `message` property can be an async function, returning a string or a `Promise<string>`.
- The `tag` property can specify the rendering tag name.
- The `t` function doesn't support dynamic translation.

### Custom Translation Component

Besides the official `@voerkai18n/{vue|vue2|react|svelte|nextjs|solid}` translation components, you can also customize your own translation component.

```ts
// languages/component.ts
// import type { VoerkaI18nTranslateProps } from "@voerkai18n/runtime";

export const component = (scope:VoerkaI18nScope)=>{
      return (props:VoerkaI18nTranslateProps)=>{
         // Write component code here // [!code ++]
      }
}
export type TranslateComponentType = ReturnType<typeof component>
```

The `VoerkaI18nTranslateProps` type declaration is as follows:

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
