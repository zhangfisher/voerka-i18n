# Configuration

`VoerkaI18n` has two types of configuration:

- **Workflow Configuration**

Configuration for `@voerkai18n/cli`'s initialization, extraction, translation, compilation, and other translation workflow processes.
It is generally recommended to configure in the `voerkai18n` field of `package.json`. For example:

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

- **Runtime Configuration**

Configuration parameters for building `VoerkaI18nScope` instance, generally recommended to configure in:

- `languages/settings.json`
- `languages/index.{ts|js}`

```ts {2,13}
// ....
import settings from "./settings.json" 
export const i18nScope = new VoerkaI18nScope<TranslateComponentType,TransformResultType>({    
    id: "",                                  // Current scope ID
    idMap,                                   // Message ID mapping list
    formatters,                              // Formatters
    storage,                                 // Language configuration storage
    messages,                                // Language packs
    paragraphs,                              // Paragraphs
    component,                               // Translation component
    loader,                                  // Message loader
    transform,                               // 
    ...settings
})  
```

## **Workflow Configuration**

### entry

- Type: `string`
- Default: `src/languages`

By default, the language working directory is `src/languages`. If you need to change it, you can use the `entry` field.

### namespaces

- Type: `Record<string,string>`

Namespaces

### patterns

- Type: `string[]`

Configure file matching list for text extraction, using `glob` matching rules.

## **Runtime Configuration**

### id

- Type: `string`
- Default: `name` field from `package.json`

Unique scope ID, by default `name`+`version` from `package.json`

### attached

- Type: `boolean`
- Default: `false`

Whether to attach to appScope

### injectLangAttr

- Type: `boolean | string`
- Default: `false`

Whether to inject a language attribute pointing to the current active language on the html element

### debug

- Type: `boolean`
- Default: `false`

Whether to enable debug mode, which will output debug information when enabled

### messages

- Type: `VoerkaI18nLanguageMessagePack`

Current language pack

### paragraphs

- Type: `VoerkaI18nParagraphs`

Paragraphs

### library

- Type: `boolean`
- Default: `false`

Should be set to true when developing a library

### languages

- Type: `VoerkaI18nLanguage[]`
- Default: `[]`

List of supported languages in the current scope

```ts
interface VoerkaI18nLanguage {
    name        : string               // Language code
    title?      : string               // Language title
    nativeTitle?: string               // Title in native language
    default?    : boolean              // Whether it's default language
    active?     : boolean              // Whether it's active      
    fallback?   : string               // Fallback language
}
```

### fallback

- Type: `string`

Default fallback language

### idMap

- Type: `Voerkai18nIdMap`

Message ID mapping list

### storage

- Type: `IVoerkaI18nStorage`

Language pack storage

### formatters

- Type: `VoerkaI18nFormatters`

Formatters for current scope

### log

- Type: `VoerkaI18nLoggerOutput`

Configure logger, used to output debug information when `debug` is `true`.

```ts
type VoerkaI18nLoggerLevels = 'warn' | 'error' | 'info' | 'debug'
type VoerkaI18nLoggerOutput = (level:VoerkaI18nLoggerLevels,message:string)=>void
```

### component

- Type: `VoerkaI18nTranslateComponentBuilder<TranslateComponent>`

Translation component

### transform

- Type: `VoerkaI18nTranslateTransformBuilder<TranslateTransformResult>`

Transform translation results, such as transforming to vue/ref objects

### storageKey

- Type: `string`
- Default: `language`

Key used when saving current language to `Storage`

### loader

- Type: `VoerkaI18nLanguageLoader`

Load language packs from remote

### cachePatch

- Type: `boolean`
- Default: `false`

Whether to cache patch language packs
