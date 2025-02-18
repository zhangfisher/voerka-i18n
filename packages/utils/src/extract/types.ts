import { Lang, NapiConfig, Range } from "@ast-grep/napi"
import { VoerkaI18nNamespaces } from "@voerkai18n/runtime" 


export type MessageNode = {
    message   : string
    rang      : { start: string, end: string }
    vars?     : string
    options?  : string
    namespace?: string
    file?     : string
} 

export type ExtractSection = {
    name?     : string,    
    type?     : 'ast' | 'regex',
    extract?  : RegExp | { exclude: RegExp | RegExp[], include: RegExp | RegExp[] },
    regex?    : RegExp,
    ast?      : NapiConfig
    language? : Lang
}

export type ExtractSections = ExtractSection[]  
 
export type ExtractMessagesOptions = {
    language?  :"js" | "ts" | "jsx" | "tsx" | "vue" | "react" | "svelte" | "astro" | "mdx" 
    namespaces : VoerkaI18nNamespaces
    file       : string 
    extractor? : "ast" | "regex"
}

export type ExtractorOptions = ExtractSection & { 
        file: string,
        namespaces: VoerkaI18nNamespaces
        sectionFlag: string
    }
