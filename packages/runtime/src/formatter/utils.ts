/**
 * 
 * 提供格式化相关逻辑
 * 
 */

import type { VoerkaI18nScope } from "@/scope";
import { Dict, LanguageName  } from "@/types";
import type { VoerkaI18nFormatter,  VoerkaI18nFormatterCreator } from "./types";  
import { VoerkaI18nFormatterBuilder } from './types';


export function createFormatter<Args extends Dict,Config extends  Dict = Args>(
    creator : VoerkaI18nFormatterCreator<Args,Config>,
    configs?: Partial<Record<LanguageName,Partial<Config>>>
){
    return ((scope: VoerkaI18nScope)=>{
        const formatter = creator(scope)  
        const oldNext = formatter.next
        formatter.next = function (value, args, ctx) {
            const oldGetConfig = ctx.getConfig as any
            ctx.getConfig = () => {
                return Object.assign({},
                    oldGetConfig(formatter.name),
                    configs?.[scope.activeLanguage]
                ) as Config;
            }
            return oldNext.call(this, value, args, ctx);
        }  
        return formatter as VoerkaI18nFormatter<Args, Config>
    }) as VoerkaI18nFormatterBuilder<Args,Config>
}

const addFormatter = createFormatter(()=>({
    name     : "add",
    args     : [ 'count' ],
    default  : {
        count: 1
    },
    next : (value,args,ctx)=>{   
        const config = ctx.getConfig()   
        return String(Number(value)+args.count)
    }
}))


const addFormatter2 = createFormatter((scope)=>({
    name     : "add",
    args     : [ 'count' ],
    default  : {
        count: 1
    },
    next : (value,args,ctx)=>{   
        const config = ctx.getConfig()    
        return String(Number(value)+args.count)
    }
}))
