# 自定义格式化器


当我们使用`voerkai18n compile`编译后，会生成`languages/formatters.js`文件，可以在该文件中自定义您自己的格式化器。

`formatters.js`文件内容如下：

```javascript | pure
module.exports = {
    // 在所有语言下生效的格式化器
    "*":{ 
        //[格式化名称]:(value)=>{...},
        //[格式化名称]:(value,arg)=>{...},
    },                                                
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{
		// [数据类型名称]:(value)=>{...},
        // [数据类型名称]:(value)=>{...},
    },                                          
    zh:{
        $types:{
            // 所有类型的默认格式化器
            "*":{                
            },
            Date:{},
            Number:{},
            Boolean:{ },
            String:{},
            Array:{

            },
            Object:{

            }
        },
        [格式化名称]:(value)=>{.....},
        //.....
    },
    en:{
        $types:{
            // [数据类型名称]:(value)=>{...},
        },
        [格式化名称]:(value)=>{.....},
        //.....更多的格式化器.....
    }
}
```

## 格式化器函数

**每一个格式化器就是一个普通的同步函数**，不支持异步函数，格式化器函数可以支持无参数或有参数。

- 无参数的格式化器：`(value)=>{....返回格式化的结果...}`。

- 带参数的格式化器：`(value,arg1,...)=>{....返回格式化的结果...}`，其中`value`是上一个格式化器的输出结果。

## 类型格式化器

可以为每一种数据类型指定一个默认的格式化器，支持对`String`、`Date`、`Error`、`Object`、`Array`、`Boolean`、`Number`等数据类型的格式化。

当插值变量传入时，如果有定义了对应的的类型格式化器，会默认调用该格式化器对数据进行转换。

比如我们定义对`Boolean`类型格式化器，

```javascript | pure
//formatters.js

module.exports = {
    // 在所有语言下只作用于特定数据类型的格式化器   
    $types:{
		Boolean:(value)=> value ? "ON" : "OFF"
    }
} 
t("灯状态：{status}",true)  // === 灯状态：ON
t("灯状态：{status}",false)  // === 灯状态：OFF
```

在上例中，如果我们想在不同的语言环境下，翻译为不同的显示文本，则可以为不同的语言指定类型格式化器

```javascript | pure
//formatters.js
module.exports = {
    zh:{
        $types:{
			Boolean:(value)=> value ? "开" : "关"
        }
    },
    en:{
      $types:{
		Boolean:(value)=> value ? "ON" : "OFF" 
      }
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

- 完整的类型格式化器定义形式

  ```javascript | pure
  module.exports = {
      "*":{
          $types:{...}
      },    
      zh:{
          $types:{...}
      },
      en:{
        $types:{....}
      }
  }
  ```

  在匹配应用格式化时会先在当前语言的`$types`中查找匹配的格式化器，如果找不到再上`*.$types`中查找。

- `*.$types`代表当所有语言中均没有定义时才匹配的类型格式化。

- 类型格式化器是**默认执行的，不需要指定名称**。

- 当前作用域的格式化器优先于全局的格式化器。

## 通用的格式化器

类型格式化器只针对特定数据类型，并且会默认调用。而通用的格式化器需要使用`|`管道符进行显式调用。

同样的，通用的格式化器定义在`languages/formatters.js`中。

```javascript | pure
module.exports = {
    "*":{
        $types:{...},
         [格式化名称]:(value)=>{.....},       
    },    
    zh:{
        $types:{...},
        [格式化名称]:(value)=>{.....},
    },
    en:{
      $types:{....},
      [格式化名称]:(value)=>{.....},
      [格式化名称]:(value,arg)=>{.....},        
    }
}
```

每一个格式化器均需要指定一个名称，在进行插值替换时会优先依据当前语言来匹配查找格式化器，如果找不到，再到键名为`*`中查找。

```javascript | pure
module.exports = {
    "*":{
		uppercase:(value)=>value
    },    
    zh:{
        uppercase:(value)=>["一","二","三","四","五","六","七","八","九","十"][value-1]
    },
    en:{
		uppercase:(value)=>["One","Two","Three","Four","Five","Six","seven","eight","nine","ten"][value-1]
    },
    jp:{
        
    }
}
// 当切换到中文时
t("{value | uppercase}",1)  // == 一
t("{value | uppercase}",2)  // == 二
t("{value | uppercase}",3)  // == 三
// 当切换到英文时
t("{value | uppercase}",1)  // == One
t("{value | uppercase}",2)  // == Two
t("{value | uppercase}",3)  // == Three
// 当切换到日文时，由于在该语言下没有定义uppercase格式式，因此到*中查找
t("{value | uppercase}",1)  // == 1
t("{value | uppercase}",2)  // == 2
t("{value | uppercase}",3)  // == 3
```

## 作用域格式化器

定义在`languages/formatters.js`里面的格式化器仅在当前工程生效，也就是仅在当前作用域生效。一般由应用开发者自行扩展。

## 全局格式化器

定义在`@voerkai18n/runtime`里面的格式化器则全局有效，在所有场合均可以使用，但是其优先级低于作用域内的同名格式化器。

目前内置的全局格式化器请参阅API参考

## 扩展格式化器

除了可以在当前项目`languages/formatters.js`自定义格式化器和`@voerkai18n/runtime`里面的全局格式化器外，单列了`@voerkai18n/formatters`项目用来包含了更多的格式化器。

作为开源项目，欢迎大家提交贡献更多的格式化器。
