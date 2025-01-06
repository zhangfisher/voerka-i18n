/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type { VoerkaI18nScope } from "@/scope";
import { Dict, LanguageName  } from "@/types";
import type { VoerkaI18nFormatter,  VoerkaI18nFormatterCreator } from "./types";  
import { VoerkaI18nFormatterBuilder } from './types';


export function createFormatter<
    Args extends Dict ,
    Config extends  Dict = Args
>(creator: VoerkaI18nFormatterCreator<Args,Config>,config?:Partial<Record<LanguageName,Partial<Config>>>){
    return ((scope: VoerkaI18nScope)=>{
        const formatter = creator(scope)  
        const oldNext = formatter.next
        formatter.next = function(value,args,ctx){
            const oldGetConfig = ctx.getConfig as any     
            ctx.getConfig = ():Config=>{    
                return Object.assign({},
                    oldGetConfig(formatter.name),
                    config?.[scope.activeLanguage] || {} 
                ) as Config
            }  
            return oldNext.call(this,value,args,ctx)
        }   
        return formatter  as VoerkaI18nFormatter<Args,Config>
    }) as VoerkaI18nFormatterBuilder<Args,Config>
}