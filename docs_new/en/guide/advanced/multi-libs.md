# Multi-database linkage <!-- {docsify-ignore-all} -->

> This document describes how to link and collaborate across multiple libraries

 `voerkai18n ` Support the linkage and collaboration of multiple library internationalization, that is ** When the main program switches languages, all reference-dependent libraries follow the main program for language switching **, the whole switching process is transparent to all library development. Library developers do not need special configuration, but only need to develop like ordinary applications.
## Basic principles

The overall principle framework is as follows:

![](./arch.png)

When we are developing an application or library `import "./languages"`, `langauges/index.js` the following processing is performed:

- Create a `i18nScope` scope instance
- Detecting whether there is a global singleton `VoerkaI18n` in the current application environment
  - If a global singleton exists `VoerkaI18n`, the current `i18nScope` instance is registered `VoerkaI18n.scopes` in the
  - If no global singleton exists `VoerkaI18n`, a `VoerkaI18n` global singleton is created using the parameters of the current `i18nScope` instance.
- The translation function imported into this project `t` can be used `import  { t} from ".langauges` in each application and library. The `t` translation function is bound to the current `i18nScope` scope instance, so only the text of this project will be used during translation. In this way, the translation between different projects and libraries is separated.
- Since all references `i18nScope` are registered to the global singleton `VoerkaI18n`, when the language is switched, `VoerkaI18n` all registered references `i18nScope` will be refreshed and switched, thus realizing `i18nScope` independent and linked language switching.

## How to use

The usage method used in the development library is the same as that used in the ordinary application `VoerkaI18n`. The only difference is:

Parameter needs to be specified `library` in `lanuages/index.(js|ts)`

```javascript

const scope = new VoerkaI18nScope({    
    // ...
    library     : false,    // Set to true during library development


    // ...
}) 
```

- When developing a library application, you need to set the `library` parameter to `true` and the application to `false` or not.


## Questions
### How to use `t` the translation function in the library?

The usage method used in the development library is exactly the same as that used in the ordinary application `VoerkaI18n`.

### Do all libraries automatically switch languages when switching apps?

Yes, each library has a corresponding `i18nScope` instance, and that instance is registered with the global `VoerkaI18n` instance, which is essentially a method call to the `change` global `VoerkaI18n` instance when `i18nScope.change` the language switch is invoked. This method notifies all registered instances of the `i18nScope` language switch.


### Is there a problem with using different versions of the Voerka I18n development library?

Assuming that `lib1` use `VoerkaI18n 2.0` development, `lib2` use `VoerkaI18n 2.1` development, `lib3` use `VoerkaI18n 2.2` development and the main application is based on `VoerkaI18n 2.3` development, is there a problem?

No problems and works perfectly. The only thing you need to do is:

> Specify the `lib1` version dependency of `VoerkaI18n runtime`, `lib2`, `lib3` as `peerDependencies`.

In this way, when the main application is installed `VoerkaI18n runtime 2.3` `lib1`, `lib2` and `lib3` also point to the same version, and its internal `i18nScope` will be automatically registered in the global `VoerkaI18n`, so there will be no problem in working together.


### Who is responsible for the language configuration in the multi-library scenario?

In principle, only one language can be specified `library=false` `i18nScope` in an application, and the language configuration of the whole application is based on the main application.

If there is more than `library=false` one in an application `i18nScope`, the last one `library=false` `i18nScope` shall prevail.








 


