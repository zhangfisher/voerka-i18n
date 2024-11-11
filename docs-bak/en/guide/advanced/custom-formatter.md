# Formatter <!-- {docsify-ignore-all} -->

## Concept

Formatter is `voerkai18n` a mechanism introduced to chain the interpolation variables in the translated content, which aims to dynamically process the interpolation variables in the content for different languages. The formatter mechanism provides a powerful, flexible, extensible, and configurable processing scheme for `voerkai18n` multilingual output such as date, time, and currency in.

The formatter has the following characteristics:

- Is essentially an ordinary synchronization function.
- Supports both parameterized and parameterless calling methods
- Supports chained calls through the pipe character `|`
- The last argument to the formatter function is the formatter configuration parameter `$config` for the current language.
- Formatter function `this` points to `scope` instance

## Guide

### Formatter function

**Each formatter is a normal synchronization function.**. Async functions are not supported. Formatter functions can support no arguments or arguments.

- Parameterless formatter: `(value,args,$config)=>{....返回格式化的结果...}`.
- Formatter with parameters: `(value,args,$config)=>{....返回格式化的结果...}`, where `value` is the output of the previous formatter.

The first argument to the formatter function is the output of the previous formatter, and the last argument is the formatter configuration parameter `$config` for the current language.

**Call mode:**

```javascript
t("商品价格：{ value | currency }",1234.88)         // Invoke without parameters
t("商品价格：{ value | currency('long') }",1234.88)   /// Invoked with parameters
t("商品价格：{ value | currency('long') | prefix('人民币') }",1234.88)   /// Invoked with parameters and call chaining
t("商品价格：{ value | currency({ symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2 }) } ")   /// object

### Type formatter

You can specify a default formatter for each data type, and support formatting for `String`, `Date`, `Error`, `Object`, `Array` `Boolean` and `Number` other data types. When an interpolation variable is passed in, if a corresponding type formatter is defined, the formatter will be called by default to convert the data.

For example, if we define a `Boolean` type formatter,

```javascript
//languages/formatters/<language>.js
export default  {
    // Formatters that only apply to specific data types
    $types:{
		Boolean:(value)=> value ? "ON" : "OFF"
    }
} 
t("lamp status：{status}",true)  // === lamp status：ON
t("lamp status：{status}",false)  // === lamp status：OFF
```

In the above example, if we want to translate to different display text in different locales, we can specify the type formatter for different languages

```javascript
//languages/formatters/zh.js
export default  {
    $types:{
        Boolean:(value)=> value ? "开" : "关"
    }
} 
//languages/formatters/en.js
export default  {
    $types:{
	    Boolean:(value)=> value ? "ON" : "OFF" 
    }
} 
// 当切换到中文时
t("lamp status：{status}",true)  // === lamp status：开
t("lamp status：{status}",false)  // === lamp status：关
// 当切换到英文时
t("lamp status：{status}",true)  // === lamp status：ON
t("lamp status：{status}",false)  // === lamp status：OFF
```

**Explain**

- The type formatter is**executed by default, there is no need to specify a name**.
- The current scope's formatter takes precedence over the global formatter.
- Type formatters take effect only when called without parameters. Type formatters are invalid when other formatters are specified, such as `t("lamp status：{status | xxx}",true)` the one defined `$types.Boolean` above.


### Generic formatter

Type formatters are specific to a particular data type and are invoked by default. While a generic formatter requires an explicit call using a `|` pipe character.

Similarly, the generic formatter is defined `languages/formatters/<language>.js` in.

```javascript

