# Automatically import translation function <!-- {docsify-ignore-all} -->

After use `voerkai18 compile`, you need to import `t` translation functions from `./languages` when you want to translate them.

```javascript
import { t } from "./languages"
```

By default, `t` the function is located in the folder of the `/languages` current project, so we have to use various relative references in order to import `t` the translation function, which is error-prone and not beautiful, as follows:

```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

As an internationalization solution, translation functions are used in most of the source codes of general projects, which is a poor experience.

To this end, we provide plug-ins to automatically import translation functions, including:

- [Babel插件](../tools/babel)
- [Vite插件](../tools/vite)

When the plug-in is enabled `babel/vite`, the functions are automatically imported `t` at compile time. See the documentation for how to use the plug-in.
