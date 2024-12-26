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
import { MonthFormatterOptions, QuarterFormatterOptions, RelativeTimeFormatterOptions, TimeFormatterOptions, TimeSlotsFormatterOptions, WeekdayFormatterOptions } from "../../formatters"
import { CurrencyOptions } from "../../formatters/currency/types"
import { DateFormatterOptions } from "../../formatters/datetime/date"
import { FlexFilter } from "flexvars"
import { VoerkaI18nScope } from "../../scope"
import { Dict } from "../../types" 

 
export type VoerkaI18nFormatter<Args extends Dict = Dict> = FlexFilter<Args> & {
    global?  : boolean             // 是否全局格式化器，=true时，会在所有的scope中注册,默认为false
}

export interface VoerkaI18nFormatterConfigs {
    currency?    : Partial<CurrencyOptions>
    date?        : Partial<DateFormatterOptions>
    month?       : Partial<MonthFormatterOptions>
    quarter?     : Partial<QuarterFormatterOptions>
    time?        : Partial<TimeFormatterOptions>
    weekday?     : Partial<WeekdayFormatterOptions>
    timeSlots?   : Partial<TimeSlotsFormatterOptions>
    relativeTime?: Partial<RelativeTimeFormatterOptions>
}


export type VoerkaI18nFormatterCreator<
     Args extends Dict    = Dict,
     Config extends Dict = Dict
> = (options:{scope: VoerkaI18nScope,  getLanguageConfig: (configKey?:string)=>Config })=>VoerkaI18nFormatter<Args>
  

export interface VoerkaI18nFormatterBuilder<Args extends Dict = Dict> {
    (scope: VoerkaI18nScope):VoerkaI18nFormatter<Args> 
}
 
export type VoerkaI18nLanguageFormattersOptions = Record<string,VoerkaI18nFormatterConfigs>

// 实例化VoerkaI18nScope时传入的格式化器配置
export type VoerkaI18nFormatters = Record<string,VoerkaI18nFormatterBuilder> & {
    $config?: VoerkaI18nLanguageFormattersOptions
}
 