// languages/formatters/zh.js
export default {
    $config:{...},
    $types:{...},
    [formatter name]:(value,args,$config)=>{.....}
}
// languages/formatters/en.js
export default {    
    $config:{...},
    $types:{....},
    [formatter name]:(value,args,$config)=>{.....},
    [formatter name]:(value,args,$config)=>{.....}        
}
```

If you want to register in all languages, you can declare `languages/formatters/en.js` in, because the default `fallback` language for all languages is `en`

### Configurable

#### Introduce a configuration mechanism

The formatter is a common synchronization function. We only need to write the corresponding formatter function for different languages. When the language is switched, the corresponding formatter function will be automatically called for formatted output. For example, we develop a formatter that converts numbers to display `一、二、三` in Chinese and display `One、Two、Three` in English.

```javascript
// languages/formatters/zh.js
export default  { 
    uppercase:(value)=> ["一","二","三"][value-1]
}
// languages/formatters/en.js
export default  { 
    uppercase:(value)=> ["One","Two","Three"][value-1]
}
```

The above formatter is so simple that it is very easy to write corresponding language formats for different languages, such as adding `de` languages.

```javascript
// languages/formatters/de.js
export default  { 
    uppercase:(value)=> ["Eins", "zwei", "drei"][value-1]
} 
```
However, it is clear that the above formatter still has some flaws, such as not doing type checking, which is error-prone. So let's add the appropriate type checking.

```javascript
// languages/formatters/zh.js
export default  { 
    uppercase:(value)=>{
        let index = parentInt(value)
        if(index<0 || index>3 || isNaN(index)) index = 0
         return ["一","二","三"][index]
    }
}
// languages/formatters/en.js
export default  { 
    uppercase:(value)=>{
        let index = parentInt(value)
        if(index<0 || index>3 || isNaN(index)) index = 0
         return ["One","Two","Three"][index]
    }
}
```
The problem is that `zh` `en` the same type checking logic exists in both languages, and if you want to support 10 languages, you have to repeat the same logic. Therefore, the key problem is that logic cannot be reused, and the introduction**Formatting configurable mechanism**is to solve the problem of logic reuse of formatters in multilingual scenarios.

#### Implementation mechanism

**Formatting configurable mechanism**In fact, it is very simple, that is, two key steps:

- Step**1: In each language formatter file, specify `$config` the configuration parameters**to be saved.
```javascript

// languages/formatters/zh.js
export default  { 
    $config:{ .... }
}
// languages/formatters/en.js
export default  { 
    $config:{ .... }
}
``` 

-**Step 2: Pass in $config when executing the formatting function**

```javascript

