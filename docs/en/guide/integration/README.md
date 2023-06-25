# Framework integration

 `voerkai18n` It can be applied to most frameworks, including but not limited to `Vue`, `React`, `Angular`, `Svelte` and so on. The functionality you want to integrate `VoerkaI18n` for a framework or library is very simple and typically requires the following:

## Execute the `t` translation function

Translation is essentially a very simple table lookup function. In principle, you only need to wrap all the strings that need to be translated with a `t` function. Therefore, you only need to provide an execution condition for the `t` function. And this is relatively easy to do, without any difficulty.

Generally, you only need to `import { t} from "./languages"` use `t` the function directly without any configuration. `./languages` The files themselves are part of your project's source code.

At this point, your application is ready for translation.

## Automatically import `t` translation function

Because all the files that need to use `t` the translation function need to be imported, it is more troublesome. In order to simplify the import work, `voerkai18n` the `babel`, `vite` and `webpack` plug-ins are provided. After configuration, the source code can be automatically scanned. If a function is found to be used `t` in the source code, it will be automatically imported. These plug-ins basically cover most `Javascrip` of the engineering scenarios. After applying these plug-ins, `t` the function is equivalent to a global function, which can be used directly in the project without importing.

The automatic import `t` of translation functions is only intended to improve the programming experience and is not required.

## Switch languages dynamically

Dynamic language switching means that the user chooses another language on the interface, and the whole interface automatically updates to the new language, that is, re-rendering. The basic steps are as follows:

- ** Switch languages **

    ```javascript
    import { i18nScope } from "./languages"
    await i18nScope.change("<新语言>")
    // 或者调用全局实例
    VoerkaI18n.change("<新语言>")
    ```

- ** Responding to a language switch event **

    ```javascript
    import { i18nScope } from "./languages"
    i18nScope.on((newLanguage)=>{...})
    // 或者调用全局
    VoerkaI18n.on((newLanguage)=>{...})
    ```

- ** Re-render the interface **

    An application can re-render the entire application after listening for a language switch event. The implementation of this global re-rendering varies from framework to framework, but overall it is not difficult. For example, in Vue, you can do this:

    ```javascript
    import { i18nScope } from "./languages"
    i18nScope.on((newLanguage)=>{
         app._instance.update()   // 强制重新渲染
         //......
    })
    ```

## Brief summary

With the above fundamentals in mind, it is easy to build `voerkaI18n` for `Vue` application sets `ReactNative` such as, `React`, `Angular`, `Svelte`, `Solid` `uniapp` and.













