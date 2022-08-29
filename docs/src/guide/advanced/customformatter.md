# 格式化器

## 概念

格式化器是`voerkai18n`中引入的用来对翻译内容中的插值变量进行链式处理的一种机制，目的是为不同的语言下对内容中的插值变量进行动态处理。格式化器机制为`voerkai18n`中的日期时间、货币等多语言输出提供了强大灵活、可扩展、可配置的处理方案。

格式化器具有以下特点：

- 本质上是一个普通的同步函数
- 支持有参和无参两种调用方式
- 支持通过管道符`|`进行链式调用
- 格式化器函数最后一个参数是当前语言的格式化器配置参数`$config`
- 格式化器函数`this`指向`scope`实例

## 指南

### 格式化器函数

**每一个格式化器就是一个普通的同步函数**，不支持异步函数，格式化器函数可以支持无参数或有参数。

- 无参数的格式化器：`(value,$config)=>{....返回格式化的结果...}`。
- 带参数的格式化器：`(value,arg1,...,$config)=>{....返回格式化的结果...}`，其中`value`是上一个格式化器的输出结果。

格式化器函数的第一个参数是上一个格式化器的输出，最后一个参数是当前语言的格式化器配置参数`$config`。

**调用方式：**

```javascript | pure
t("商品价格：{ value | currency }",1234.88)         // 参数调用
t("商品价格：{ value | currency('long') }",1234.88)   /// 有参调用
t("商品价格：{ value | currency('long') | prefix('人民币') }",1234.88)   /// 有参调用且链式调用
t("商品价格：{ value | currency({ symbol:'￥￥',prefix:'人民币:',suffix:'元整',unit:2 }) } ")   /// 对象参数
```

### 类型格式化器

可以为每一种数据类型指定一个默认的格式化器，支持对`String`、`Date`、`Error`、`Object`、`Array`、`Boolean`、`Number`等数据类型的格式化。当插值变量传入时，如果有定义了对应的的类型格式化器，会默认调用该格式化器对数据进行转换。

比如我们定义对`Boolean`类型格式化器，

```javascript | pure
//languages/formatters/<语言名称>.js
export default  {
    // 只作用于特定数据类型的格式化器   
    $types:{
		Boolean:(value)=> value ? "ON" : "OFF"
    }
} 
t("灯状态：{status}",true)  // === 灯状态：ON
t("灯状态：{status}",false)  // === 灯状态：OFF
```

在上例中，如果我们想在不同的语言环境下，翻译为不同的显示文本，则可以为不同的语言指定类型格式化器

```javascript | pure
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
t("灯状态：{status}",true)  // === 灯状态：开
t("灯状态：{status}",false)  // === 灯状态：关
// 当切换到英文时
t("灯状态：{status}",true)  // === 灯状态：ON
t("灯状态：{status}",false)  // === 灯状态：OFF
```

**说明：**

- 类型格式化器是**默认执行的，不需要指定名称**。
- 当前作用域的格式化器优先于全局的格式化器。
- 类型格式化器仅在无参调用时才生效，当指定了其他格式化器时，类型格式化器无效，比如`t("灯状态：{status | xxx}",true)`时，上面定义的`$types.Boolean`就无效。


### 通用的格式化器

类型格式化器只针对特定数据类型，并且会默认调用。而通用的格式化器需要使用`|`管道符进行显式调用。

同样的，通用的格式化器定义在`languages/formatters/<语言名称>.js`中。

```javascript | pure

// languages/formatters/zh.js
export default {
    $config:{...},
    $types:{...},
    [格式化名称]:(value,$config)=>{.....}
}
// languages/formatters/en.js
export default {    
    $config:{...},
    $types:{....},
    [格式化名称]:(value,$config)=>{.....},
    [格式化名称]:(value,arg,$config)=>{.....}        
}
```

如果要注册在所有语言中均生效的，可以声明在`languages/formatters/en.js`中，因为所有语言均的默认`fallback`语言均是`en`

### 可配置

#### 引入配置机制

