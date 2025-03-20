# Extract Text

## Overview

The `voerkai18n extract` command is used to extract text that needs translation from source files.

## Basic Usage

```shell
voerkai18n extract [options]
```

## Options

| Option | Description |
| --- | --- |
| `--entry <path>` | Language working directory, default is `src/languages` |
| `--debug` | Whether to enable debug mode |

## Extraction Rules

### Regular Text

The `voerkai18n extract` command uses regular expressions to extract text wrapped in `t("...")` from source files.

```javascript
t("VoerkaI18n is a very good internationalization solution")
t("VoerkaI18n is a very good internationalization solution{name}",{name:"tom"})
t("VoerkaI18n is a very good internationalization solution{}","tom")
```

After extraction, it will be saved to `languages/translates/messages/default.json`:

```json
{
    "VoerkaI18n是一个非常不错的国际化方案":{
        "en":"",
        "de":"",
        "jp":""
    }
}
```

### Paragraphs

The `voerkai18n extract` command will also extract text wrapped in `<Translate>` components.

```vue
<template>
    <div>       
        <Translate id="license">     
Copyright (c) [year] [copyright holder]
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </Translate>
    </div>
</template>
```

After extraction, it will be saved to `languages/translates/paragraphs/license.html`:

```html
<!-- 
    id:    license 
    scope:  
    file:  src\License\index.vue 
    rang:  3:8-8:12 
-->
<div language="zh-CN">
版权所有 (c) [年份] [版权持有者]
特此免费授予任何获得本软件及相关文档文件（以下简称"软件"）副本的人，不受限制地处理本软件的权限，包括但不限于使用、复制、修改、合并、发布、分发、再许可和/或出售本软件的副本，并允许获得本软件的人这样做，但须满足以下条件：
上述版权声明和本许可声明应包含在本软件的所有副本或重要部分中。
本软件"按原样"提供，不提供任何形式的明示或暗示的担保，包括但不限于对适销性、特定用途适用性和非侵权性的担保。在任何情况下，作者或版权持有者均不对任何索赔、损害或其他责任负责，无论是在合同、侵权或其他行为中产生的，还是与本软件或本软件的使用或其他交易有关的。
</div>
<div language="en-US">
Copyright (c) [year] [copyright holder]
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</div>
```

## Notes

1. The `voerkai18n extract` command will automatically merge new content with existing translations
2. Repeatedly executing the `voerkai18n extract` command is safe and won't cause loss of half-completed translations
3. The command will filter out comments before extraction
4. The command cannot handle template strings, for example, **t(`xx${xxx}xx`)** cannot be extracted correctly