// languages/formatters/zh.js
export default  { 
    $config:{ .... },
    [formatter name]:(value,args,$config)=>{...}
}
// languages/formatters/en.js
export default  { 
    $config:{ .... }
    [formatter name]:(value,args,$config)=>{...}
}
```
When executing a formatter function, always**Pass $config from the current language-activated formatter declaration as the last argument to the execute formatter function**. O that the formatter function can read the configuration.

Let's rewrite `uppercase` the formatter:

```javascript
// languages/formatters/en.js
export default  { 
    $config:{
        values:["One","Two","Three"]
    },
    uppercase:(value,args,$config)=>{
        let index = parentInt(value)
        if(index<0 || index>3 || isNaN(index)) index = 0
         return $config.values[index]
    }
}
// languages/formatters/zh.js
export default  { 
    $config:{
        values:["一","二","三"]
    }
}
// languages/formatters/de.js
export default  { 
    $config:{
        values:["Eins", "zwei", "drei"]
    }
}
```

It can be seen that after the configuration mechanism is introduced, only the formatter needs to be defined in the `en` language, and the language-related parameters in the formatter are read from the configuration, and then the output in different languages can be realized only by declaration `$config` in other languages, and the logic is reused.

####**Merge Configuration**

The key point of the formatter configuration mechanism is that**when a language is switched, `voerkai18n` the current `scope.activeFormaters` is switched to the corresponding `languages/formatters/<language>.js`, so that when the formatter function is executed, the formatter configuration for the current language is always available.**

The formatter configuration mechanism also supports a merge mechanism for configurations, which in the example above, when we switch to a `de` language, `voerkai18n` will merge in turn:
```javascript
const finalConfig = deepMerge(    
    scope.global.formatters["en"].$config,       
    scope.global.formatters["*"].$config,       
    scope.formatters["en"].$config,    
    scope.formatters["*"].$config,
    scope.global.formatters["de"].$config,
    scope.formatters["de"].$config              
)
```

According to this consolidation mechanism, it is not necessary to specify all configuration items when extending the configuration, but only to configure them on demand.

For example, `currency` the complete configuration of the formatter is:

```javascript
export default {
    currency:{
        default       : "{symbol}{value}{unit}",
        long          : "{prefix} {symbol}{value}{unit}{suffix}", 
        short         : "{symbol}{value}{unit}",
        custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
        format        : "default",
        //--
        units         : [""," thousands"," millions"," billions"," trillions"],     
        radix         : 3,                       
        symbol        : "$",                     
        prefix        : "USD",                  
        suffix        : "",                    
        division      : 3,                      
        precision     : 2,                      
    }
}  
```
If we want to add a `de` language, we only need to configure `untis` the required parameters such as? `symbol` `prefix`?.

### Find the formatter

In the previous section, we said that only the formatter needs to be `en` defined in the language, and other languages only need to be configured, because `en` the language is the default fallback language for all languages.

Finds a formatter with the specified name `voerkai18n` in the following order:

-  `scope.activeFormatters`: declared in the current language, i.e `languages/formatters/<language>.js`.
- Fallback language for the `scope.formatters[fallbackLanguage]` current language
-  `scope.formatters["*"]`: Declared `languages/formatters/<language>.js` `{"*":{....}}` in
-  `scope.global.formatters[activeLanguage]`: The current language formatter registered in the Voerkai18n instance
- The formatter for the fallback language for the current language `scope.global.formatters[fallbackLanguage]` registered in the Voerkai18n instance.
-  `scope.global.formatters["*"]`: Formatter for all languages registered in Voerkai18n instances

According to this search order, most language formatters only need to be declared in `languages/formatters/en.js`, then add configurable support for formatting, and then reuse formatters only need to be declared and configured in other languages `languages/formatters/<language>.js`.


### Formatter scope

The formatters defined in `languages/formatters/<language>.js` it only take effect in the current `i18nScope` instance, that is, only in the current scope.

### Global formatter

A formatter defined `@voerkai18n/runtime` inside is globally valid and can be used in all cases, but its priority is lower than `i18nScope` that of the formatter of the same name in the scope.

For the current built-in global formatters, see the API reference.

### Extended formatter

In addition to the custom formatters in the current project `languages/formatters/<language>.js` and `@voerkai18n/runtime` the global formatters in it, the `@voerkai18n/formatters` plan lists the projects to include some of the less commonly used formatters.

At present `@voerkai18n/formatters`, it is still an empty project. As an open source project, you are welcome to submit and contribute more formatters.

## Develop the formatter

### Generic formatter

A plain formatter is simply a synchronization function whose input is either the interpolated variable value or the output of the previous formatter.

**Example:**Develop a formatter to convert numbers, display `一、二、三` in Chinese and display `One、Two、Three` in English.

```javascript
// languages/formatters/zh.js
export default  { 
    uppercase:(value)=> ["一","二","三"][value-1]
}
// languages/formatters/en.js
export default  { 
    uppercase:(value)=> ["One","Two","Three"][value-1]
}

// 当切换到中文时
t("{value | uppercase}",1)  // == 一
t("{value | uppercase}",2)  // == 二
t("{value | uppercase}",3)  // == 三

// 当切换到英文时
t("{value | uppercase}",1)  // == One
t("{value | uppercase}",2)  // == Two
t("{value | uppercase}",3)  // == Three

