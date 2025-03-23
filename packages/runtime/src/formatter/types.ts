/**
 * 
 * 
 * formatters:{
 *     x1:(value,args,context)=>{ return value}
 *     x2:VoerkaI18nFormatter
 *     x3:VoerkaI18nFormatterBuilder
 *     $options: {  // 对原有的formatters进行配置
 *          en:{},
 *          zh:{}
 *      }  
 * }
 * 
 * 
 * 
 * 
 */

import { FlexFilter } from "flexvars"
import type { VoerkaI18nScope } from "@/scope"
import { Dict } from "@/types" 
 
export type VoerkaI18nFormatterContext<Config extends Dict = Dict> = {
    getConfig: ()=> Config
    scope:VoerkaI18nScope
}

export type VoerkaI18nFormatter<
    Args extends Dict =  Dict,
    Config extends  Dict = Args
> = FlexFilter<Args,VoerkaI18nFormatterContext<Config>> & {
    global?: boolean
}

export type VoerkaI18nFormatterName = string

export interface VoerkaI18nFormatterConfig extends Record<VoerkaI18nFormatterName,Record<string,any>>{}

export interface VoerkaI18nFormatterBuilder<
    Args extends Dict = Dict,
    Config extends Dict = Args
> {
    (scope: VoerkaI18nScope): VoerkaI18nFormatter<Args,Config> 
} 

// 实例化VoerkaI18nScope时传入的格式化器配置
export type VoerkaI18nFormatters =  any[][]
