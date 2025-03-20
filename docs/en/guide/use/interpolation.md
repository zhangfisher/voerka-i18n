# Interpolation Variables

The `t` function in `voerkai18n` supports **interpolation variables** for passing variable content.

There are two types of interpolation variables: `named interpolation variables` and `positional interpolation variables`.

## Named Interpolation Variables

You can use `{variable name}` in the t function to represent a named interpolation variable.

```javascript
t("My name is {name}, I am {age} years old",{name:"tom",age:12})
// If the value is a function, it will be automatically called
t("My name is {name}, I am {age} years old",{name:"tom",age:()=>12})
```

Dictionary interpolation variables are enabled only when the `t` function has exactly two parameters and the `2nd` parameter is of type `{...}`. Interpolation will be performed automatically during translation.

## Positional Interpolation Variables

You can use an empty `{}` in the `t` function to represent a positional interpolation variable.

```javascript
t("My name is {}, I am {} years old",["tom",12])
// If the value is a function, it will be automatically called
t("My name is {}, I am {} years old",["tom",()=>12])
// If there are only two parameters and the 2nd parameter is an array, it will be automatically expanded
t("My name is {}, I am {} years old",["tom",12])
// If the 2nd parameter is not {}, positional interpolation is enabled
t("My name is {name}, I am {age} years old",["tom",()=>12])
```

## Interpolation Variable Formatting

`voerka-i18n` supports a powerful interpolation variable formatting mechanism. You can use a pipe operator-like syntax in interpolation variables: `{variable name | formatter name | formatter name(...parameters) | ... }`. The output of the previous formatter becomes the input of the next one, enabling value transformation. This mechanism is the foundation for implementing plurals, currency, numbers, and other multilingual support in `voerka-i18n`.

Let's assume we have defined the following formatters (see later for how to define formatters) for examples.

- **UpperCase**: Converts characters to uppercase
- **division**: Splits numbers with commas every n digits, supports an optional parameter for split position, e.g., `division(123456)===123,456`, `division(123456,4)===12,3456`
- **mr**: Automatically adds "Mr." title

```javascript
// My name is TOM
t("My name is { name | UpperCase }",{name:"tom"})

// China's GDP in 2021 is ￥14,722,730,697,890
t("China's GDP in 2021 is ￥{ gdp | division}",{gdp:14722730697890})

// Supports providing parameters to formatters, split with comma every 4 digits
// China's GDP in 2021 is ￥14,7227,3069,7890
t("China's GDP in 2021 is ￥{ gdp | division(4)}",{gdp:14722730697890})

// Supports using multiple formatters consecutively
// My name is Mr.TOM
t("My name is { name | UpperCase | mr }",{name:"tom"})
```

Each formatter is essentially a `(value)=>{...}` function, and can **use the output of the previous formatter as the input for the next formatter**. Formatters have the following characteristics:

### Formatters Without Parameters

  When using formatters without parameters, you only need to pass the name. For example: `My name is { name | UpperCase }`

### Formatters With Parameters

  Formatters support parameter passing, like `{ gdp | division(4)}`, `{ date | format('yyyy/MM/DD')}`

  It's particularly important to note that formatter parameters can only support simple types like `numbers`, `booleans`, `strings`.

  **Arrays, objects, functions, and complex expression parameters are not supported.**

### Using Multiple Formatters Consecutively

  As you would expect, **the output of the previous formatter becomes the input for the next formatter**.

  `{data | f1 | f2 | f3(1)}` is equivalent to `f3(f2(f1(data)),1)`
