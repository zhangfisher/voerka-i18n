# 翻译变换

`VoerkaI18n`提供了一种翻译变换的机制,用来**对翻译结果进行变换**,转换为其他形式,如`Vue`的`ref`、`solidjs`的`solid`等，用于满足响应式渲染的需要。

:::warning 重点
`$t`函数代替`t`函数，用来返回一个响应式的翻译结果。
:::

## 使用方法

### 第1步：创建变换函数

在`src/languages`目录下创建`transform.ts`文件，用来存放翻译变换函数。

```ts {4}
export transform = (scope:VoerkaI18nScope) => {     
        // result是t函数的返回值   
        return (result:string)=>{             
            // return <变换后的结果>
        }
    }    
```

### 第2步：启用变换函数

修改`src/languages/index.{js|ts}`文件，启用变换函数。

```ts {1,4,7}
import { transform } from "./transform"

export const i18nScope = new VoerkaI18nScope({        
    transform,    // 翻译变换
    // ...
})
export const $t = i18nScope.$t
```

:::warning 提示
使用`$t`函数时，会先调用`t`函数，然后将结果传递给`transform`函数。`$t`等效于`transform(t(...))`。
:::

### 第3步：使用$t翻译函数

在组件中的某些场景可以使用`$t`函数代表`t`函数。

重点在于哪些场景需要使用`$t`函数，以及如何使用`$t`函数。要把握以下几个原则：

- **场景**：只有在需要响应式渲染的场景下使用`$t`函数。
- 不同的响应式框架，使用方式不同，如`Vue`的`ref`、`solidjs`的`signal`等。
- 一般情况下，`$t`函数用来返回一个响应式的翻译结果,如`Vue/ref`、`Solid/signal`等。

:::warning 重点
不同的响应式框架，`transform`的实现是不一样的。但均统一导出`$t`函数。
:::

## 工作原理

为了更好的理解翻译变换的使用方法，我们以`Vue`为例，来充分了解`翻译变换`的工作原理和使用方法。

### 分析问题

首先我们来看一个简单的`Vue`组件：

```vue
<template>
    <div>
        <p>{{ title }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { i18nScope } from 'languages'
const title = ref(i18nScope.t("title"))
</script>
```

在上面的代码中，我们使用了`ref`函数来创建一个响应式的`title`变量，然后使用`t`函数来翻译`title`。

然后，初学者可能会想到,当切换语言时, `Vue`会自动重新渲染`title`组件。

但是事实是不会的，因为虽然`title`是一个`ref`变量。但切换语言时，并没有修改`ref(title)`的值,也就不会触发`Vue`的重新渲染。因此，上面的代码并不能实现切换语言时自动重新渲染。

**如何解决这个问题呢？这就需要使用`$t`函数来解决。**

### 切换响应式

按上面的分析，**当切换语言时并没有修改`ref(title)`的值**,也就不会触发`Vue`的重新渲染。

因此，要解决此问题，**我们需要在语言切换时，更新`ref(title)`值，才会导致`Vue`组件的重新渲染。**

这样，解决方案就很明显了，我们响应`语言切换`事件。

```vue
<template>
    <div>
        <p>{{ title }}</p>
    </div>
</template>
<script setup>
import { ref, onMount } from 'vue'
import { i18nScope } from './languages' 

const title = ref(i18nScope.t("title"))

let subscriber
onMounted(()=>{
  subscriber = i18nScope.on('change',()=>{
    title.value = t('你好')
  })
})
onUnmounted(()=>{
  subscriber.off()
}) 

</script>
```

**说明：**

1. 在组件`onMounted`时，订阅`i18nScope`的`change`事件。
2. 在`change`事件中，更新`title`的值,触发`Vue`的重新渲染。
3. 在组件`onUnmounted`时，取消订阅`i18nScope`的`change`事件。

:::warning 重点
将响应式机制与语言切换事件结合，可以实现切换语言时自动重新渲染组件。
:::

### 引入翻译变换

考虑到类似的场景会出现在很多响应式框架中，我们可以将这个逻辑抽象出来，封装成一个`transform`函数,来简化此应用场景。

- 不同的响应式框架只需要实现相应的`transform`的实现即可。
- 由于响应式框架的工作原理和`API`均不同，`transform`的实现是不一样，但在`$t`函数的使用上是一样的。




 