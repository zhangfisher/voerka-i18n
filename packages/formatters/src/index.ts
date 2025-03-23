import currencyFormatter from "./currency"
import numberFormatter from "./number"
import timeSlotsFormatter from "./datetime/timeSlots"
import dateFormatter from "./datetime/date"
import timeFormatter from "./datetime/time"
import weekdayFormatter from "./datetime/weekday"
import monthFormatter from "./datetime/month"
import quarterFormatter from "./datetime/quarter"
import relativeTimeFormatter from "./datetime/relativeTime" 

export default [
    currencyFormatter,
    numberFormatter,
    timeSlotsFormatter,
    dateFormatter,
    timeFormatter,
    weekdayFormatter,
    monthFormatter,
    quarterFormatter,
    relativeTimeFormatter
]