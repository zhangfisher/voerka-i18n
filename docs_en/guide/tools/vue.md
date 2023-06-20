# Vue Plugin <!-- {docsify-ignore-all} -->


Can be installed `@voerkai18n/vue` in the `vue3` project to implement `枚举语言`, `变量注入`, `语言切换`, and so on.

## ** Installation **

 `@voerkai18n/vue` Install as Runtime Dependent

```javascript
npm install @voerkai18n/vue
pnpm add @voerkai18n/vue
yarn add @voerkai18n/vue
```

## Enable the plug-in

```javascript
    import { createApp } from 'vue'
    import Root from './App.vue'
    import i18nPlugin from '@voerkai18n/vue'
    import { i18nScope } from './languages'
    const app = createApp(Root)
    app.use(i18nPlugin,{ i18nScope })   // 重点，需要引入i18nScope
    app.mount('#app')
```

After the plug-in is installed successfully, place a `i18n` responsive instance on the current `Vue App` instance `provide`.

## Inject an `i18n` instance

Next, inject `i18n` instances on demand in the component, which can be used to access the current `激活语言`, `默认语言`, `切换语言`, and so on.

```javascript
<script>
import {reactive } from 'vue'
export default {
  inject: ['i18n'],    // 注入i18n实例，该实例由@voerkai18n/vue插件提供
  ....
}
</script>  
```

Once declared `inject: ['i18n']`, it is accessible `this.i18n` in the current component instance, which is a `reactive` closed, responsive object whose contents are:

```javascript
this.i18n = {
  	activeLanguage,					// 当前激活语言，可以通过直接赋值来切换语言
    defaultLanguage,				// 默认语言名称
    languages						// 支持的语言列表=[{name,title},...]
}
```

## Application example

After the instance is injected `i18n`, functions such as, `默认语言`, `切换语言` and can be implemented `激活语言` on this basis.

```javascript
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

## Plug-in parameters

 `@voerkai18n/vue` The plug-in supports the following parameters:

```javascript
import { i18nScope } from './languages'
app.use(i18nPlugin,{ 
    i18nScope,				// 重点，需要引入当前作用域的i18nScope 
})   

```
 