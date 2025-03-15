import { Lang, NapiConfig, Range } from "@ast-grep/napi"
import { VoerkaI18nNamespaces } from "@voerkai18n/runtime" 


export type ExtractSection = {
    name?     : string,    
    type?     : 'ast' | 'regex',
    extract?  : RegExp | { exclude: RegExp | RegExp[], include: RegExp | RegExp[] },
    regex?    : RegExp,
    ast?      : NapiConfig
    language? : Lang
}

export type ExtractSections = ExtractSection[]  
 

export type ExtractorOptions = ExtractSection & { 
        file: string,
        namespaces: VoerkaI18nNamespaces
        sectionFlag: string
    }
