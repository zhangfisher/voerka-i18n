/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type { VoerkaI18nScope } from "../../scope";
import { Dict } from "../../types";
import type { VoerkaI18nFormatter, VoerkaI18nFormatterCreator } from "./types";

export function createFormatter<Args extends Dict = Dict,Config extends Dict = Dict>(
    creator   : VoerkaI18nFormatterCreator<Args,Config>,
    config?  : Record<string,Partial<Config>> 
){
    return (scope: VoerkaI18nScope)=>{  
        return creator({
            scope,
            getLanguageConfig: (configKey?:string)=>{
                if(!config) return {} as Config
                const activeConfig =  Object.assign({},config?.en || {})
                Object.assign(activeConfig,config[scope.activeLanguage as string] || {}) 
                const scopeOpts = scope.options.formatters.$config || {}
                if(configKey && configKey in scopeOpts){
                    Object.assign(activeConfig,scopeOpts[configKey])
                }                
                return activeConfig as Config
            }
        }) as unknown as VoerkaI18nFormatter<Args>
    }
}


 
