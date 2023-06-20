# Interpolation variable <!-- {docsify-ignore-all} -->

 `t` `voerkai18n` Function support ** Interpolation variable ** for passing in a mutable content.

The interpolation variables are `命名插值变量` and `位置插值变量`.

## Name the interpolation variable

You can use `{变量名称}` in the t function to represent a named interpolation variable.

```javascript
t("我姓名叫{name},我今年{age}岁",{name:"tom",age:12})
// 如果值是函数会自动调用
t("我姓名叫{name},我今年{age}岁",{name:"tom",age:()=>12})
```

The dictionary interpolation variable is enabled only when the `t` function has only two arguments and the th `2` argument is a `{...}` type, and the translation is automatically interpolated.

## Position interpolation variable

You can use an empty `{}` to represent a position interpolation variable in a `t` function.

```javascript
t("我姓名叫{},我今年{}岁","tom",12)
// 如果值是函数会自动调用
t("我姓名叫{},我今年{}岁","tom",()=>12})
// 如果只有两个参数，且第2个参数是一个数组，会自动展开
t("我姓名叫{},我今年{}岁",["tom",12])
//如果第2个参数不是{}时就启用位置插值。
t("我姓名叫{name},我今年{age}岁","tom",()=>12)
```


## Interpolation variable formatting

 `voerka-i18n` Support a powerful interpolation variable formatting mechanism. You can use `{变量名称 | 格式化器名称 | 格式化器名称(...参数) |...}` a syntax similar to the pipe operator in the interpolation variable to take the previous output as the next input, thus realizing the transformation of the variable value. This mechanism is `voerka-i18n` the basis for implementing multilingual support for plurals, currencies, numbers, and so on.

Let's assume that the following formatters are defined (see below if a formatter is defined) for example.

- ** UpperCase **: Convert characters to uppercase
- ** division **: The number is divided by a comma for every n digits, and an optional parameter is supported to divide the digits, such as `division(123456)===123,456`, `division(123456,4)===12,3456`
- ** mr **: Automatically add a Mr. salutation

```javascript
// My name is TOM
t("My name is { name | UpperCase }",{name:"tom"})

// 我国2021年的GDP是￥14,722,730,697,890
t("我国2021年的GDP是￥{ gdp | division}",{gdp:14722730697890})

// 支持为格式化器提供参数，按4位一逗号分割
// 我国2021年的GDP是￥14,7227,3069,7890
t("我国2021年的GDP是￥{ gdp | division(4)}",{gdp:14722730697890})

// 支持连续使用多个格式化器
// My name is Mr.TOM
t("My name is { name | UpperCase | mr }",{name:"tom"})

```

Each formatter is essentially a `(value)=>{...}` function of, and can ** Use the output of the previous formatter as the input to the next formatter ** have the following characteristics:

### Parameterless formatter

  When using a parameterless formatter, simply pass in the name. For example: `My name is { name | UpperCase}`

### With parameter formatter

  The formatter supports passing in parameters such as `{ gdp | division(4)}`, `{ date | format('yyyy/MM/DD')}`

  It is important to note that the parameters of the formatter can only support parameters of simple types, such as `数字`, `布尔型`, `字符串`.

  ** Array, object, and function arguments are not supported, nor are complex expression arguments. **

### Using multiple formatters in succession

  As you might expect, ** Use the output of the previous formatter as the input to the next formatter **.

   `｛data | f1 | f2 | f3(1)｝` Equivalent to ` f3(f2(f1(data)),1)`