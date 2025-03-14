# 自动导入翻译函数

使用`voerkai18 compile`后，要进行翻译时需要从`./languages`导入`t`翻译函数。

```javascript
import { t } from "./languages"
```

由于默认情况下，`t`函数位于当前工程的`/languages`文件夹下，这样我们为了导入`t`翻译函数不得不使用各种相对引用，这即容易出错，又不美观，如下：

```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

建议使用`unplugin-auto-import`插件进行自动导入，可以简化代码。