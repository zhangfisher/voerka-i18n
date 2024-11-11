# Namespace <!-- {docsify-ignore-all} -->

 `voerkai18n ` The purpose of the namespace is to solve the problem of classifying and translating the translated content through the namespace when there are many source code files.

Consider a large project with thousands of source code files. By default, `voerkai18n extract` all source files are scanned to extract the text to be translated into `languages/translates/default.json` files. Too many files can cause the following problems:

- Too much content makes the `default.json` file too large to manage
- Some translations often need to be related to the context to make a more accurate translation, without proper classification, it is not easy to relate to the context.

Therefore, the purpose of the introduction `namespace` is to solve this problem.

To configure the namespace, a configuration `languages/settings.json` file is required.

```javascript
// project folder：d:/code/myapp
// languages/settings.json
module.exports = {
    namespaces:{
        //"name":"Relative path"，
        "routes":"routes",
        "auth":"core/auth",
        "admin":"views/admin"
    }
}
```

The above examples represent:

- Extract text scanned `d:\code\myapp\routes` in to `routes.json`.
- Extract text scanned `d:\code\myapp\auth` in to `auth.json`.
- Extract text scanned `d:\code\myapp\views/admin` in to `admin.json`.

It ` languages/translates` will eventually include:

```shell
languages
  |-- translates
      |-- default.json
      |-- routes.sjon
      |-- auth.json
      |-- admin.json      
```

These files are then automatically merged `voerkai18n compile` at compile time, and the concept of namespaces is no longer needed later.

 `名称空间` Just to solve the classification problem when there is too much translation content.

