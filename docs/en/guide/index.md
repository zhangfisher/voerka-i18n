An internationalization solution for `Javascript/Vue/React/ReactNative`

[Official Website](https://zhangfisher.github.io/voerka-i18n/)

There are many internationalization solutions based on `javascript`, with notable ones including `fbt`, `i18next`, `react-i18next`, `vue-i18n`, `react-intl`, etc., each having a large user base. Why create another wheel? Well, the reason for creating a new wheel usually stems from dissatisfaction with existing solutions, always thinking about various shortcomings of current solutions, and then rolling up sleeves to create a new wheel.

So what exactly are the dissatisfactions with existing solutions?

- Most solutions require specifying a `key` for text that needs translation, then using something like `$t("message.login")` in source code files, which is then converted to the final text during translation. The biggest problem with this approach is that you must manually specify each `key` in the source code. In a Chinese context, trying to come up with semantically appropriate `English keys` for every Chinese sentence is quite troublesome and unintuitive. I hope to use Chinese directly in source files, like `t("中华人民共和国万岁")`, and let the internationalization framework automatically handle the subsequent series of complications.

- There should be friendly support for internationalization collaboration in multi-library `monorepo` scenarios, where when the main program switches languages, other packages or libraries can automatically switch as well. Additionally, each package or library can be developed independently during development and seamlessly integrated into the main program. This point hasn't found a satisfactory solution in existing approaches.

**Based on this, the `VoerkaI18n` internationalization multilingual solution was created, with the following main features:**

- Comprehensive engineering solution, providing toolchain support for initialization, text extraction, automatic translation, compilation, etc.
- Intuitive, no need to manually define text `Key` mappings.
- Powerful interpolation variable `formatter` mechanism that can be extended for powerful multilingual features.
- Supports `babel` plugin for automatic import of the `t` translation function.
- Supports any JS scenario including `nodejs`, browser (`vue`/`react`/`solid`), `React Native`, etc.
- Adopts separate design for `toolchain` and `runtime`, only requiring integration of a small runtime during deployment.
- Highly extensible handling mechanisms for common multilingual features like `plurals`, `currency`, `numbers`, etc.
- During translation, text extraction can be automatically synchronized while preserving translated content.
- Can dynamically add supported languages online
- Supports online language pack patches after deployment to fix translation errors
- Supports calling online automatic translation services to translate extracted text.
- Core runtime `@voerkai18n/runtime` has over 90% test coverage
- Supports `TypeScript` development

# **Open Source Recommendations:**

- [Full-process one-click React/Vue/Nodejs internationalization solution - VoerkaI18n](https://zhangfisher.github.io/voerka-i18n/)
- [Extremely elegant state management library - AutoStore](https://zhangfisher.github.io/autostore/)
- [Unparalleled React form development library - speedform](https://zhangfisher.github.io/speed-form/)
- [Terminal interface development enhancement library - Logsets](https://zhangfisher.github.io/logsets/)
- [Simple logging output library - VoerkaLogger](https://zhangfisher.github.io/voerkalogger/)
- [Decorator development - FlexDecorators](https://zhangfisher.github.io/flex-decorators/)
- [Finite state machine library - FlexState](https://zhangfisher.github.io/flexstate/)
- [General function utility library - FlexTools](https://zhangfisher.github.io/flex-tools/)
- [Small and elegant CSS-IN-JS library - flexstyled](https://zhangfisher.github.io/flexstyled/)
- [VSCODE extension for adding comments to JSON files - json_comments_extension](https://github.com/zhangfisher/json_comments_extension)
- [Interactive command-line program development library - mixed-cli](https://github.com/zhangfisher/mixed-cli)
- [Powerful string interpolation variable processing utility library - flexvars](https://github.com/zhangfisher/flexvars)
- [Frontend link debugging assistant tool - yald](https://github.com/zhangfisher/yald)
- [Asynchronous signal - asyncsignal](https://github.com/zhangfisher/asyncsignal)
- [React/Vue/WebComponent tree component - LiteTree](https://zhangfisher.github.io/lite-tree/)
