# Changing Language Directory

By default, `voerkai18n` uses `languages` or `src/languages` as the working directory, where all extracted content and compiled code are stored.
`voerkai18n` also checks if there is a `src` folder in the current project, and if so, it uses `src/languages`.

In most cases, the `languages` directory has clear semantics and generally doesn't need to be changed, but `voerkai18n` also provides a way to change it:

Modify in the current project's `package.json` as follows:

```json
// package.json

{
    "voerkai18n":{
        "entry":"i18n"
    }
}
```

**Notes:**

- `entry` cannot use absolute paths, only relative paths. For example, if `entry='i18n'`, it means the language directory will be `<Project Root>/i18n` or `<Project Root>/src/i18n`.
- If there is a `src` folder in the current project, `voerkai18n` will automatically use `src/<entry>`, so you don't need to specify `src/i18n`.
-
