# Remember to switch languages <!-- {docsify-ignore-all} -->

When we use `i18n.change(language)` switching languages, we often need to remember the last language we switched and automatically switch to the last language every time we open the application.

## Out of the box

Keep in mind that the last language feature `voerkaI18n 2.0` you switched to works out of the box in. When we switch languages on the browser side, we automatically remember the last switched language and save it in `localStorage`, and automatically switch to the last language the next time we open the application.

** The implementation principle is as follows: **

When we open `languages/index.(js|ts)` the file, we find that there is a `storage` parameter:


```javascript
import storage  from "./storage"

const scope = new VoerkaI18nScope({    
    // ...
    storage,                      // 语言配置存储对象
    // ...
}) 

```

 `storage` The parameter is used to configure a storage object, and when we call `i18n.change(language)` to switch languages, it will automatically store the current language in the `storage` object.

By default, the `languages/storage.(js|ts)` file saves the language to `localStorage`, opens `languages/storage.(js|ts)`, and its contents are as follows:

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



## Custom configuration

If the out-of-the-box function of automatically remembering the last switched language does not meet the requirements, for example, you do not want to save the configuration to `localStorage`, you can customize a storage object and modify `languages/storage.(js|ts)` the file to implement `get` the three methods of, `set` and `remove`.
