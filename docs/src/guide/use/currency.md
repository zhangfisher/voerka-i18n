# 货币
## 概述

`voerkai18n`内置支持`currency`和`rmb`两个货币相关的格式化器，用来输出多语言场景下的货币显示。 


## 基本用法

当需要对货币本地化显示时，请使用相对应的格式化器，可以在`t`函数中使用来对`Number`类型进行本地化格式输出。

- **无参数(默认格式)** 
    ```javascript | pure
    t("{ value | currency}",1234.56)    // == ￥1234.56
    t("{ value | currency('long')}",1234.56)    // == 长格式输出： RMB￥1234.56元
    t("{ value | currency('short')}",1234.56)    // ==短格式输出 ￥1234.56
    await scope.change("en")
    t("{ value | currency}",1234.56)    // == $1,234.56
    t("{ value | currency('long')}",1234.56)    // == $1,234.56
    t("{ value | currency('short')}",1234.56)   // == USD $1,234.56
    
    ```
- **预定义格式** 
   内置支持`default`、`long` 、`short`、`custom`等预定义
- **无参数(默认格式)** 
    ```javascript | pure
    ```

- **指定对象参数**  
    ```javascript | pure
    ```


