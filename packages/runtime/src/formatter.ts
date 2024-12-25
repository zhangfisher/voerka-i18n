/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type { FlexFilter } from "flexvars";
import type { VoerkaI18nScope } from "./scope";
import { Dict } from "./types";

export type FormatterBuilder<
    Args extends Dict    = Dict,
    Options extends Dict = Dict
> = (options:{scope: VoerkaI18nScope,  getLanguageOptions: ()=>Options })=>FlexFilter<Args>

export function createFormatter<Args extends Dict = Dict,Options extends Dict = Dict>(
    builder  : FormatterBuilder<Args,Options>,
    options? : Record<string,Partial<Options>>
){
    return (scope: VoerkaI18nScope)=>{  
        return builder({
            scope,
            getLanguageOptions: ()=>{
                if(!options) return {} as Options
                const activeOptions =  Object.assign({},options?.en || {})
                Object.assign(activeOptions,options[scope.activeLanguage as string] || {}) 
                return activeOptions as Options
            }
        }) as unknown as FormatterBuilder<Args,Options>
    }    
}


 