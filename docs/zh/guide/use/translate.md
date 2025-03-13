# 翻译组件

除了使用`t`函数外，在前端代码中推荐使用`<Translate>`组件替代`t`函数。

`Translate`组件与`t`函数的区别在于：

- `Translate`翻译组件可以在语言切换时自动重新渲染，而`t`函数不会。
- `Translate`翻译组件支持段落翻译，而`t`函数不支持。见[段落翻译](./paragraph)。
- `Translate`翻译组件一般会为翻译内容包裹一个`<span>`标签，而`t`函数仅返回一个字符串。
- `Translate`翻译组件支持在线编辑翻译内容进行提交，而`t`函数不支持。


:::warning 提示
一般我们在UI部份使用`<Translate>`翻译组件，而在脚本代码里使用`t`翻译函数。
比如在`Vue`的`template`部份使用`<Translate>`组件，而在`script`部份使用`t`函数。
:::

## 使用方法

### 第1步：配置框架支持

显然，`<Translate>`组件是需要框架支持的，如Vue组件，React组件，Svelte组件等，不同的前端框架组件实现是不一样的。

所以我们需要先配置框架支持，具体如何配置请参考对应的框架文档。

以`Vue 3`为例，我们需要执行`voerkai18n apply`命令来自动配置`Vue 3`框架支持。

```shell
> voerkai18n apply 
```

- 在`apply`命令中选择`Vue3`，会自动安装本配置`@voerkai18n/vue`支持.
- 更具体的配置详见[集成Vue 3](../integration/vue)。

### 第1步：导入组件

```ts
// 从当前语言文件夹导入翻译组件
import { Translate } from "<myapp>/languages"

```

无论是`React/Vue/Solid/Svelte`等框架，均是从可以使用`<Translate>`组件来进行翻译。