格式化器是一个普通的的同步函数，我们只需要针对不同的语言编写相对应的格式化器函数,当切换语言时，就会自动调用相应的格式化器函数进行格式化输出。
例如：我们开发一个转换数字的格式化器，在中文下显示`一、二、三`，在英文下显示`One、Two、Three`。
```javascript | pure
// languages/formatters/zh.js
export default  { 
    uppercase:(value)=> ["一","二","三"][value-1]
}
// languages/formatters/en.js
export default  { 
    uppercase:(value)=> ["One","Two","Three"][value-1]
}
```
上面这个格式化器非常简单，以至于为不同语言编写对应的语言格式化也是非常容易的，比如可以增加`de`语言。
```javascript | pure
// languages/formatters/de.js
export default  { 
    uppercase:(value)=> ["Eins", "zwei", "drei"][value-1]
} 
```
但是明显上面的格式化器还存在一些瑕疵,比如没有做类型检查，这样容易出错。因此，我们来增加相应的类型检查。
```javascript | pure
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
问题开始显现，`zh`和`en`两种语言中存在了同样的类型检查逻辑，如果要支持10种语言，就得重复同样的逻辑。
所以问题关键就是无法复用逻辑，而引入**格式化可配置机制**就是为了解决多语言场景下，格式化器的逻辑复用问题。

#### 实现机制

**格式化可配置机制**事实上很简单，就是两个关键步骤：

- **第一步：在每个语言格式化器文件，指定`$config`用来保存配置参数**
```javascript | pure

// languages/formatters/zh.js
export default  { 
    $config:{ .... }
}
// languages/formatters/en.js
export default  { 
    $config:{ .... }
}
``` 

- **第二步：在执行格式化函数时传入$config**

```javascript | pure

