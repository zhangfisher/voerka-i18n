# Dynamically add language support <!-- {docsify-ignore-all} -->

## Foreword
 `voerkaI18n` By default, the text content to be translated is saved in the current `languages` folder after being compiled. When the application is packaged, it will be packaged into the project source code together with the project. This leads to the following problems:
- Language package translation is part of the source code project. When there are many languages to be translated, the size of the source code package will be increased.
- If translation problems are found after the product is launched, the whole project needs to be repackaged.
- To add a language after going online, you also need to go through the packaging process again.

 `voerkaI18n` To solve these problems, it supports the function of remote loading of language packs, and can support online `dynamic add language support`, `language pack patch` and other features.


## How to use

### Preparation

To illustrate how the mechanism for remotely loading language packs can be used to dynamically add language support to an application, we will consider an application `chat` that depends on `user` `manager` `log` three libraries, All used `voerkiai18n` as a multilingual solution. When implemented `voerkai18n compile`, the project structure is roughly as follows:
```javascript
chat
  |-- languages
  | |-- index.js
  | |-- idMap.js   
  | |-- runtime.js
  | |-- settings.json                  
  | |-- cn.js
  | |-- en.js
  |    |-- translates
  |       |-- default.json
  |-- index.js
  |-- package.json                  //name=chat

```
Open `languages/index.js`, roughly as follows:

```javascript
// ....
const scope = new i18nScope({
    id: "chat",                           
    messages:{ 
        "en" : ()=>import("./en.js")
    },
    //.....
}) 
/// ....
```
- You can see that `languages/index.js` an instance `id` of `i18nScope` the current project `package.json` `name` is created in, and it is automatically registered with the global `voerkaI18n` instance.
- An asynchronous loader was created for `en` the language to load `en` language packs asynchronously.
- When packaging `chat` an application, `zh.js` language packages such as, `en.js`, and so on are all packaged as part of the source code, except that the non-default language `en.js` is `chunk` packaged separately so that it can be loaded asynchronously.

** Assume below **? When the application goes online, the customer requests to add a `de` language, but our source code package does not include `de` the language. `voerkiai18n` The language loader function can be used to realize `Dynamically adding languages` the function more conveniently.

### Step 1: Register the default language loader

The language loader `voerkiai18n` is used to load the language pack. The default language pack is packaged into the source code in a static way, while the non-default language is loaded in an asynchronous way.
When a default language pack loader is registered, if you switch to an unregistered language, the default language pack loader is called to get the language pack. This feature can be used to dynamically add language support to the application at any time.

First, you need to import `i18nScope` the instance in the application (for example, `app.js` or `main.js`, etc.), or register a default language loader directly `languages/index.js`.

```javascript

import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    // language: target language
    // scope: i18nScope instance
    // Send a request to the server here, please return the translated text in another language
    return {.....}
})
```

### Step 2: Write the language package loader

From here, we can make an asynchronous request to the server to read the language pack file.

```javascript


import { i18nScope } from "./languages"

i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```

The language loader function needs to return the language pack in JSON format, roughly as follows:
```json
{
    "1":"xxxxx",
    "2":"xxxxx",
    "3":"xxxxx",
    //....
}
```

### Step 3: Save the language pack file to the server

In the previous step, we read the language pack by `fetch(/languages/${scope.id}/${language}.json)` passing it (you can use any way you like, such as `axios`), which means we need to organize the language pack on the web server according to this `URL` so that it can be downloaded. For example, it can be organized as follows:
```javascript
webroot
  |-- languages
    <chat>          
       |-- de.json        
    <user>               
       |-- de.json    
    <manager>                 
       |-- de.json   
    <log>                 
       |-- de.json               
```

 `voerkaI18n` Leave it up to the developer to write ** How to language loader ** and ** How to organize language packs on the server ** edit. You can decide how to organize language packs, where they are on the server, and how to load them according to your preferences. You can even use a database to store language packs, and then write an editing interface for them so that users can modify them.


### Step 4: Generate Language Pack File

In this example, we want to add `de` languages, which requires generating a corresponding `de` language pack file on the server. The method is very simple, open `languages/cn.js` the file, the file is roughly as follows:
```javascript
module.exports = {
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
Make a copy of the amended and renamed to `de.json`, the contents of which are summarized as follows:
```javascript
{
    "1": "支持的语言",
    "2": "默认语言",
    "3": "激活语言",
    "4": "名称空间s",
    ....
}
```
And then `de.json` copy to `languages/chat/de.json`. Similarly, we also need to `user` brew the language files of the three libraries, such as, `manager`, `log` and so on. Language pack files `languages/user/de.json` `languages/manager/de.json` `languages/log/de.json` are generated so that these three libraries can also support `de` extended languages.

### Step 5: Write a language package patch

So far, we've implemented the ability to dynamically add language support to an application. But the default language loader only works for unknown languages, not the built-in languages. That is, the built-in languages `zh` and `en` in the example above cannot be loaded by this method.

In practical applications, we often find a certain language translation error in the online application, at this time, we can use `voerkaI18n` the language package patch feature to solve this problem. With `voerkaI18n` the language pack patch feature, you can fix translation errors at any time without repackaging the application.

The `voerkaI18n` language pack patch feature also works by using the default language loader to load language pack patches. The working principle is simple, as follows:
- Register the default language loader as in the example above
- When `i18nScope` registered to the global `VoerkaI18n`, the default language loader is invoked to load the language pack from the server, and then **Merge into local language pack** the ability to patch the language pack is easily implemented.

In this example, we assume that `chat` a translation error is found in the Chinese language of the application and a language pack patch is needed to fix it. The method is as follows:
```javascript
webroot
  |-- languages
    <chat>
       |-- zh.json    

