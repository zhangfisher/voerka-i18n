# 自动导入翻译函数

使用`voerkai18 compile`后，要进行翻译时需要从`./languages`导入`t`翻译函数。

```javascript
import { t } from "./languages"
```

由于默认情况下，`voerkai18 compile`命令会在当前工程的`/languages`文件夹下，这样我们为了导入`t`翻译函数不得不使用各种相对引用，这即容易出错，又不美观，如下：

```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

作为国际化解决方案，一般工程的大部份源码中均会使用到翻译函数，这种使用体验比较差。

为此，我们提供了一个几个插件可以来自动完成翻译函数的自动引入，包括：

- `babel`插件
- `vite`插件

关于插件如何使用请参阅文档。