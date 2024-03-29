# Translation function<!-- {docsify-ignore-all} -->

By default, a translation function `t` is provided for translation. In general, `t` the function is declared in the `languages/index.(js|ts)` file generated by the execution `voerkai18n compile` command in the project directory.

```javascript 

// import t function
import { t } from "<myapp>/languages"

// Without interpolation variables
t("xxxxxxxx")

// Position interpolation variable
t("My name is {}","tom")
t("My name is {}，{} years old","tom",12)

// When there are only two parameters and the second parameter is of type [], automatically expand the first parameter for position interpolation
t("My name is {}，{} years old"",["tom",12]) 
 
// Enable dictionary interpolation variables when there are only two parameters and the second parameter is of type {}
t("My name is {name}，{year} years old",{year:1949,name:"tom"})

// The interpolation variable can be a synchronous function that is automatically called during interpolation.
t("My name is {name}，{year} years old",()=>12,"tom")

// Enable formatter for interpolation variables
t("My name is {name}，{birthday| year} years old",{birthday:new Date()})

```

**Special attention:**

- Do not use a JS template string to generate translations, as t ( `I like %{car}`) is not valid.
-  `voerkai18n` Uses regular expressions to extract the content to be translated, so it `t("")` can be used anywhere.
-  `t` A function is an ordinary function that can be translated only by providing an execution environment, so functions can be used `t` for translation in any `React/Vue/Solid/Svelte` framework.
- The `t` function supports the interpolation variable mechanism for the content to be translated, and can be used to implement mechanisms such as complex numbers. See [interpolation](./interpolation).


