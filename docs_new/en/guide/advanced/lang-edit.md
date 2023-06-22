# Online editing application interface <!-- {docsify-ignore-all} -->

By using ** Dynamically load a language pack ** the mechanism, developers can easily develop `让用户自行编辑界面语言` new functions.

For general front-end applications, the various display contents of the UI interface are relatively fixed after development, construction, and deployment. `VoerkaI18n` It not only makes it easy for developers to use the language pack patch mechanism to update and fix the interface after the application is released. Furthermore, `VoerkaI18n` ** Dynamically load a language pack ** the mechanism allows you to easily extend imaginative functionality: ** Allow users to edit and modify the interface language at any time. **.

** The basic idea is as follows: **
- The back-end uses a database to store language packs, and each language pack can be stored in one or more tables.
- Write the corresponding Web API for editing the language pack, and implement the function of modifying the language pack through the API
- The front-end code rewrites the language package loader function to modify the original way of reading static language packages to API reading.
- Add an interface for editing language packs in the front end

The implementation of this feature involves a back-end implementation and `VoerkaI18n` does not provide out-of-the-box functionality, leaving the developer to extend it.

Please read the implementation of [ `远程加载语言包`] (./remote-load) in detail.


