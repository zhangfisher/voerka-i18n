# 运行时

`@voerkai18n/runtime`是`voerkai18n`的运行时依赖，支持两种依赖方式。

## 源码依赖

  默认情况下，运行`voerkai18n compile`时会在`languages`文件下生成运行时文件`runtime.js`，该文件被`languages/index.js`引入，里面是核心运行时`ES6`源代码（`@voerkai18n/runtime`源码），也就是在您的工程中是直接引入的运行时代码，因此就不需要额外安装`@voerkai18n/runtime`了。

  此时，`@voerkai18n/runtime`源码就成为您工程是一部分。

## 库依赖

  当运行`voerkai18n compile --no-inline-runtime`时，就不会生成运行时文件`runtime.js`，而是采用`import "@voerkai18n/runtime`的方式导入运行时，此时会自动/手动安装`@voerkai18n/runtime`到运行依赖中。


## 如何选择

**那么应该选择`源码依赖`还是`库依赖`呢？**

问题的重点在于，在`monorepo`工程或者`开发库`时，`源码依赖`会导致存在重复的运行时源码。而采用`库依赖`，则不存在此问题。因此：

- 普通应用采用`源码依赖`方式，运行`voerkai18n compile `来编译语言包。
- `monorepo`工程或者`开发库`采用`库依赖`，`voerkai18n compile --no-inline-runtime`来编译语言包。



## 注意

- `@voerkai18n/runtime`发布了`commonjs`和`esm`两个经过`babel/rollup`转码后的`ES5`版本。

- 每次运行`voerkai18n compile`时均会重新生成`runtime.js`源码文件，为了确保最新的运行时，请及时更新`@voerkai18n/cli`

- 当升级了`@voerkai18n/runtime`后，需要重新运行`voerkai18n compile`以重新生成`runtime.js`文件。

  


