/**
 * 
 * 提供格式化相关逻辑
 * 
 */
import type { VoerkaI18nScope } from "@/scope";
import { Dict, LanguageName  } from "@/types";
import type { VoerkaI18nFormatter } from "./types";  
import { VoerkaI18nFormatterBuilder } from './types';


export function createFormatter<Args extends Dict,Config extends  Dict = Args>(
    formatter: VoerkaI18nFormatter<Args, Config>,
    configs? : Partial<Record<LanguageName,Partial<Config>>>,
    defaultConfig? : Partial<Config>
){
    return ((scope: VoerkaI18nScope)=>{
        const oldNext = formatter.next
        formatter.next = function (value, args, ctx) {
            const langConfig = ctx.getConfig as any // 语言包中的$config
            ctx.getConfig = () => {
                return Object.assign({}, 
                    defaultConfig,
                    configs?.[scope.activeLanguage],                    
                    langConfig(formatter.name),                    
                ) as Config;
            }
            return oldNext.call(this, value, args, ctx);
        }  
        return formatter as VoerkaI18nFormatter<Args, Config>
    }) as VoerkaI18nFormatterBuilder<Args,Config>
}
 
