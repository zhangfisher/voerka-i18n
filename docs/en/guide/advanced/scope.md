# Scope

## Overview

`VoerkaI18n` uses the concept of scope to manage multiple internationalization instances. Each scope is an independent internationalization instance with its own configuration, language packs, and state.

## Basic Concepts

### Global Singleton

`VoerkaI18n` is a global singleton that manages all scopes:

```javascript
console.log(VoerkaI18n.activeLanguage)    // Current language
console.log(VoerkaI18n.languages)         // Supported languages
```

### Scope Instance

Each scope is an instance of `VoerkaI18nScope`:

```javascript
import { VoerkaI18nScope } from "@voerkai18n/runtime"

const scope = new VoerkaI18nScope({
    id: "myapp",                  // Scope ID
    default: "zh-CN",            // Default language
    active: "en-US",             // Active language
    languages: [                 // Supported languages
        {
            name: "zh-CN",
            title: "Chinese"
        },
        {
            name: "en-US",
            title: "English"
        }
    ],
    messages: {                  // Language packs
        "zh-CN": { ... },
        "en-US": { ... }
    }
})
```

## Usage

### Creating a Scope

When initializing a project with `voerkai18n init`, it automatically creates a scope in `languages/index.js`:

```javascript
// languages/index.js
import { VoerkaI18nScope } from "@voerkai18n/runtime"
import settings from "./settings.json"
import messages from "./messages"
import storage from "./storage"
import formatters from "@voerkai18n/formatters"

export const i18nScope = new VoerkaI18nScope({
    ...settings,
    messages,
    storage,
    formatters
})

export const t = i18nScope.t
export const Translate = i18nScope.component
```

### Scope Configuration

The scope configuration is in `languages/settings.json`:

```json
{
    "id": "myapp",              // Scope ID
    "default": "zh-CN",        // Default language
    "active": "en-US",         // Active language
    "languages": [             // Supported languages
        {
            "name": "zh-CN",
            "title": "Chinese"
        },
        {
            "name": "en-US",
            "title": "English"
        }
    ]
}
```

### Using Multiple Scopes

In monorepo projects, each package can have its own scope:

```javascript
// Package 1
const scope1 = new VoerkaI18nScope({ id: "pkg1", ... })

// Package 2
const scope2 = new VoerkaI18nScope({ id: "pkg2", ... })

// Main program
const mainScope = new VoerkaI18nScope({
    id: "main",
    includes: ["pkg1", "pkg2"],    // Include other scopes
    ...
})
```

### Language Switching

When switching languages, all related scopes will automatically switch:

```javascript
// Switch language in main scope
await mainScope.change("en-US")
// All included scopes will automatically switch to en-US

// Or use global singleton
await VoerkaI18n.change("en-US")
// All scopes will switch to en-US
```

## Notes

1. Each scope must have a unique ID
2. Scopes can be nested through the `includes` configuration
3. When switching languages, all related scopes will automatically switch
4. Each scope maintains its own state and configuration
5. The global singleton `VoerkaI18n` manages all scopes
