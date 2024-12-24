import { FlexFilter } from "flexvars"

// interface FlexFilter<T extends Record<string, any> = Record<string, any>> {
//     name?: string;
//     priority?: 'normal' | 'before' | 'after';
//     default?: T;
//     args?: (keyof T)[] | null;
//     configKey?: string;
//     next: (value: any, args: T, context: FlexFilterContext) => string | null | undefined;
//     onError?: FilterErrorHandler;
//     onEmpty?: FilterEmptyHandler;
// }

export type VoerkaI18nFormatter<Config extends Record<string,any>> = {
    name:string
    formatter:(value: any, args: any[], config: Config) => string
    languages:{
        [lang:string]:Config
    }
}