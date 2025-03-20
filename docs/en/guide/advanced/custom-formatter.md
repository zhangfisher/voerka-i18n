# Custom Formatters

## Overview

`VoerkaI18n` supports a powerful interpolation variable formatting mechanism. You can use a pipe operator-like syntax in interpolation variables: `{variable name | formatter name | formatter name(...parameters) | ... }`. The output of the previous formatter becomes the input of the next one, enabling value transformation.

## Basic Usage

### Step 1: Create Formatter

A formatter is essentially a function that takes a value and returns a transformed value.

```ts
// Create a formatter that converts text to uppercase
const UpperCase = (value:string)=>value.toUpperCase()
```

### Step 2: Register Formatter

```ts
// languages/index.ts
import { VoerkaI18nScope } from "@voerkai18n/runtime"

const scope = new VoerkaI18nScope({
    // ...
    formatters:{
        UpperCase
    }
})
```

### Step 3: Use Formatter

```ts
t("My name is { name | UpperCase }",{name:"tom"})  // == My name is TOM
```

## Formatter Types

### Basic Formatter

Basic formatters are simple functions that take a value and return a transformed value.

```ts
// Basic formatter
const UpperCase = (value:string)=>value.toUpperCase()
```

### Formatter with Parameters

Formatters can accept parameters to control their behavior.

```ts
// Formatter with parameters
const division = (value:number,n:number=3)=>{
    // Add commas every n digits
    return value.toString().replace(new RegExp(`(\\d)(?=(\\d{${n}})+(?!\\d))`,'g'),"$1,")
}

// Usage
t("China's GDP in 2021 is ￥{ gdp | division(4)}",{gdp:14722730697890})
// == China's GDP in 2021 is ￥14,7227,3069,7890
```

### Language-Aware Formatter

Some formatters need to output different results based on the current language.

```ts
// Language-aware formatter
const weekday = (value:number,format:string="long")=>{
    const weekdays = {
        "zh-CN":{
            "long":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
            "short":["周日","周一","周二","周三","周四","周五","周六"],
            "narrow":["日","一","二","三","四","五","六"],
            "number":["0","1","2","3","4","5","6"]
        },
        "en-US":{
            "long":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "short":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
            "narrow":["S","M","T","W","T","F","S"],
            "number":["0","1","2","3","4","5","6"]
        }
    }
    // Get current language
    const language = VoerkaI18n.currentLanguage
    return weekdays[language][format][value]
}

// Usage
t("Today is { day | weekday('long') }",{day:1})
// When language is zh-CN: 今天是星期一
// When language is en-US: Today is Monday
```

### Formatter with Configuration

For complex formatters, you can configure them through `languages/formatters.json`.

```ts
// languages/formatters.json
{
    "zh-CN":{
        "weekday":{
            "long":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
            "short":["周日","周一","周二","周三","周四","周五","周六"],
            "narrow":["日","一","二","三","四","五","六"],
            "number":["0","1","2","3","4","5","6"]
        }
    },
    "en-US":{
        "weekday":{
            "long":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "short":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
            "narrow":["S","M","T","W","T","F","S"],
            "number":["0","1","2","3","4","5","6"]
        }
    }
}

// languages/index.ts
const weekday = (value:number,format:string="long")=>{
    // Get current language
    const language = VoerkaI18n.currentLanguage
    // Get formatter configuration
    const config = VoerkaI18n.getFormatterOptions("weekday")
    return config[language][format][value]
}
```

## Built-in Formatters

`@voerkai18n/formatters` provides many built-in formatters:

- **date**: Date formatting
- **time**: Time formatting
- **quarter**: Quarter formatting
- **month**: Month formatting
- **weekday**: Weekday formatting
- **currency**: Currency formatting
- **relativeTime**: Relative time formatting

For specific usage, see the corresponding documentation.
