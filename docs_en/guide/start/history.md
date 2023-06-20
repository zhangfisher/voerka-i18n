# Update log <!-- {docsify-ignore-all} -->

## V2.0

### 2023/6/18

After several iterations, V2.0 is officially released, and the main updates are as follows:

- The core runtime is `TypeScript` refactored to provide full type support
- Unit testing for runtime `90%+` code coverage
- Improve the multi-database linkage mechanism
- Improved support for `React`
- Improved support for `Vue`
- The state can be automatically stored when the language is switched and automatically restored when the language is opened next time.
- Some examples have been added
- Improved versioning mechanism, all packages now have a unified version number
- The overall code structure is clearer and easier to maintain


## V1.0

### 2023/3/29

- ** fix(runtime) ** Because some JS engines (such as react-native Hermes) do not support regular expression named capture groups, the runtime cannot use them, so this update removes the named capture groups to solve `react-native` the problem of errors in.

- ** fix(utils) ** Introduced `string.prototype.replaceAll` to solve `nodejs 15` the following problems that cannot be used normally

- ** test ** Add `pacakges/apps/nodejs` demo program for debugging.

### 2023/3/27

- [Fix] Fixed `@voerkai18n/cli extract` `nodejs < 15` an issue that caused an error due to a missing `replaceAll` version, and now runs at `nodejs >=12`
- [BUG] Fix `@voerkai18n/cli` the error caused `RangeError: Invalid array length` by the upgrade of the command `logsets` dependency

### 2023/3/24

-  `@voerkai18n/cli` Introduced `string.prototype.replaceAll` in to solve `nodejs 15` the following problems that cannot be used normally

### 2023/2/13

- Modifying `@voerkai18n/cli` the Wrapping Behavior `lf` of Command Entry Files

### 2023/1/28

- Fix `voerkai18n init` spelling errors on `i18nScope` build `index.js`
-  `voerkai18n init` Add `--typescript` parameter support
- Fix `voerkai18n init` `moduleType=auto` the problem when generating file types
- Update the document

### 2023/1/27

- Fixed `voerkai18n init` an issue where the generated initial file was incomplete
- Newly added `voerkai18n-loader for webpack`, can be used in `Create React App` or `React Native` to achieve automatic import and `idMap` automatic replacement of translated text content.
- Upgrade `@voerkai18n/utils`, add `readIdMapFile`, `replaceTranslateText`, `hasImportTranslateFunction`, `importTranslateFunction` and other tool functions.
- Add `CRA` created `React` sample
-  `autoImport` `@voerkai18n/vite` Supports automatic import in the specified extension.

### 2023/1/26

- Fixed `@voerkai18n/cli` `linux` a script execution error under. Thank you `cjahv` [PR#6](https://github.com/zhangfisher/voerka-i18n/pull/6)

### 2023/1/24

- Functions are not automatically imported `t` `@voerkai18n/vite` by default
- Refactoring `@voerkai18n/vue`, as described in `指南` the introduction
- New `typescript` `vue` examples

### 2023/1/11

- Refactoring `@voerkai18n/react`, supporting automatic re-rendering
- Fix `@voerkai18n/vite` plugin `idMap` errors when transcoding `jsx` components

### 2023/1/10

- Add `typescript` type support
- Remove `@voerkai18n/runtime` Source Code Dependency Mode
- Support files under the `typescript` generation `languages` folder

### 2022/8/24

- New flexible formatting mechanism
- Add new date format
- Add New Currency Format
- Adjust run-time code organization

### 2022/8/7

- Update the document

### 2022/8/5

- Add the language package patch function, which can dynamically update and fix translation errors after the application goes online.
- Add a mechanism for dynamically loading language packs, which can dynamically add language support after the application goes online