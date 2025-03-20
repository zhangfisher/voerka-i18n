# Auto-importing Translation Functions

After using `voerkai18n compile`, you need to import the `t` translation function from `./languages` to perform translations.

```javascript
import { t } from "./languages"
```

By default, since the `t` function is located in the `/languages` folder of the current project, we have to use various relative imports to import the `t` translation function, which is both error-prone and unaesthetic, as shown below:

```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

It is recommended to use the `unplugin-auto-import` plugin for automatic imports, which can simplify the code.