// 当切换到日文时，由于在该语言下没有定义uppercase，因此到`fallback`语言中查找
t("{value | uppercase}",1)  // == One
t("{value | uppercase}",2)  // == Two
t("{value | uppercase}",3)  // == Three
```

**Notice**
 - Normal formatters are synchronous functions and do not support asynchronous functions

### Variable parameter formatter

If you want the formatter to support variable parameter calls, look like this:
```javascript
t("{value | uppercase}",1)  
t("{value | uppercase(a)}",2)  
t("{value | uppercase(a,b,c)}",3)  
```
Then you need to handle it yourself in the formatting function, which can generally be like this:


```javascript
// languages/formatters/zh.js
export default  { 
    uppercase:(value,args,$config)=>{
        
    }
}
```

### Formatter

To simplify common logic such as value checking, variable parameter processing, and default value processing for input values when writing formatter functions, `voerkai18n` the `createFormater` and `Formatter` functions are provided to help create formatting functions.

```javascript
// languages/formatters/en.js
import { Formatter } from "../runtime"
export default  { 
    $config{
        sum:{
            a:0,
            b:0,
            c:0,
            format:"Sum={result}"
        },
    },    
    sum: Formatter((value,[a,b,c],$config)=>{
        // $config指向的是当前配置的sum
        return $config.format.replace("{result}",value + a + b + c)
    },{
        normalize:(value)=>parentInt(value),                      
        params:["a","b","c"],
        configKey:"sum" // Declare the configuration parameter location of this configurator
    })
}
```
The above creates a formatter called `sum`, which takes 3 arguments, then evaluates `value` + `a` + `b` + `c`, and then outputs `Sum={result}`.

```javascript
t("{value | sum }",1)    //  a=0,b=0,c=0       
t("{value | sum(1)}",1)  //  a=1,b=0,c=0    
t("{value | sum(1,2)}",1)  //  a=1,b=2,c=0    
t("{value | sum(1,2,3)}",1)  //  a=1,b=2,c=3    
```

 `Formatter` Is `createFormater` an alias for, and its parameters are described below:

-**normalize**

   `Function`. Optional. Provides a function to normalize an input value and return the normalized value. In the above example, the input parameter needs to be a number, because it needs to be converted to a number.
-**params**

   `Array`. Optional. Declares a list of parameters supported by the formatter. `params` In addition to declaring how many parameters the formatter supports, `Formatter` it also supports reading the default values of these parameters from the configuration. In the above example `$config.sum`, the default values of the `c` three parameters are configured `a` `b` in.

 **When you specify a `params` parameter**:
  - The formatter function can always receive an argument that matches the `params` argument, and the last argument is `$config`, so the formatter function doesn't have to deal with the argument change.
  - The received parameter has been automatically filled with the default value read from `$config[configKey]`.

 **When no parameter**is specified `params`:
  - What the formatter function receives is `(value,args,$config)`, which means that you need to handle the case of changing parameters yourself.


  Using this feature, we can specify the default parameters for the formatter in different languages. Uch as `currency` the values of the formatter's `symbol` parameters in different languages. As follows:

    ```javascript
    // languages/formatters/zh.js
    export default  { 
        $config:{
            currency：{
                symbol        : "￥"
            }
        }
    }
    // languages/formatters/en.js
    export default  { 
        $config:{
            currency：{
                symbol        : "$"
            }
        }
    }
    ```
-**configKey**

 `configKey` Used to specify the configuration parameter position of the current formatter function. In `configKey="sum"` the above example, what `(value,[a,b,c],$config)=>{....}` is passed in `$config` is `scope.activeFormatterConfig.sum`, that is, `languages/formatters/en.js` in `$config.sum`.

If not specified `configKey`, the value passed in `$config` is `scope.activeFormatterConfig` and you cannot specify a default parameter for `a`? `b` `c`?.

### FlexFormatter

In most cases, you can easily create a formatter by using `Formatter`. When a formatter has many configurable parameters, such as `currency` a formatter, Support `format` `unit` `precision` `prefix` `suffix` 8 positional parameters in `radix` `symbol` `division` total, which can be called by users in the following ways:

 ```javascript
    t("{ value | currency('long',1)}",1234.56)                  
    t("{ value | currency('long',1,2,'人民币')}",1234.56)                 
    t("{ value | currency('long',1,2,'人民币','元',3,'')}",1234.56)               
```
If we only need to change `symbol` the parameter, because `symbol` the parameter is the seventh parameter, the use of positional parameters has to be called like this.

```javascript          
    t("{ value | currency(,,,,,,,'￥')}",1234.56)               
