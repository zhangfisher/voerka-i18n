# React app <!-- {docsify-ignore-all} -->

 `React` An application may generally employ `create-react-app` or `Vite+"@vitejs/plugin-react` tools to create a project.

This section describes how to add `voerkai18n` support for `Vite` projects created by + `@vitejs/plugin-react`.

## Step 1: Introduction


The complete engineering process to `React` enable `VoerkaI18n` internationalization for an application is as follows:

- Call `voerkai18n init` Initialize Multilingual Engineering
- Call to `voerkai18n extract` extract the text to be translated
- Invoked `voerkai18n translate` for automatic or human translation
- Invoke `voerkai18n compile` compiled language packs
- Introduction `@voerkai18n/vue` and `@voerkai18n/vite` plug-in in the application
- Translate using `t` functions in the source code

The complete engineering process is described in [here](../start/get-started), and the following is a brief description of how it is used `VoerkaI18n` in the `Vue` application.

## Step 2: Install `Vite` the plug-in

If the application is a project created with `Vite` + `@vitejs/plugin-react`, you can automatically import `t` functions and `text map` so on through the configuration `@voerkai18n/vite` plug-in.

The import installation `@voerkai18n/vite` plug-in is configured `vite.config.js` in.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        Inspect(),  // localhost:3000/__inspect/ 
        Voerkai18nPlugin({ 
            debug: true     // output some debug info
        }),
        react()
    ]
})
```

See [ @voerkai18n/vite ](/guide/tools/vite) the introduction of the plug-in for details.

## Step 3: Import the `t` translation function

 `t` The translation function is used for file translation. Common `React` application `t` translation functions can be used in two places:

- Common `js` or `ts` document
-  `React` Component `jsx、tsx` file

### Use in `js|ts` File

You just need to import `t` the function directly from `languages`.

```javascript
import { t } from "./languages"
```
Depending on which file you are importing from, you need to modify the import location, which might look like this:
```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"

console.log(t("xxxxxxxxxxx"))

```

- After importing `t` the function, you can use it directly. If the plug-in `autoImport` is `@voerkai18n/vite` enabled, the functions are automatically imported `t` without the need for manual import.


### Use in `React` component

The biggest difference between using `t` a function translation in a `React` component and in a `js|ts` file is: **When you switch languages, you need to trigger a re-rendering of the component **. To do this we need to apply the configuration `Provider` at the root.

1. **Configure Root Component Provider**

 `VoerkaI18nProvider` Wrapping the application root component essentially creates a `VoerkaI18nContext.Provider`.

```jsx

 
import { i18nScope } from "./languages"
import { VoerkaI18nProvider } from "@voerkai18n/react"

export default App(){
	return (
        <VoerkaI18nProvider scope={i18nScope}>
            <MyComponent/>
        <VoerkaI18nProvider/>
   )
}
```

2. Using `t` translation functions **in** components

Next, by `useVoerkaI18n` getting the `t` translation function for the current scope.

```jsx
import { useVoerkaI18n } from "@voerkai18n/react"
export function MyComponent(){
     const { t } = useVoerkaI18n()
    return ( 
        <div>{t("Content to be translated")}</div> 
    )
}

```

It also works when used `import { t} from "languages` directly **Notice **in a component, because a `t` function is essentially just a normal function. But when the language is switched dynamically, the corresponding component cannot be re-rendered automatically. Therefore, it is only through `{ t} = useVoerkaI18n()` imported `t` functions that you can automatically re-render components when you switch languages.

## Step 4: Switch languages

Next, in general, we also need to implement the function interface of language switching, which `useVoerkaI18n` provides:
-  `t`: The translation function for the current scope
-  `language`: Name of the currently active language
-  `defaultLanguage`: Default language name
-  `changeLanguage(language)`: Used to switch the current language
-  `languages`: Read the list of languages supported by the application.


```jsx

import { useVoerkaI18n } from "@voerkai18n/react"

export function MyComponent(){
     const { t, activeLanguage,changeLanguage,languages,defaultLanguage } = useVoerkaI18n()
    return ( 
        <div>
            <h1>{t("active language")}:{activeLanguage}</h1>
            <h1>{t("default langauge")}:{defaultLanguage}</h1>
            <div> {
                {/* Traverse all supported languages */}
                languages.map(lang=>{
                return (<button 
                            key={lang.name}
                            onclick={()=>changeLanguage(lang.name)}>
                            {lang.title}
                        </button>)
                })}
            </div>             
        </div> 
    )
} 
```


## Brief summary

- Encapsulate the root component using `<VoerkaI18nProvider scope={i18nScope}>`
-  `const { t} = useVoerkaI18n()` To import the translation function
- Function used `const { changeLanguage} = useVoerkaI18n()` to access the switch language
- Use `import { t} from "./languages"` in plain `ts/js` files to import `t` translation functions
-  `@voerkai18n/vite` The plug-in is optional and is only used to automatically import normal `ts/js` files when using `t` the translation function.
- If you are using to `Create React App` create an `React` application, refer to `voerki18n-loader`
- See for a example: [here](https://github.com/zhangfisher/voerka-i18n/tree/master/examples/reactapp) 

