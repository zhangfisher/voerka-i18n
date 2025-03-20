# Remember Language Selection

When we use `i18n.change(language)` to switch languages, we often need to remember the last selected language and automatically switch to that language when the application is opened again.

## Out of the Box

The feature to remember the last selected language is available out of the box. When we switch languages in the browser, it automatically remembers the last selected language and saves it in `localStorage`, then automatically switches to that language the next time the application is opened.

**The implementation principle is as follows:**

When opening the `languages/index.(js|ts)` file, we find a `storage` parameter:

```javascript
import storage  from "./storage"

const scope = new VoerkaI18nScope({    
    // ...
    storage,                      // Language configuration storage object
    // ...
}) 
```

The `storage` parameter is used to configure a storage object. When we call `i18n.change(language)` to switch languages, it automatically stores the current language in the `storage` object.

By default, the `languages/storage.(js|ts)` file stores the language in `localStorage`. Opening `languages/storage.(js|ts)`, its content is as follows:

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
} as IVoerkaI18nStorage
```

## Custom Configuration

If the out-of-the-box automatic language remembering feature doesn't meet your needs, for example, if you don't want to save the configuration to `localStorage`, you can customize a storage object by modifying the `languages/storage.(js|ts)` file. You just need to implement the three methods: `get`, `set`, and `remove`.