```
It's ugly, so we want to support something like this:
```javascript          
    t("{ value | currency({symbol:'￥')}",1234.56)               
```
That is to say, the formatter supports both optional position and parameter passing `{...}`. Based on the formatting mechanism described above, you can handle such parameter handling function by yourself.

However `FlexFormatter`, it encapsulates such a function, which supports both optional position and parameter `{...}` transmission. The usage is as follows:

```javascript          
// languages/formatters/en.js
import { FlexFormatter } from "../runtime"
export default  { 
    $config{
        sum:{
            a:0,
            b:0,
            c:0,
            format:"Sum={result}"
        },
    },    
    sum: FlexFormatter((value,params,$config)=>{
        return $config.format.replace("{result}",value + params.a + params.b + params.c)
    },{
        normalize:(value)=>parentInt(value),                      
        params:["a","b","c"],
        configKey:"sum"  
    })
}         
```
After the above modification, the formatter in `sum` the above example can be called in the following ways:
```javascript          
t("{value | sum }",1)    //  a=0,b=0,c=0       
t("{value | sum(1)}",1)  //  a=1,b=0,c=0    
t("{value | sum(1,2)}",1)  //  a=1,b=2,c=0    
t("{value | sum(1,2,3)}",1)  //  a=1,b=2,c=3    
t("{value | sum({a:1})}",1)  //  a=1,b=0,c=0    
t("{value | sum({a:1,b:2})}",1)  //  a=1,b=2,c=0    
t("{value | sum({a:1,b:2,c:3})}",1)  //  a=1,b=2,c=3    
```

## Deploy the formatter

Above, we have introduced how to develop the formatter and configuration. Generally, we need to declare the configuration and function of the formatter for a specific language in `languages/formatters/<langauge>.js`. Here is a further description of where the formatter should be declared.

When used `voerkai18n compile`, the following will be generated `formatters` in the project structure:

```javascript
<myapp>
   |--src
   |  |-- languages 
          |-- formatters
          |   |-- zh.js
          |   |-- en.js
          |   |-- de.js
   ......    
```
You can do this in `formatters` the `zh.js`, `en.js`, `de.js` files**Configuration**in the folder, or**Add**in your own custom formatter.

When you switch to the specified language, `voerkai18n` it will switch to the corresponding `languages/formatters/<language>.js`, so that the formatter for that language will take effect, and the formatters will be looked up in the following order.

The opening `languages/formatters/<language>.js` content is roughly as follows:

```javascript
export default  {
    $config:{
        // Configure the parameters of each formatter here
    }, 
    // Formatters that only apply to specific data types
    $types:{
		// [datatype]:(value)=>{...},
        // [datatype]:(value)=>{...},
    },        
    // 自定义的格式化器                 
    [formatter name]:(value,args,$config)=>{.....},
    [formatter name]:(value,args,$config)=>{.....},
    [formatter name]:(value,args,$config)=>{.....},
    //.....更多的格式化器.....
}
```

The formatters defined `languages/formatters/<language>.js` in are registered with the current `i18nScope` instance. Thus, in a multi-package project, other packages/libraries cannot share the currently applied formatter.

Therefore, if you want to register a formatter that can be used in all libraries/packages, you need to register the formatter in the global `VoerkaI18n` instance. There are two methods:

- Specifies `global=true` that all formatters declared by the file are registered with the global
```javascript
export default  {
    global:true,                    
    $config:{...}, 
    $types:{... },        
    [formatter name]:(value,args,$config)=>{.....},
    //.........
}
```

- All global formatters declared in `global` the object manifest

```javascript
export default  {
    $config:{...}, 
    $types:{... },        
    [formatter name]:(value,args,$config)=>{.....},
    // All of the following are registered in the global 'VoerkaI18n' instance
    global:{
        $config:{...}, 
        $types:{... },        
        [formatter name]:(value,args,$config)=>{.....},
    }
    //.........
}
```


