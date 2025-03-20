# Dynamic Language Addition

## Overview

`VoerkaI18n` supports dynamically adding language support after application deployment. This means you can add support for new languages without recompiling and redeploying the application.

## Implementation

### Step 1: Configure Language Pack Loading

First, you need to modify the language pack loading function in `languages/loader.{js|ts}` to load language packs from the server.

```javascript
// languages/loader.js
module.exports = async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
}
```

### Step 2: Save Language Pack Files

Save the language pack files on the web server at the specified location `/languages/<application name>/<language name>.json`.

### Step 3: Add Language Support

```javascript
// Add language support
await VoerkaI18n.addLanguage("ja-JP",{
    title:"Japanese",
    icon:"/flags/ja-JP.png"
})
```

## Notes

1. The language pack file format must be consistent with the existing language pack format
2. The language pack file must be accessible through HTTP requests
3. After adding a new language, you need to call `VoerkaI18n.change()` to switch to the new language
4. The language pack file should include all translation content, including messages and paragraphs
