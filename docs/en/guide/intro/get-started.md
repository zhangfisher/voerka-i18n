# Quick Start

`VoerkaI18n` is a universal internationalization solution for `Javascript/Typescript`, supporting mainstream frameworks such as `Vue`, `React`, `Svelte`, `Nextjs`, etc.

This section uses a standard `Nodejs js` application as an example to briefly introduce the basic usage process of the `VoerkaI18n` internationalization framework.

<lite-tree>
myapp
  package.json
  src/
    index.js
</lite-tree>

> The above tree component is built based on [Lite-Tree](https://zhangfisher.github.io/lite-tree/).

In all supported source files of this project, you can use the `t` function to wrap text that needs to be translated.

```javascript 
// index.js
console.log(t("中华人民共和国万岁"))
console.log(t("中华人民共和国成立于{}",1949))
```

The `t` translation function is exported from the `myapp/languages/index.js` file, but `myapp/languages` doesn't exist yet - it will be automatically generated later. `voerkai18n` will use regular expressions to extract the text that needs to be translated.

## Step 1: Install Command Line Tool

Install `@voerkai18n/cli` globally to provide the `voerkai18n` command.

```shell
> npm install -g @voerkai18n/cli
> yarn global add @voerkai18n/cli
> pnpm add -g @voerkai18n/cli
```

## Step 2: Initialize Project

Run the `voerkai18n init` command in the project directory to initialize.

```javascript 
> voerkai18n init 
```

The `voerkai18n init` command provides an interactive command-line interface to initialize the multilingual environment.

After initialization, a language working directory will be created, by default located at `src/languages`.

The language directory structure is roughly as follows:

<lite-tree>
myapp
    src
        languages
            api.json
            component.js           // Translation component
            index.js              //! Entry file        
            messages/             
            paragraphs/
            prompts/        
            settings.json
            storage.js
            loader.js
            transform.js
            formatters.json       // Formatter configuration
            translates/           // Extract content that needs translation
    package.json
    index.js    
</lite-tree>

:::warning Note
For more usage of the `voerkai18n init` command, please check [here](../tools/cli.md)
:::

## Step 3: Mark Translation Content

Next, in the source files, wrap all content that needs translation using the `t` translation function, as follows:

```javascript 
import { t } from "./languages"
// Without interpolation variables
t("中华人民共和国")
// Position interpolation variables
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",[1949,"北京"])
```

- The `t` translation function is just a regular function, you need to provide an execution environment for it. For more usage of the `t` translation function, see [here](../use/t.md)

## Step 4: Extract Text

Next, we use the `voerkai18n extract` command to automatically scan the project source files for text information that needs translation.
The `voerkai18n extract` command uses regular expressions to extract text wrapped in `t("extract text")`.

```shell
myapp>voerkai18n extract
```

The purpose of the `voerkai18n extract` command is to extract all content that needs translation and save it to `myapp/languages/translates/messages/default.json`.

- **translates/messages/default.json**: 
    This file contains the text information that needs to be translated, extracted from scanning the current project. All text content that needs translation will be collected in this file.

The final file structure is as follows:
<lite-tree>
myapp
    src
        languages
            api.json
            component.js           // Translation component
            index.js              //! Entry file        
            messages/             
            paragraphs/
            prompts/        
            settings.json
            storage.js
            loader.js
            translates/           // Extract content that needs translation
                messages
                    default.json  //! Content to be translated is extracted here
    package.json
    index.js    
</lite-tree>

## Step 5: Manual Translation

Next, you can translate all JSON files in the `languages/translates/messages` folder. Each JSON file looks roughly like this:

```json
{
    "欢迎使用VoerkaI18n":{
        "en":"<Write the corresponding English translation here>",
        "de":"<Write the corresponding German translation here>",
        "jp":"<Write the corresponding Japanese translation here>",
        "$files":["index.js"],    // Records which files this information was extracted from
        "$id":1
    },
    "VoerkaI18n是一款非常棒的国际化解决方案":{
        "en":"<Write the corresponding English translation here>",
        "de":"<Write the corresponding German translation here>",
        "jp":"<Write the corresponding Japanese translation here>",
        "$files":["index.js"],
        "$id":2
    }
}
```

We just need to modify the corresponding language translations in this file.

:::warning Note
If you modify the source files during translation, you only need to re-execute the `voerkai18n extract` command. `VoerkaI18n` will automatically merge the new translation content into the JSON files in the `translates/messages` folder.
**Repeatedly executing the `voerkai18n extract` command is safe and won't cause loss of half-completed translations, so you can execute it with confidence.**
:::

## Step 6: Automatic Translation

`voerkai18n` supports automatic translation by calling online translation services using the `voerkai18n translate` command.

From `voerkai18n 3.0`, in addition to `Baidu Translation`, AI translation is supported as a priority.

```javascript 
// Using Baidu Translation
>voerkai18n translate --api-key <key applied from Baidu Translation> --api-id <appid applied from Baidu Translation> --provider baidu
// Using AI translation, supporting OpenAI-compatible large model API
>voerkai18n translate --api-key <API key> --api-url <AI API URL> --api-model <model name> 
```

Executing the above statement in the project folder will automatically call the `online translation API` for translation. Given the current translation quality, you only need to make minor adjustments. For more information about using the `voerkai18n translate` command, please refer to the subsequent introduction.

## Step 7: Compile Language Packs

After we complete the translation of all JSON language files in `myapp/languages/translates/messages`, we need to compile the translated files.

```shell
myapp> voerkai18n compile
```

The `compile` command generates the following files based on `myapp/languages/translates/messages/*.json` and `myapp/languages/settings.json`:

<lite-tree>
myapp
    languages
        settings.json                   // Language configuration file        
        index.js                        // Contains translation functions under this application scope
        storage.js
        loader.js 
        formatters.json                 // Formatter configuration
        component.js                    // Translation component
        api.json                        // Translation API configuration
        messages                        //+ Compiled language packs
            idMap.js                    //+ Text information ID mapping table
            zh.js                       //+ Language pack
            en.js                       //+ Language pack
            jp.js                       //+
            de.js                       //+
        translates                      // This folder contains all content that needs translation
            messages
                default.json
    package.json
    index.js
</lite-tree>

## Step 8: Import Translation Function

In step one, we directly used the `t` translation function to wrap text information that needs translation. This `t` translation function is automatically generated and declared in `myapp/languages/index.js` during the compilation phase.

```javascript 
import { t } from "./languages"   
```

Therefore, we just need to import this function when translation is needed.

However, if there are many source files, repeatedly importing the `t` function can be cumbersome. It's recommended to use the `unplugin-auto-import` plugin to automatically import the `t` function.

## Step 9: Switch Languages

When you need to switch languages, you can do so by calling the `change` method.

```javascript 
import { i18nScope } from "./languages"

// Switch to English
await i18nScope.change("en")
// Or VoerkaI18n is a global singleton, can be accessed directly
await VoerkaI18n.change("en")
```

`i18nScope.change` and `VoerkaI18n.change` are equivalent.

You might also need to update and render the interface after language switching. You can subscribe to events to respond to language changes.

```javascript 
import { i18nScope } from "./languages"

// Switch to English
i18nScope.on("change",(newLanguage)=>{
    // Re-render interface here
    ...
})
// 
VoerkaI18n.on("change",(newLanguage)=>{
     // Re-render interface here
     ...
})
```

For different frontend frameworks, corresponding out-of-the-box libraries are provided to simplify this, including `vue/vue2/svelte/nextjs/...` etc.

## Step 10: Language Pack Patches

Generally, the engineering process for multilingual support ends here, but `voerkai18n` considers multilingual practice in a more user-friendly way. Have you often encountered situations where after the project goes live, you discover:
- Translation errors
- Clients have personal preferences for certain expressions and request changes
- Need to temporarily add support for a language

Usually in these situations, you have to repackage and rebuild the project, then redeploy, which is a cumbersome and troublesome process.
Now `voerkai18n` provides a perfect solution for this problem, allowing you to apply language pack patches and dynamically add language support through the server without needing to repackage the application or modify it.

**Method as follows:**

1. Open `languages/loader.{js|ts}` to modify the language pack loader function, which loads language pack files from the server.

```javascript 
module.exports = async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
}
```

2. Save the language pack patch files on the web server at the specified location `/languages/<application name>/<language name>.json`.
3. When the application starts, it will automatically load and merge language patch packs from the server, achieving the ability to patch language packs dynamically.
4. Using this feature, you can also implement the functionality to dynamically add temporary support for a language.

For more complete instructions, see [`Dynamic Loading of Language Packs`](../advanced/dynamic-add) and [`Language Pack Patches`](../advanced/lang-patch) feature introductions.

:::warning Note
Using this feature, you can implement dynamic language support addition and dynamic patching functionality.
:::

## Summary

- Use the `t` function in the source code to wrap text information that needs translation. For frameworks like `React/Vue`, you can use the `<Translate>` component provided by `VoerkaI18n`.
- Basic workflow:
    - Use the `voerkai18n extract` command to extract text information that needs translation, can be repeatedly executed for automatic synchronization.
    - Use the `voerkai18n translate` command to call online translation services for automatic translation.
    - Use the `voerkai18n compile` command to compile language packs.
