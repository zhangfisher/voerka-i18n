# Vue插件


在`vue3`项目中可以安装`@voerkai18n/vue`来实现`枚举语言`、`语言切换`等功能。

## **安装**

将`@voerkai18n/vue`安装为运行时依赖

```javascript
npm install @voerkai18n/vue
pnpm add @voerkai18n/vue
yarn add @voerkai18n/vue
```

## 启用插件

```javascript
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })   // 重点，需要引入i18nScope
    app.mount('#app')
```

插件安装成功后，在当前`Vue App`实例上`provide`一个`i18n`响应式实例。

## 注入`i18n`实例

接下来在组件中按需注入`i18n`实例，可以用来访问当前的`激活语言`、`默认语言`、`切换语言`等。

```javascript
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],    // 注入i18n实例，该实例由@voerkai18n/vue插件提供
  ....
}
</script>  
```

声明`inject: ['i18n']`后在当前组件实例中就可以访问`this.i18n`，该实例是一个经过`reactive`封闭的响应式对象，其内容是：

```javascript
this.i18n = {
  	activeLanguage,					// 当前激活语言，可以通过直接赋值来切换语言
    defaultLanguage,				// 默认语言名称
    languages						// 支持的语言列表=[{name,title},...]
}
```

## 应用示例

注入`i18n`实例后就可以在此基础上实现`激活语言`、`默认语言`、`切换语言`等功能。

```vue
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],    // 注入i18n实例，该实例由@voerkai18n/vue插件提供
  ....
}
</script>  
<template>
	<div>当前语言:{{i18n.activeLanguage}}</div>
	<div>默认语言:{{i18n.defaultLanguage}}</div>	
	<div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
			{{ lng.title }}        
	    </button>
    </div>
</templage>
```

### 插件参数

`@voerkai18n/vue`插件支持以下参数：

```javascript
import { i18nScope } from './languages'
app.use(i18nPlugin,{ 
    i18nScope,				// 重点，需要引入当前作用域的i18nScope
    forceUpdate:true		// 当语言切换时是否强制重新渲染
})   

```

- 当`forceUpdate=true`时，`@voerkai18n/vue`插件在切换语言时会调用`app._instance.update()`对整个应用进行强制重新渲染。大部分情况下，切换语言时强制对整个应用进行重新渲染的行为是符合预期的。您也可以能够通过设`forceUpdate=false`来禁用强制重新渲染，此时，界面就不会马上看到语言的切换，需要您自己控制进行重新渲染。