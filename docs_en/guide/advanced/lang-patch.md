# Language pack patch <!-- {docsify-ignore-all} -->

In practical applications, we often encounter such problems after the application goes online:
- Identify translation errors in the application
- Different customers may put forward different requirements for some words.
- Some customers even request to customize some display terms.

The general solution is to repackage the application and redistribute it, which is obviously a troublesome solution.

 `voerkai18n` The language pack patch feature provides a perfect solution to this problem, so you can fix translation errors at any time without repackaging the application.

** Basic idea: When a translation error is found after the application is launched, the language pack patch can be placed at the appointed location on the server, and the application will automatically update and repair, which is a very practical feature. **

## Guide


### Preparation
To illustrate how to use `语言包补丁` feature support, we will assume the following application: The application `chat`, which relies on `user` three libraries, `manager`, `log`, and so on, is used `voerkiai18n` as a multilingual solution. It is intended to support `zh` three languages, `en`, and `de`. When executed `voerkai18n compile`, the project structure is roughly as follows:
```javascript
chat
  |-- languages
  | |-- index.js
  | |-- idMap.js   
  | |-- runtime.js
  | |-- settings.json                  
  | |-- zh.js
  | |-- en.js
  | |-- formatters
  |     |-- zh.js
  |     |-- en.js
  | |-- translates
  |       |-- default.json
  |-- index.js
  |-- package.json                  //name=chat

```

Open `languages/index.js`, roughly as follows:
```javascript
// ....
const scope = new i18nScope({
    id: "chat",                          // 当前作用域的id，自动取当前工程的package.json的name
    messages:{ 
        "en" : ()=>import("./en.js"),
        "de" : ()=>import("./de.js")
    },
    //.....
}) 
/// ....
```
- You can see that `languages/index.js` an instance `id` of `i18nScope` the current project `package.json` `name` is created in, and it is automatically registered with the global `voerkaI18n` instance.

### Step 1: Register the default language loader

The language loader `voerkiai18n` is used to load language packs. In order to load language pack patches remotely from the server, a loader needs to be registered.
 
You need to import `i18nScope` the instance in the application (for example, `app.js` or `main.js`, etc.) Or directly in `languages/index.js` and register a default language loader.

```javascript

// 从当前工程导入`scope`实例
import { i18nScope } from "./languages"

// 注册默认的语言加载器
// 在此向服务器发起请求，请返回翻译后的其他语言文本
i18nScope.registerDefaultLoader(async (language,scope)=>{
    // language: 要切换到此语言
    // scope: 语言作用域实例   
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```


### Step 2: Write the language pack patch file

Suppose we find `zh` a language translation error, which requires a corresponding `zh` language pack patch file to be generated on the server. The method is very simple, open `languages/zh.js` the file, the file is roughly as follows:
```javascript
module.exports = {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
Make a copy of the changes and renames to `zh.json`, keeping only the items that need to be fixed, roughly as follows:
```javascript
{
    "1": "支持的语言",       
}
```
And then `zh.json` copy to `languages/chat/zh.json`. Similarly, if we want to fix `user` the translation errors of the three libraries, such as, `manager`, `log` and so on, such as the method of brewing, generating language pack files `languages/user/de.json`. `languages/manager/de.json` `languages/log/de.json`.

### Step 3: Organize the language pack patch file
In the above, we read the language pack by `fetch(/languages/${scope.id}/${language}.json)` (you can use any way you like, such as `axios`), which means we need to organize the language pack patches on the web server according to this `URL` so that they can be downloaded. The language pack patch needs to be saved in the specified location of the server, as follows:

```javascript
webroot
  |-- languages
    <chat>          
       |-- zh.json        
    <user>               
       |-- zh.json    
    <manager>                 
       |-- zh.json   
    <log>                 
       |-- zh.json               
```
### Complete: Automatic language package patching

At this point, the language pack patch feature has been configured. The patch is automatically loaded when the application is launched and incorporated into the language pack of the online application.
 ## Explain

- The language pack patch only works for the language being `settings.json` configured
- Language pack patches are automatically merged into the language pack in the source code at load time and are automatically cached locally `localStorage` to avoid late updates.
- How language packs are loaded from the server and where language pack patches are placed on the server is entirely up to the developer.

