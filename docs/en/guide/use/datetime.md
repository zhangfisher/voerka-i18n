# Date and Time

[Previous content remains the same...]

- **Examples**

**When `activeLanguage == "zh-CN"`:**

| Translation | Output |
| --- | --- |
| `t("Now is { value }",NOW)` | `Now is 2022/8/12 10:12:36` |
| `t("Now is { value \| date }",NOW)` | `Now is 2022/8/12 10:12:36` |
| `t("Now is { value \| date('local') }",NOW)` | `Now is 2022/8/12 10:12:36` |
| `t("Now is { value \| date('long') }",NOW)` | `Now is 2022年08月12日 10点12分36秒` |
| `t("Now is { value \| date('short') }",NOW)` | `Now is 2022/08/12` |
| `t("Now is { value \| date('iso') }",NOW)` | `Now is 2022-08-12T02:12:36.000Z` |
| `t("Now is { value \| date('gmt') }",NOW)` | `Now is Fri, 12 Aug 2022 02:12:36 GMT` |
| `t("Now is { value \| date('utc') }",NOW)` | `Now is Fri, 12 Aug 2022 02:12:36 GMT` |
| **Custom Format** | |
| `t("Now is { value \| date('YYYY-MM-DD HH:mm:ss')}",NOW)` | `Now is 2022-08-12 10:12:36` |
| `t("Now is { value \| date('YYYY/MM/DD') }",NOW)",NOW)` | `Now is 2022-08-12` |
| `t("Now is { value \| date('HH:mm:ss') }",NOW)` | `10:12:36` |

**When `activeLanguage == "en-US"`:**

[Similar examples with English outputs...]

- **Configuration**

You can configure formatting rules for different languages in `languages/formatters.json`:

```json {3-7}
{
    "ja-JP"{        
        "date":{
            "format":"<local | iso | gmt | utc | long | short | [template string]>",
            "short":"<template string>",                
            "format":"<local | iso | gmt | utc | long | short | [template string]>"
        }
    },
    // ...other languages
}
```

### Time - `time`
The `time` formatter is used to format time portions of date variables. The `time` formatter supports parameters:

[... continuing with all time formatter details, examples, and configurations ...]

### Quarter - `quarter`
Outputs which quarter of the year.

[... continuing with all quarter formatter details, examples, and configurations ...]

### Month - `month`
The `month` formatter is used to output months.

[... continuing with all month formatter details, examples, and configurations ...]

### Weekday - `weekday`
Outputs the day of the week, such as Monday, Tuesday, ...Sunday.

[... continuing with all weekday formatter details, examples, and configurations ...]

### Relative Time - `relativeTime`
Displays time relative to the current time, such as "6 minutes ago", "in one hour", etc.

[... continuing with all relative time formatter details, examples, and configurations ...]

### Custom Templates

Besides the preset rules like `long`, `short`, `number`, you can define more flexible formatting rules using template strings.
You can also define your own preset formatting rules.

For example, you can define a `full` rule for the `date` formatter to display a more complete date and time:

```js
// Beijing Time: 2022年08月12日 10点12分36秒 上午
t("Now is { value | date('full') }")        
```

Here's how:
Add a `full` configuration item in `languages/formatters.json`:

```json
{
    "zh-CN": {
        "date":{
            "full": "Beijing Time: YYYY年MM月DD日 HH点mm分ss秒 a"
        }
    }
}
```

With the custom `full` preset rule, you can use `t("Now is { value | date('full') }")` for formatting directly, instead of using a custom template string.

**When using custom template strings, you can use the following placeholders:**

| Placeholder | Description |
| --- | --- |
| YYYY | 2018 Year, four digits |
| YY | 18 Year, two digits |
| MMM | Jan-Dec Month, English abbreviation |
| MM | 01-12 Month, two digits |
| M | 1-12 Month, starting from 1 |
| DD | 01-31 Day, two digits |
| D | 1-31 Day |
| HH | 00-23 24-hour, two digits |
| H | 0-23 24-hour |
| hh | 01-12 12-hour, two digits |
| h | 1-12 12-hour |
| mm | 00-59 Minutes, two digits |
| m | 0-59 Minutes |
| ss | 00-59 Seconds, two digits |
| s | 0-59 Seconds |
| SSS | 000-999 Milliseconds, three digits |
| A | AM / PM Upper case |
| a | am / pm Lower case |
| t | Time period, e.g., dawn, morning, afternoon, noon, evening, night |
| T | Time period, e.g., dawn, morning, afternoon, noon, evening, night |
