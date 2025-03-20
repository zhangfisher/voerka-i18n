# Language Pack Patches

## Overview

After deploying an application, you might discover:
- Translation errors
- Clients have personal preferences for certain expressions and request changes
- Need to temporarily add support for a language

Usually in these situations, you would need to repackage and rebuild the project, then redeploy, which is cumbersome and troublesome.

`VoerkaI18n` provides a perfect solution for this problem, allowing you to apply language pack patches and dynamically add language support through the server without needing to repackage the application or modify it.

## Implementation

### Step 1: Configure Language Pack Loading

First, you need to modify the language pack loading function in `languages/loader.{js|ts}` to load language packs from the server.

```javascript
// languages/loader.js
module.exports = async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
}
```

### Step 2: Save Patch Files

Save the language pack patch files on the web server at the specified location `/languages/<application name>/<language name>.json`.

The patch file format is as follows:

```json
{
    "messages":{
        "确定":{
            "en":"OK",
            "ja":"はい"
        }
    },
    "paragraphs":{
        "license":{
            "en":"...",
            "ja":"..."
        }
    }
}
```

### Step 3: Automatic Patching

When the application starts, it will automatically load and merge language patch packs from the server, achieving the ability to patch language packs dynamically.

## Notes

1. The patch file format must be consistent with the existing language pack format
2. The patch file must be accessible through HTTP requests
3. Patches will override existing translations
4. You can use this feature to implement dynamic language support addition and dynamic patching functionality
