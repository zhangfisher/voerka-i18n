#  Questions

## Can comments be filtered when extracting translation content?

Yes, translation content can filter out comments.
Comments will be filtered out using regular expressions before translation. If there are special cases, please raise an issue.

## Can I see which files contain the extraction results?

The `languages/translate/default.json` will show which file the content was extracted from.

```json
{
    " - 更新格式化器:{}": {
        "en": " - Update formatters:{}",
        "$files": [
            "compile.command.js"  // Indicates it was extracted from this file
        ]
    }
}
```

## How to handle multiple translations of the same word in different contexts?

Multiple translations refer to situations where a word needs to be translated differently in different contexts.
For example, `t("确定")` might need to be translated as `OK` or `Complete` in different contexts, but during content extraction, only the same word `确定` can be extracted, making multiple translations impossible.

Sorry, the current version doesn't have special handling for this. You need to use different Chinese terms in different contexts to avoid multiple translations of the same word.

This issue will be considered in the next version.

## How to efficiently transform old projects?

Currently, `VoerkaI18n` doesn't provide plugins or tools to migrate from other internationalization solutions to `VoerkaI18n`.

If your project wasn't using any internationalization solution before, you can try the following approach to reduce some workload.

**In `VSCODE`, you can use find and replace in files, then enter the regular expression `(['"]([^'"\n\\]|\\[\s\S])*[\u4E00-\u9FFF]([^'"\n\\]|\\[\s\S])*['"])` and replace with `t($0)`**

This can replace most Chinese text wrapped in "xxx" or 'xxxx' with the `t("xxxx")` format.

However, due to complex real-world situations, such as determining what needs translation and what doesn't, a single regular expression replacement can't solve all problems - it can both cause unintended changes and errors.

It can only reduce some workload, and more manual intervention is needed.

## Why doesn't the specified `activeLanguage` take effect?

Why sometimes when the `activeLanguage` parameter is specified, it still doesn't take effect?

**Possible reasons:**

By default, `VoerkaI18n` stores the most recently switched language in `LocalStorage`. When you modify the `activeLanguage` configuration in `languages/index.(js|ts)`,
since `LocalStorage` already has a value (the `previously remembered activeLanguage`), `VoerkaI18n` will prioritize using the value in `LocalStorage` instead of the value in `activeLanguage`.

This creates the phenomenon where `activeLanguage` doesn't take effect.

**Solution:**

- Clear the `language` value in `LocalStorage`, then refresh the page.

## Error Messages

- **Runtime error: `[VoerkaI18n] Default language pack must be static content, cannot use asynchronous loading method.`?**

In `languages/index.(ts|js)`, language packs specified with `default=true` must be directly `import`ed, and cannot use asynchronous loading methods like `()=>import()`.

```ts
// Language configuration file

const scopeSettings = {
    "languages": [
        {
            "name": "zh",
            "title": "Chinese"
        },
        {
            "name": "en",
            "title": "English",
            "default":true, 
        } 
    ] 
}

// Incorrect example

import defaultMessages from "./zh.js"  
const messages = {
    'zh' : defaultMessages,
    // Error because default language is en but uses async loading
    'en' :  ()=>import("./en.js") 
}

// Correct example
import defaultMessages from "./en.js"  
const messages = {
    'zh' : ()=>import("./en.js"),
    'en' : defaultMessages   // Correct: static loading
}
```

## `defaultLanguage` and `activeLanguage`

- **Default Language** (`defaultLanguage`):

Refers to the language written directly in the code. Generally, for domestic software, Chinese is usually the default language, which is what we write directly in the code, like `t("中文")`. When executing the `voerkai18n translate` command, it always translates from the default language to other languages.

- **Active Language** (`activeLanguage`):

Refers to the language actually displayed in the interface. When we switch languages, we're switching the active language.

In `settings.json`, the **default language** and **active language** can be the same or different.

## What if `voerkai18n extract` extracts text that doesn't need translation?

In simple terms, what to do when there's unintended extraction of text for translation?

The working mechanism of `voerkai18n extract` is as follows:

1. First, use regular expressions to filter out comment content.
2. Then extract text content matching `t(".....")` using regular expressions.

In short, it uses regular expressions for matching and extraction. If extraction errors occur, there are several possible reasons:

- Regular expression engines differ between `nodejs` versions, causing extraction errors. Try upgrading your `nodejs` version.
- The regular expressions used for extraction aren't accurate enough, some edge cases aren't covered, leading to extraction errors. Please raise an `issue`, and we'll fix it as soon as possible.
- The `extract` operation `cannot handle template strings`, for example, **t(`xx${xxx}xx`)** cannot be extracted correctly. Please convert to using interpolation variables instead.
