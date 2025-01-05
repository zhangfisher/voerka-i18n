import { CurrencyFormatterConfig } from "./currency"
import { DateFormatterConfig } from "./datetime/date"
import { MonthFormatterConfig } from "./datetime/month"
import { QuarterFormatterConfig } from "./datetime/quarter"
import { RelativeTimeFormatterConfig } from "./datetime/relativeTime"
import { TimeFormatterConfig } from "./datetime/time"
import { TimeSlotsFormatterConfig } from "./datetime/timeSlots"
import { WeekdayFormatterConfig } from "./datetime/weekday"

export {}


declare module '@voerkai18n/runtime' {

    interface VoerkaI18nFormatterConfig {
        currency?    : Partial<CurrencyFormatterConfig>
        date?        : Partial<DateFormatterConfig>
        month?       : Partial<MonthFormatterConfig>
        quarter?     : Partial<QuarterFormatterConfig>
        time?        : Partial<TimeFormatterConfig>
        weekday?     : Partial<WeekdayFormatterConfig>
        timeSlots?   : Partial<TimeSlotsFormatterConfig>
        relativeTime?: Partial<RelativeTimeFormatterConfig>
    }
}