// languages/formatters/zh.js
export default  { 
    $config:{ .... },
    [格式化名称]:(value,...args,$config)=>{...}
}
// languages/formatters/en.js
export default  { 
    $config:{ .... }
    [格式化名称]:(value,...args,$config)=>{...}
}
```
当执行格式化器函数时，总是**将当前语言激活的格式化器声明中的$config作为最后一个参数传递给执行格式化器函数**。
这样格式化器函数就可以读取配置。

下面我们来重写`uppercase`格式化器:

```javascript | pure
// languages/formatters/en.js
export default  { 
    $config:{
        values:["One","Two","Three"]
    },
    uppercase:(value,$config)=>{
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
可以看到，引入配置机制后，只需要在`en`语言中定义格式化器，让该格式化器中与语言相关的参数从配置中读取，然后在其他语言中只需要声明$config就可以实现不同语言下的输出，逻辑得到重用。

#### **合并配置**

格式化器配置机制的重点在于：
**当切换语言时，`voerkai18n`会将当前`scope.activeFormaters`切换到对应的`languages/formatters/<语言名称>.js`，这样在执行格式化器函数时，就总是可以得到当前语言的格式化器配置。**

格式化器配置机制还支持配置的合并机制，在上例中，当我们切换到`de`语言时，`voerkai18n`会依次合并:
```javascript | pure
const finalConfig = deepMerge(    
    scope.global.formatters["en"].$config,      // 优先级最低
    scope.global.formatters["*"].$config,       
    scope.formatters["en"].$config,    
    scope.formatters["*"].$config,
    scope.global.formatters["de"].$config,
    scope.formatters["de"].$config              // 优先级最高
)
```

按照这样的合并机制，在扩展配置时就不需要指定所有配置项，只需要按需配置即可。

例如:`currency`格式化器的完整配置是：

```javascript | pure
export default {
    currency:{
        default       : "{symbol}{value}{unit}",
        long          : "{prefix} {symbol}{value}{unit}{suffix}", 
        short         : "{symbol}{value}{unit}",
        custom        : "{prefix} {symbol}{value}{unit}{suffix}", 
        format        : "default",
        //--
        units         : [""," thousands"," millions"," billions"," trillions"],    //千,百万,十亿,万亿
        radix         : 3,                       // 进制，即三位一进，中文是4位一进
        symbol        : "$",                     // 符号
        prefix        : "USD",                   // 前缀
        suffix        : "",                      // 后缀
        division      : 3,                       // ,分割位
        precision     : 2,                       // 精度
    }
}  
```
如果我们要增加`de`语言，则只需要配置`untis`,`symbol`,`prefix`等需要的参数即可、

### 查找格式化器

上节中，我们说只需要在`en`语言中定义格式化器，其他语言只需要配置就可以，原因就在于`en`语言是所有语言的默认回退语言（fallback）。

`voerkai18n`按以下顺序查找指定名称的格式化器：

- `scope.activeFormatters` ：当前语言中声明的，即`languages/formatters/<语言名称>.js`
- `scope.formatters[fallbackLanguage]` ： 当前语言的回退语言
- `scope.formatters["*"]` ： 声明在`languages/formatters/<语言名称>.js`中的`{"*":{....}}`
- `scope.global.formatters[activeLanguage]` ： 注册在Voerkai18n实例中的当前语言格式化器
- `scope.global.formatters[fallbackLanguage]` ：  注册在Voerkai18n实例中的当前语言回退语言的格式化器
- `scope.global.formatters["*"]`  ：  注册在Voerkai18n实例中的所有语言的格式化器

按照这样的搜索顺序，大部份语言的格式化器均只需要声明在`languages/formatters/en.js`中，然后为格式化增加可配置支持，然后只需要在其他语言的`languages/formatters/<语言名称>.js`声明一下配置就可以复用格式化器。


### 格式化器作用域

定义在`languages/formatters/<语言名称>.js`里面的格式化器仅在当前`i18nScope`实例中生效，也就是仅在当前作用域生效。

### 全局格式化器

定义在`@voerkai18n/runtime`里面的格式化器则全局有效，在所有场合均可以使用，但是其优先级低于`i18nScope`作用域内的同名格式化器。

目前内置的全局格式化器请参阅API参考

### 扩展格式化器

除了可以在当前项目`languages/formatters/<语言名称>.js`自定义格式化器和`@voerkai18n/runtime`里面的全局格式化器外，计划单列了`@voerkai18n/formatters`项目用来包含了一些不常用的格式化器。

目前`@voerkai18n/formatters`还是空项目，作为开源项目，欢迎大家提交贡献更多的格式化器。

## 开发格式化器

### 普通格式化器

普通格式化器就是一个很简单的同步函数，其输入是插值变量值或者上一个格式化器的输出。

**例:** 开发一个转换数字的格式化器，在中文下显示`一、二、三`，在英文下显示`One、Two、Three`

```javascript | pure
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

**注意：**
 - 普通格式化器是同步函数,不支持异步函数

### 变参格式化器

如果需要格式化器支持变参调用，像这样：
```javascript | pure
t("{value | uppercase}",1)  
t("{value | uppercase(a)}",2)  
t("{value | uppercase(a,b,c)}",3)  
```
那么就需要自己在格式化函数中处理，一般可以像这样：


```javascript | pure
// languages/formatters/zh.js
export default  { 
    uppercase:(value,...args)=>{
        // 最后后一个参数总是$config
        let $config = args[args.length-1]
        let params = args.slice(0,args.length-1)
        //....
    }
}
```

### Formatter

为简化编写格式化器函数时对输入值进行值检查、变参处理、默认值处理等通用逻辑，`voerkai18n`提供了`createFormater`和`Formatter`函数帮助创建格式化函数。

```javascript | pure
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
    sum: Formatter((value,a,b,c,$config)=>{
        // $config指向的是当前配置的sum
        return $config.format.replace("{result}",value + a + b + c)
    },{
        normalize:(value)=>parentInt(value),                      
        params:["a","b","c"],
        configKey:"sum" // 声明该配置化器的配置参数位置
    })
}
```
以上创建了一个名叫`sum`的格式化器，该格式化器支持3个参数，然后会计算`value`+`a`+`b`+`c`，然后输出`Sum={result}`。

```javascript | pure
t("{value | sum }",1)    //  a=0,b=0,c=0       
t("{value | sum(1)}",1)  //  a=1,b=0,c=0    
t("{value | sum(1,2)}",1)  //  a=1,b=2,c=0    
t("{value | sum(1,2,3)}",1)  //  a=1,b=2,c=3    
```

`Formatter`是`createFormater`的别名，其参数说明如下：

- **normalize**

  `Function`,可选,提供一个函数来对输入值进行规范化处理，并返回规范化后的值。如上例中需要输入参数是一个数字，因为就需要转换为数字。
- **params**

  `Array`,可选,用来声明该格式化器支持的参数列表。
  `params`的作用除了是用来声明该格式化器支持多少个参数外，`Formatter`还支持从配置中读取这些参数的默认值。
  如上例中在`$config.sum`中配置了`a`,`b`,`c`三个参数的默认值。

  **当指定`params`参数时**:
  - 格式化器函数总是可以接收到与`params`参数匹配的参数，并且最后一个参数是`$config`,格式化函数就不需要处理变参的情况了。
  - 接收到的参数已经自动填入了从`$config[configKey]`中读取到的默认值。

  **当没有指定`params`参数时**:
  - 格式化器函数接收到的是`(value,...args,$config)`,这就意味着，你需要自己处理变参的情况了。


  利用这个特性，我们就可以为不同语言下格式化器的默认参数。例如`currency`格式化器的`symbol`参数在不同语言下的值。如下：

    ```javascript | pure
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
- **configKey**

`configKey`用来指定当前格式化器函数的配置参数位置，上例中`configKey="sum"`，则`(value,a,b,c,$config)=>{....}`中传入的`$config`就是`scope.activeFormatterConfig.sum`，也就是`languages/formatters/en.js`中的`$config.sum`。

如果没有指定`configKey`，则传入`$config`值就是`scope.activeFormatterConfig`,此时就无法为`a`,`b`,`c`指定默认参数了。

### FlexFormatter

大部份情况下，使用`Formatter`就可以比较方便地创建格式化器了。
当某个格式化器的可配置参数很多时，如`currency`格式化器，支持`format`,`unit`,`precision`,`prefix`,`suffix`,`division`,`symbol`,`radix`共8个位置参数，用户可以通过以下方式调用：

 ```javascript | pure
    t("{ value | currency('long',1)}",1234.56)                 // 长格式: 万元
    t("{ value | currency('long',1,2,'人民币')}",1234.56)                 
    t("{ value | currency('long',1,2,'人民币','元',3,'')}",1234.56)               
```
如果我们只需要变更`symbol`参数，由于`symbol`参数是第七个参数，使用位置参数就不得不这样调用。

```javascript | pure          
    t("{ value | currency(,,,,,,,'￥')}",1234.56)               
```
很丑陋的，因此，我们希望支持像这样：
```javascript | pure          
    t("{ value | currency({symbol:'￥')}",1234.56)               
```
也就是说，格式化器即支持可选位置传参，也支持`{...}`传参，基于上述已经介绍的格式化机制，您完全可以自己来处理这样的参数处理功能。

而`FlexFormatter`则封装了这样的功能，其即支持可选位置传参，也支持`{...}`传参。用法如下：

```javascript | pure          
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
        configKey:"sum" // 声明该配置化器的配置参数位置
    })
}         
```
经过上述改造过，上例中的`sum`格式化器就可以支持以下方式进行调用：
```javascript | pure          
t("{value | sum }",1)    //  a=0,b=0,c=0       
t("{value | sum(1)}",1)  //  a=1,b=0,c=0    
t("{value | sum(1,2)}",1)  //  a=1,b=2,c=0    
t("{value | sum(1,2,3)}",1)  //  a=1,b=2,c=3    
t("{value | sum({a:1})}",1)  //  a=1,b=0,c=0    
t("{value | sum({a:1,b:2})}",1)  //  a=1,b=2,c=0    
t("{value | sum({a:1,b:2,c:3})}",1)  //  a=1,b=2,c=3    
```

## 部署格式化器

上面我们已经介绍了如何开发格式化器和配置相关，一般我们需要为特定语言的格式化器的配置和函数声明在`languages/formatters/<语言名称>.js`中，下面进一步介绍一下格式化器应该在哪里进行声明。

当使用`voerkai18n compile`后，项目结构中会生成`formatters`如下：

```javascript | pure
<myapp>
   |--src
   |  |-- languages 
          |-- formatters
          |   |-- zh.js
          |   |-- en.js
          |   |-- de.js
   ......    
```
您可以在`formatters`文件夹中的`zh.js`、`en.js`、`de.js`文件中**配置**或者**新增**自己的自定义格式化器。

当切换到指定的语言时，就会`voerkai18n`会切换到对应的`languages/formatters/<语言名称>.js`,从而该语言的格式化器生效，并且会按一下的顺序进行查找格式化器。

打开`languages/formatters/<语言名称>.js`内容大概如下：

```javascript | pure
export default  {
    $config:{
        // 在此配置各格式化器的参数
    }, 
    // 只作用于特定数据类型的格式化器   
    $types:{
		// [数据类型名称]:(value)=>{...},
        // [数据类型名称]:(value)=>{...},
    },        
    // 自定义的格式化器                 
    [格式化名称]:(value,...args,$config)=>{.....},
    [格式化名称]:(value,...args,$config)=>{.....},
    [格式化名称]:(value,...args,$config)=>{.....},
    //.....更多的格式化器.....
}
```

`languages/formatters/<语言名称>.js`中定义的格式化器会被注册到当有`i18nScope`实例中。如此，在多包工程中，其他包/库就无法共享当前应用的格式式化器。

因此，您想注册一个格式化器可以在所有库/包中均可以使用，则需要将格式器注册到全局`VoerkaI18n`实例中。方法有两种是：

- 指定`global=true`将该文件声明的所有格式化器均注册到全局中
```javascript | pure
export default  {
    $config:{...}, 
    $types:{... },        
    [格式化名称]:(value,...args,$config)=>{.....},
    //.........
}
```

- 在`global`对象明中声明的所有全局格式化器

```javascript | pure
export default  {
    $config:{...}, 
    $types:{... },        
    [格式化名称]:(value,...args,$config)=>{.....},
    global:{
        $config:{...}, 
        $types:{... },        
        [格式化名称]:(value,...args,$config)=>{.....},
    }
    //.........
}
```


