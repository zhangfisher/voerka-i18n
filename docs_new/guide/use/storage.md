# 记住切换语言<!-- {docsify-ignore-all} -->

当我们使用`i18n.change(language)`切换语言时，往往需要记住最后切换的语言，并在每次打开应用时自动切换到上次的语言。

## 开箱即用

记住最后切换的语言功能在`voerkaI18n 2.0`中已经是开箱即用的。当我们在浏览器端切换语言时会自动记住最后切换的语言，并保存在`localStorage`，并在下次打开应用时自动切换到上次的语言。

**实现原理如下：**

打开`languages/index.(js|ts)`文件时，我们发现有一个`storage`参数：


```javascript
import storage  from "./storage"

const scope = new VoerkaI18nScope({    
    // ...
    storage,                      // 语言配置存储对象
    // ...
}) 

```

`storage`参数用来配置一个存储对象，当我们调用`i18n.change(language)`切换语言时，会自动将当前语言存储到`storage`对象中。

`languages/storage.(js|ts)`文件默认是将语言存储到`localStorage`中，打开`languages/storage.(js|ts)`，其内容如下：

```typescript

export default {
    get(key:string){
        if(globalThis.localStorage){
            return globalThis.localStorage.getItem(key)
        }
    },
    set(key:string,value:any){
        if(globalThis.localStorage){
            globalThis.localStorage.setItem(key,value)
        }
    },
    remove(key:string){
        if(globalThis.localStorage){
            globalThis.localStorage.removeItem(key)
        }
    }
}
```



## 定制配置

如果开箱即用的自动记住最后切换的语言功能不能满足需求，比如您不想将配置保存到`localStorage`。

当然，如果您不想使用`localStorage`，可以自定义一个存储对象，只需要实现`get`、`set`、`remove`三个方法即可。

其实现原理非常简单，只需要修改`languages/storage.(js|ts)`文件即可。

