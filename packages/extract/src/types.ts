import { Lang, NapiConfig, Range } from "@ast-grep/napi"
import { VoerkaI18nNamespaces } from "@voerkai18n/runtime"

export type TranslateNode = {
    text    : string
    rang    : Range
    vars?   : string,
    options?: string
    namespace?:string
} 

export type CodeSection = {
    name?    : string,    
    regex?   : RegExp,
    config  : NapiConfig
    language?: Lang
}

export type ExtractSchema = {
    sections   : CodeSection[] 
}

export type ExtractMessagesOptions = {
    type?       : "vue" | "react" | "svelte" | "html" | "astro" | "mdx" | "js" | "ts" | "jsx" | "tsx"
    language?   : Lang
    namespaces? : VoerkaI18nNamespaces
    file?       : string
    sections?   : CodeSection[] 
}