```
As described in the above example, edit a `zh.json` file on the server and save it to `languages/char/zh.json`. The contents in the file only need to include the content of the error repair, and it will be automatically merged into the target language pack. The whole process is insensitive to the user.

```javascript
{
    "4": "名称空间"
}
```
Then, when the application switches to the specified `zh` language, the language pack merged into the source code is downloaded, thus implementing the function of patching the language pack and fixing the translation error. **This feature is simple and practical and is highly recommended.**

### Brief summary

 - When a default language loader is registered, the default text loader is invoked to load language text from the server when switching to an unconfigured language.
 - For configured languages, the ability to patch language packs is implemented by loading the merge from the server at registration time.
 - You need to organize and store the matching language pack files on the server yourself, and then load them from the server by `fetch/axios` writing and so on.
 

## Guide

### Language package loader

Language loader is a generic `异步函数` or `返回Promise` function that can be used to load language pack files remotely.

The language loader passes in two parameters:
|Parameter| description |
| --- | --- |
|** language **| target language|
| **scope** |A language-scoped instance where the `scope.id` value defaults equal to `package.json` the `name` field in. See for [ref](../../reference/i18nscope) details.|

- A typical language loader is very simple, as follows:
```javascript
import { i18nScope } from "./languages"
i18nScope.registerDefaultLoader(async (language,scope)=>{
    return await (await fetch(`/languages/${scope.id}/${language}.json`)).json()
})
```
- Why write your own language loader instead of providing functionality out of the box? The main reason is that writing a language loader is simple, simply reading the JSON language pack file from the server using HTTP without any difficulty, and you can even use the above example directly. The key is that how the language package is organized and stored on the server can be decided by the application developers themselves. For example, developers can simply store language packs in database tables so that they can extend other functions. In addition, considering security, compatibility and other reasons, `voerkaI18n` it is left to the developers to write their own.
  

### Writing language switching interface

When writing a language switching interface, unregistered languages cannot be enumerated and need to be processed by the application itself. For example in a Vue application

```javascript
   	<div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
			{{ lng.title }}        
	    </button>
    </div>
```

Again, in this example, the Vue application above cannot enumerate `de` languages because they were not defined during the development phase.

We need to make simple extensions to the UI so that we can switch when we dynamically add languages in the future, such as:

```html
<template> 
    <div>
        <button 
            @click="i18n.activeLanguage=lng.name" 
            v-for="lng of i18n.langauges">
            {{ lng.title }}        
        </button>
        <!-- Expected languages to be supported -->
        <button  @click="i18n.activeLanguage=lng.name" 
            v-for="lng of ['de','jp',.......]">
            {{ lng }} 
        </button>
    </div>
</template>
```
By writing the appropriate language switching interface, you can add language support online at any time later.

###  `scope.id` Parameter

**Important: Why pass `scope.id` parameters to the server?** In a multi-package environment, each library or package has a **Unique ID** `name` field that, according to the specifications for multi-package/library development, is used `package.json` by default.

**For example**：

- Applications `A` that rely on packages/libraries `X`, `Y`, `Z` and `A/X/Y/Z` are used `voerkiai18n` as a multilingual solution
- When the application is started, `A/X/Y/Z` an `i18nScope` instance will be created, `id` and `A/X/Y/Z` then these `i18nScope` instances will be registered in the global `voerkaI18n` instance (see the introduction of multi-database linkage for details).
- If the application `A` configuration supports `zh` `en` two languages, when the application is to switch to a `de` language, Then it's not just `A` the application itself that needs to switch to the `de` language, but also the libraries it depends on `de`. But the libraries `X`, `Y`, and `Z` may or may not support `de` the language themselves. If not, you will also need to request a translation language for the library from the server. Therefore, when you make a request to the server, you need to bring `scope.id` it with you, so that the server can prepare the corresponding language packages for the application `A` and the dependent libraries `X`, `Y`, `Z` respectively.

**According to this mechanism, if your application uses any third-party library, as long as the third-party library also uses voerkai18n as a multilingual solution, you can do it `Add language support`,`Apply language pack patches` yourself without the support of the original developer.**


### Cache language packs

The language pack is loaded from the remote server when switching to a dynamically increasing language. Depending on the size of the language pack, there may be a delay, which may adversely affect the user experience. Therefore, you can cache language packs on the client side.

```javascript
import { i18nScope } from "./languages"

async function loadLanguageMessages(language,scope){
    let messages  = await (await fetch(`/languages/${scope.id}/${language}.json`)).json()    
    localStorage.setItem(`voerkai18n_${scope.id}_${language}_messages`,JSON.stringify(messages));
    return messages
}

i18nScope.registerDefaultLoader(async (language,scope)=>{
    let message = localStorage.getItem(`voerkai18n_${scope.id}_${language}_messages`);
    if(messages){        
        setTimeout(async ()=>{
            const messages  = loadLanguageMessages(language,scope)
            scope.refresh()            
        },0)        
    }else{
        messages  = loadLanguageMessages(language,scope)        
    }
    return messages
})

```



