# 格式化器

## 概念

格式化器是`voerkai18n`中引入的用来对翻译内容中的插值变量进行链式处理的一种机制，目的是为不同的语言下对内容中的插值变量进行动态处理。格式化器机制为`voerkai18n`中的日期时间、货币等多语言输出提供了强大灵活、可扩展、可配置的处理方案。

格式化器具有以下特点：

- 本质上是一个普通的同步函数
- 支持有参和无参两种调用方式
- 支持通过管道符`|`进行链式调用
- 可以通过`$config`为格式化器传入配置参数

## 指南

### 格式化器函数

**每一个格式化器就是一个普通的同步函数**，不支持异步函数，格式化器函数可以支持无参数或有参数。

- 无参数的格式化器：`(value,$config)=>{....返回格式化的结果...}`。
- 带参数的格式化器：`(value,arg1,...,$config)=>{....返回格式化的结果...}`，其中`value`是上一个格式化器的输出结果。


格式化器函数的第一个参数是上一个格式化器的输出，最后一个参数是定义在`$config`中的配置参数。

**调用方式：**

```javascript | pure

t("商品价格：{ value | currency }")         // 参数调用
t("商品价格：{ value | currency('long') }")   /// 有参调用
t("商品价格：{ value | currency('long') | prefix('人民币') }")   /// 有参调用且链式调用

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

-  在匹配应用格式化时会先在当前语言的`$types`中查找匹配的格式化器。
- 类型格式化器是**默认执行的，不需要指定名称**。
- 当前作用域的格式化器优先于全局的格式化器。
- 当指定了其他格式化器时，类型格式化器就失败，比如`t("灯状态：{status | xxx}",true)`时，上面定义的`$types.Boolean`就无效。

### 通用的格式化器

类型格式化器只针对特定数据类型，并且会默认调用。而通用的格式化器需要使用`|`管道符进行显式调用。

同样的，通用的格式化器定义在`languages/formatters/<语言名称>.js`中。

```javascript | pure

// languages/formatters/zh.js
export default {
    $config:{...},
    $types:{...},
    [格式化名称]:(value)=>{.....},
}
// languages/formatters/en.js
export default {    
    $config:{...},
    $types:{....},
    [格式化名称]:(value)=>{.....},
    [格式化名称]:(value,arg)=>{.....},        
}
```

如果要注册在所有语言中均生效的，可以声明在`languages/formatters/global.js`

```javascript | pure
// languages/formatters/global.js
export default {    
    $config:{...},
    $types:{....},
    [格式化名称]:(value)=>{.....},
    [格式化名称]:(value,arg)=>{.....},        
}
```

```javascript | pure
// 当切换到中文时
t("{value | uppercase}",1)  // == 一
t("{value | uppercase}",2)  // == 二
t("{value | uppercase}",3)  // == 三

// 当切换到英文时
t("{value | uppercase}",1)  // == One
t("{value | uppercase}",2)  // == Two
t("{value | uppercase}",3)  // == Three

// 当切换到日文时，由于在该语言下没有定义uppercase，因此到global中查找
t("{value | uppercase}",1)  // == 1
t("{value | uppercase}",2)  // == 2
t("{value | uppercase}",3)  // == 3
```


### 自定义格式化器

当使用`voerkai18n compile`后，项目结构中会生成`formatters`如下：

```javascript | pure
<myapp>
   |--src
   |  |-- languages 
   |  |   |-- formatters
   |  |   |   |-- zh.js
   |  |   |   |-- en.js
   |  |   |   |-- de.js
    
   ....   
```
您可以在`formatters`文件夹中的`zh.js`、`en.js`、`de.js`文件中配置或者增加自己的自定义的格式化器。
 
`languages/formatters/<语言名称>.js`内容大概如下：

```javascript | pure
export default  {
    $config:{
        // 在此配置各格式化器的参数
    }, 
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{
		// [数据类型名称]:(value)=>{...},
        // [数据类型名称]:(value)=>{...},
    },                         
    // 自定义的格式化器                 
    [格式化名称]:(value,$config)=>{.....},
    [格式化名称]:(value,$config)=>{.....},
    [格式化名称]:(value,$config)=>{.....},
    //.....更多的格式化器.....
    
}
```

### 配置机制




### 格式化器作用域

定义在`languages/formatters/<语言名称>.js`里面的格式化器仅在当前工程生效，也就是仅在当前作用域生效。


### 全局格式化器

定义在`@voerkai18n/runtime`里面的格式化器则全局有效，在所有场合均可以使用，但是其优先级低于作用域内的同名格式化器。

目前内置的全局格式化器请参阅API参考

### 扩展格式化器

除了可以在当前项目`languages/formatters/<语言名称>.js`自定义格式化器和`@voerkai18n/runtime`里面的全局格式化器外，计划单列了`@voerkai18n/formatters`项目用来包含了一些不常用的格式化器。

目前`@voerkai18n/formatters`还是空项目，作为开源项目，欢迎大家提交贡献更多的格式化器。



## 开发格式化器

