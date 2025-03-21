# UniApp

UniApp is a cross-platform application development framework using Vue syntax, available in both Vue 2 and Vue 3 versions.

You only need to use `@voerkaI18n/vue` and `@voerkaI18n/vue2` accordingly.

When using `voerkai18n init` in a UniApp project, you might encounter the following error: `Cannot read properties of undefined (reading 'name')`

This is because UniApp projects are created with only `manifest.json` and no `package.json`. Even if `package.json` exists, it might be missing the required `name` field. Since `voerkai18n init` attempts to read the `name` from `package.json` to use as `i18nScope.id`, this causes the error.

**Solution:**

- Create an empty `package.json` file in the project root directory and make sure to specify the `name` field.
- This issue has been resolved in version `V2.0.7` and above.

All other usage is the same as in regular Vue projects.
