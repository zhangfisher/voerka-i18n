# 翻译函数

## 概述

默认提供翻译函数`t`用来进行翻译。

```ts
export type VoerkaI18nTranslate =(
        message:string, 
        vars?:VoerkaI18nTranslateVars, 
        options?:VoerkaI18nTranslateOptions
    )=>string
```

**`t`函数可以从`languages/index.(js|ts)`文件中导入。**

```javascript 

// 从当前语言包文件夹index.js中导入翻译函数
import { t } from "<myapp>/languages"

// 不含插值变量
t("中华人民共和国")

// 位置插值变量
t("中华人民共和国{}","万岁")
t("中华人民共和国成立于{}年，首都{}",1949,"北京")

// 当仅有两个参数且第2个参数是[]类型时，自动展开第一个参数进行位置插值
t("中华人民共和国成立于{year}年，首都{capital}",[1949,"北京"]) 
 
// 当仅有两个参数且第2个参数是{}类型时，启用字典插值变量
t("中华人民共和国成立于{year}年，首都{capital}",{year:1949,capital:"北京"})

// 插值变量可以是同步函数，在进行插值时自动调用。
t("中华人民共和国成立于{year}年，首都{capital}",()=>1949,"北京")

// 对插值变量启用格式化器
t("中华人民共和国成立于{birthday | year}年",{birthday:new Date()})

```

## 特别注意

- 不要使用js的模板字符串来生成翻译内容，如t(`我是中国人，我喜欢%{car}`)是无效的。
- `t`函数是一个普通函数，只需要提供执行环境就可以进行翻译,所以在任意`React/Vue/Solid/Svelte`等框架中均可以使用`t`函数来进行翻译。
- `t`函数对要翻译的内容支持插值变量机制，可以用来实现复数等机制，详见[插值变量](./interpolation)。


## 初学者误区

:::warning
`t`函数仅是一个普通JS函数，当切换语言时并不会自动执行。
:::

```vue
<template>
    <div>
        <p>{{ t("你好") }}</p>
        <button @click="i18nScope.change('en-US')">切换语言</button>
    </div>
</template>
<script setup>
import { t,i18nScope } from "<myapp>/languages"
</script>
```

以上面`Vue`组件为例，当点击`切换语言`按钮时，`t`函数并不会自动执行，因为`t`函数仅是一个普通函数，没那么神奇。

**那么如何实现重新执行t函数？**

本质上，就是当切换语言时需要重新渲染组件，这样`t`函数才会重新执行。

因此，解决的办法就很简单了，只需要在语言切换后重新渲染组件即可。

```vue
<template>
    <div>
        <p>{{ t("你好") }}</p>
        <button @click="i18nScope.change('en-US')">切换语言</button>
    </div>
</template>
<script setup>
import { t,i18nScope } from "<myapp>/languages"
import { ref } from "vue"
const render = ref(0)
i18nScope.on("change",()=>{
    render.value++
})
</script>
```

这样，当切换语言时，`render`的值会发生变化，从而触发组件的重新渲染，`t`函数也会重新执行，从而实现了语言切换。

`t`函数是基本的翻译函数，不同的前端框架提供了相应的库来简化这个过程，包括`vue/vue2/svelte/nextjs/...`等。