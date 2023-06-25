# Interpolation variable <!-- {docsify-ignore-all} -->

 `t` `voerkai18n` Function support **Interpolation variable** for passing in a mutable content.

The interpolation variables are `Naming interpolation variables` and `Position interpolation variable`.

## Name the interpolation variable

You can use `{Variable}` in the t function to represent a named interpolation variable.

```javascript
t("My name is {name},{age} old this year",{name:"tom",age:12})
// If the value is a function, it will be automatically called
t("My name is {name},{age} old this year",{name:"tom",age:()=>12})
```

The dictionary interpolation variable is enabled only when the `t` function has only two arguments and the th `2` argument is a `{...}` type, and the translation is automatically interpolated.

## Position interpolation variable

You can use an empty `{}` to represent a position interpolation variable in a `t` function.

```javascript
t("My name is {name},{age} old this year","tom",12)
// If the value is a function, it will be automatically called
t("My name is {name},{age} old this year","tom",()=>12})
// If there are only two parameters and the second parameter is an array, it will automatically expand
t("My name is {name},{age} old this year",["tom",12])
// Enable position interpolation if the second parameter is not {}
t("My name is {name},{age} old this year","tom",()=>12)
```


## Interpolation variable formatting

 `voerka-i18n` Support a powerful interpolation variable formatting mechanism. You can use `{Variable | formatter | formatter(...args) |...}` a syntax similar to the pipe operator in the interpolation variable to take the previous output as the next input, thus realizing the transformation of the variable value. This mechanism is `voerka-i18n` the basis for implementing multilingual support for plurals, currencies, numbers, and so on.

Let's assume that the following formatters are defined (see below if a formatter is defined) for example.

- **UpperCase**: Convert characters to uppercase
- **division**: The number is divided by a comma for every n digits, and an optional parameter is supported to divide the digits, such as `division(123456)===123,456`, `division(123456,4)===12,3456`
- **mr**: Automatically add a Mr. salutation

```javascript
// My name is TOM
t("My name is { name | UpperCase }",{name:"tom"})

// The GDP in 2021 is ￥14,722,730,697,890
t("The GDP in 2021 is ￥{ gdp | division}",{gdp:14722730697890})

// Supports providing parameters for formatters, separated by 4-digit commas
// The GDP in 2021 is ￥14,7227,3069,7890
t("The GDP in 2021 is ￥{ gdp | division(4)}",{gdp:14722730697890})

// Supports continuous use of multiple formatters
// My name is Mr.TOM
t("My name is { name | UpperCase | mr }",{name:"tom"})

```

Each formatter is essentially a `(value)=>{...}` function of, and can **Use the output of the previous formatter as the input to the next formatter** have the following characteristics:

### Parameterless formatter

  When using a parameterless formatter, simply pass in the name. For example: `My name is { name | UpperCase}`

### With parameter formatter

  The formatter supports passing in parameters such as `{ gdp | division(4)}`, `{ date | format('yyyy/MM/DD')}`

  It is important to note that the parameters of the formatter can only support parameters of simple types, such as `number`, `boolean`, `string`.

  **Array, object, and function arguments are not supported, nor are complex expression arguments.**

### Using multiple formatters in succession

  As you might expect, **Use the output of the previous formatter as the input to the next formatter**.

   `｛data | f1 | f2 | f3(1)｝` Equivalent to ` f3(f2(f1(data)),1)`