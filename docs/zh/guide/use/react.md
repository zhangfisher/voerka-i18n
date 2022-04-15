# React应用

开发`React`应用一般可以采用`create-react-app`或`Vite+"@vitejs/plugin-react`工具来创建工程。

本节介绍如何为`Vite`+`@vitejs/plugin-react`创建的工程添加`voerkai18n`支持。

## 第一步：引入

```javascript
// 初始化工程
> voerka18n init
// 提取要翻译的文本到src/languages/translates/*.json
> voerkai18n extract
// 进行人工翻译或自动翻译(百度)
> voerkai18n translate --apikey xxxx --apiid xxxxx
// 编译语言包
> voerkai18n compile 
```

## 第二步：导入`t`翻译函数
无论采用何种工具创建`React`应用，均可以直接从`languages`直接导入`t`函数。

```javascript
import { t } from "./languages"
```
取决于您是从哪一个文件中导入，需要修改导入位置，可能类似这样：
```javascript
import { t } from "./languages"
import { t } from "../languages"
import { t } from "../../languages"
import { t } from "../../../languages"
```

导入`t`函数后就可以直接使用了。

## 第三步：自动导入`t`翻译函数

当源码文件非常多时，手动导入`t`函数比较麻烦，我们提供了`vite`和`babel`两个插件可以实现自动导入`t`函数。
如果应用是采用`Vite`+`@vitejs/plugin-react`创建的工程，则可以通过配置`@voerkai18n/vite`插件实现自动导入`t`函数。

详见`@voerkai18n/vite`插件介绍。


## 第四步：切换语言

最后，一般需要在应用中提供切换语言并自动重新渲染界面的功能。针对`React`应用，提供了`useVoerkaI18n`来实现此功能。


```jsx
// 如果没有在vite.config.js中配置`@voerkai18n/vite`插件，则需要手工导入t函数
import { t } from "./languages"
import { useVoerkaI18n } from "@voerkai18n/react"
export default App(){
    const { activeLanguage,changeLanguage,languages } = useVoerkaI18n()
	return (<div>
        <h1>{t("当前语言")}:{activeLanguage}</h1>
        <div> {
         	languages.map(lang=>{
              return (<button 
                          key={lang.name}
                          onclick={()=>changeLanguage(lang.name)}>
                          {lang.title}
                      </button>)
            })}
    	</div>             
    </div> )
```

## 小结

- `useVoerkaI18n`返回当前激活语言、切换语言函数、支持的语言列表。
- 如果需要在切换语言时进行全局重新渲染，一般需要在顶层`App组件`中使用此`hook`, 这样可以确保在切换语言时整个应用进行重新渲染。
- 一般切换语言的功能界面不会直接在`App组件`中使用，您可以使用一个专门的组件来切换语言。

