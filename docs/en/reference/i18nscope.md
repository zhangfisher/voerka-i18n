# VoerkaI18nScope

`VoerkaI18nScope` is an internationalization scope instance.

## Constructor

```ts
interface VoerkaI18nScopeOptions{
    id?: string                                  // Current scope ID
    idMap?: VoerkaI18nIdMap                     // Message ID mapping list
    formatters?: VoerkaI18nFormatters           // Formatters
    storage?: IVoerkaI18nStorage                // Language configuration storage
    messages?: VoerkaI18nLanguageMessagePack    // Language packs
    paragraphs?: VoerkaI18nParagraphs          // Paragraphs
    component?: VoerkaI18nTranslateComponentBuilder<TranslateComponent>  // Translation component
    loader?: VoerkaI18nLanguageLoader           // Message loader
    transform?: VoerkaI18nTranslateTransformBuilder<TranslateTransformResult>  // Transform translation results
    languages?: VoerkaI18nLanguage[]            // Supported languages
    default?: string                            // Default language
    active?: string                             // Active language
    fallback?: string                           // Fallback language
    debug?: boolean                             // Whether to enable debug mode
    injectLangAttr?: boolean | string          // Whether to inject language attribute to html element
    storageKey?: string                         // Key used when saving current language to Storage
    cachePatch?: boolean                        // Whether to cache patch language packs
}
```

## Properties

```ts
// Current scope ID
readonly id: string
// Current scope name
readonly name: string
// Current scope version
readonly version: string
// Whether it's a library
readonly library: boolean
// Whether it's attached to appScope
readonly attached: boolean
// Whether debug mode is enabled
readonly debug: boolean
// Whether to inject language attribute to html element
readonly injectLangAttr: boolean | string
// Key used when saving current language to Storage
readonly storageKey: string
// Whether to cache patch language packs
readonly cachePatch: boolean
// Default language
readonly defaultLanguage: string
// Active language
readonly activeLanguage: string
// Fallback language
readonly fallbackLanguage: string
// Supported languages
readonly languages: VoerkaI18nLanguage[]
// Translation component
readonly component: VoerkaI18nTranslateComponent
// Translation function
readonly t: VoerkaI18nTranslateFunction
// Translation function that returns reactive results
readonly $t: VoerkaI18nTranslateFunction
```

## Methods

### change

Switch language.

```ts
async change(language:string):Promise<void>
```

### ready

Wait for the first language switch to complete.

```ts
ready(callback:()=>void):void
```

### on

Subscribe to events.

```ts
on(event:string,callback:Function):Function
```

### off

Unsubscribe from events.

```ts
off(event:string,callback:Function):void
```

### once

Subscribe to events once.

```ts
once(event:string,callback:Function):Function
```

### offAll

Unsubscribe from all events.

```ts
offAll():void
```

### registerFormatter

Register formatter.

```ts
registerFormatter(name:string,formatter:VoerkaI18nFormatter,options?:VoerkaI18nFormatterOptions):void
```

### getFormatterOptions

Get formatter configuration.

```ts
getFormatterOptions(name:string):any
```
