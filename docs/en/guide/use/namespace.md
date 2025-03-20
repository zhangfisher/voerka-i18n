# Namespace

The namespace in `voerkai18n` is designed to solve the problem of categorizing translations when there are numerous source files.

Consider a large project with thousands of source code files. By default, `voerkai18n extract` scans all source files and extracts text that needs translation into the `languages/translates/messages/default.json` file. Having too many files leads to the following issues:

- Too much content makes the `default.json` file too large, making it difficult to manage
- Some translations often require context to make more accurate translations, and without proper categorization, it's not easy to establish context.

Therefore, the introduction of `namespaces` aims to solve these problems.

To configure namespaces, you need to configure the `languages/settings.json` file.

```javascript
// Project directory: d:/code/myapp
// languages/settings.json
{
    namespaces:{
        //"name":"relative path",
        "routes":"routes",
        "auth":"core/auth",
        "admin":"views/admin"
    }
}
```

The above example represents:

- Text scanned from `d:\code\myapp\routes` is extracted to `routes.json`
- Text scanned from `d:\code\myapp\auth` is extracted to `auth.json`
- Text scanned from `d:\code\myapp\views/admin` is extracted to `admin.json`

Finally, `languages/translates` will include:

<lite-tree>
myapp
    languages
        translates
            messages
                default.json            //!
                routes.json             //!
                auth.json               //!
                admin.json              //!
</lite-tree>

Then, `voerkai18n compile` will automatically merge these files during compilation, and the concept of namespaces is no longer needed afterward.

`Namespaces` are simply for solving the categorization problem when there is too much translation content.
