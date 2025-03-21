import type { FlexFilter } from 'flexvars';
export type Dict<T = any> = Record<string, T>;
export type LanguageName = string;
export type VoerkaI18nFormatterContext<Config extends Dict = Dict> = {
    getConfig: () => Config;
    scope: any;
};
export type VoerkaI18nFormatter<
    Args extends Dict = Dict, 
    Config extends Dict = Args
> = FlexFilter<Args, VoerkaI18nFormatterContext<Config>> & {
    global?: boolean;
};
export type VoerkaI18nScope = any
 