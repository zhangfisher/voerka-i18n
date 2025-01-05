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
import type { VoerkaI18nScope, VoerkaI18nScopeFormatterContext } from "@/scope"
import { Dict, LanguageName } from "@/types" 
 
export type VoerkaI18nFormatter<Args extends Dict = Dict> = FlexFilter<Args,VoerkaI18nScopeFormatterContext> & {
    global?  : boolean             // 是否全局格式化器，=true时，会在所有的scope中注册,默认为false
}

export interface VoerkaI18nFormatterConfig {

}

export type VoerkaI18nFormatterCreator<Args extends Dict = Dict> = (scope: VoerkaI18nScope)=>VoerkaI18nFormatter<Args>

export interface VoerkaI18nFormatterBuilder<Args extends Dict = Dict> {
    (scope: VoerkaI18nScope):VoerkaI18nFormatter<Args> 
}
 
export type VoerkaI18nLanguageFormatterConfigs = Record<LanguageName,VoerkaI18nFormatterConfig>

// 实例化VoerkaI18nScope时传入的格式化器配置
export type VoerkaI18nFormatters =  VoerkaI18nFormatterBuilder[]
 