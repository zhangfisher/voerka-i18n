/**
 * 
 * 提供格式化相关逻辑
 * 
 */
import type { VoerkaI18nScope,VoerkaI18nFormatter,VoerkaI18nFormatterBuilder, LanguageName, Dict } from "@voerkai18n/runtime";  


export function createFormatter<Args extends Dict,Config extends  Dict = Args>(
    formatter : VoerkaI18nFormatter<Args, Config>,
    configs?: Partial<Record<LanguageName,Partial<Config>>>
){
    return ((scope: VoerkaI18nScope)=>{
         const oldNext = formatter.next
        formatter.next = function (value, args, ctx) {
            const langConfig = ctx.getConfig as any // 语言包中的$config
            ctx.getConfig = () => {
                return Object.assign({},
                    configs?.[scope.activeLanguage],
                    langConfig(formatter.name),                    
                ) as Config;
            }
            return oldNext.call(this, value, args, ctx);
        }  
        return formatter as VoerkaI18nFormatter<Args, Config>
    }) as VoerkaI18nFormatterBuilder<Args,Config>
}
 