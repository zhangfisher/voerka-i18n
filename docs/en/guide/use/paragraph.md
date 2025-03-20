# Paragraphs

In `VoerkaI18n 3.0`, the concept of paragraphs was introduced to handle multilingual processing of **large text blocks**.

## Usage

Here's how to use paragraph translation:

### Step 1: Wrap Paragraphs

Paragraphs need to be wrapped using the `Translate` component, not `t`, as follows:

```ts {4-7}
<template>
    <div>       
        <Translate id="license">     // [!code ++]
Copyright (c) [year] [copyright holder]
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </Translate> // [!code ++]
    </div>
</template>

<script setup>
import { Translate } from "./languages"
</script>
```

:::warning Important
Paragraph translation must use the `Translate` component for wrapping, not `t`. And you need to **specify an `id` attribute** to uniquely identify the paragraph.
:::

### Step 2: Extract Paragraphs

When executing the `voerkai18n extract` command, it will automatically extract the paragraph content from `<Translate>` components and save it to `languages/translates/paragraphs/*.html`.

<lite-tree>
myapp
    languages
        settings.json                   // Language configuration file        
        translates                      // This folder contains all content that needs translation
            messages/                   // Regular text content
            paragraphs/                 //! Paragraph content
                license.html            //!
                xxx.html               //!
        ...
    package.json
    index.js
</lite-tree>

The content of `languages/pagagraph<paragraph id>.html` looks something like this:

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
<div language="ru-RU">
[Russian translation would go here]
</div>
```

The `languages/pagagraph<paragraph id>.html` file contains all content that needs translation, with each paragraph corresponding to a `<div>` tag. The `language` attribute specifies the language, and the content within the `<div>` tag is what needs to be translated.

### Step 3: Translation

Next, you can use the `voerkai18n translate` command to translate the files in `languages/translates/paragraphs/*.html`.

```bash
> voerkai18n translate
```

After execution, the files in `languages/translates/paragraphs/*.html` will be translated into the corresponding languages.

### Step 4: Compilation

Finally, execute the `voerkai18n compile` command to compile the translated content into the `languages/pagagraphs/` folder.
