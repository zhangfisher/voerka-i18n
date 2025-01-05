/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type { VoerkaI18nScope } from "@/scope";
import { Dict  } from "@/types";
import type { VoerkaI18nFormatter,  VoerkaI18nFormatterCreator } from "./types";




export function createFormatter<
    Args extends Dict = Dict,
    Config extends  Dict = Dict
>(creator: VoerkaI18nFormatterCreator<Args>,config?:Partial<Record<string,Partial<Config>>>){
    return (scope: VoerkaI18nScope)=>{  
        const formatter =  creator(scope) as unknown as VoerkaI18nFormatter<Args>
        if(config){
            const oldNext = formatter.next
            formatter.next = function(value,args,ctx){
                const oldGetFormatterConfig = ctx.getFormatterConfig
                // 读取当前语言的配置
                ctx.getFormatterConfig = <T = Dict>(configKey?:string)=>{
                    return Object.assign({},
                        config,
                        oldGetFormatterConfig(configKey)
                    ) as T
                }  
                return oldNext.call(this,value,args,ctx)
            }
        }
        return formatter
    }
}


 
