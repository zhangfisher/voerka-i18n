Internationalization solution for 'Javascript/Typescript/Vue/React/Solidjs/SvelteJs/ReactNative'

Based on `javascript` the internationalization of many solutions, the more famous are `fbt`, `i18next`, `react-i18next`, `vue-i18n`, `react-intl` and so on, each solution has a large number of users. Why build another wheel? Well, the reason for rebuilding a wheel is nothing more than not being satisfied with the existing solution, always thinking about the shortcomings of the existing solution, and then rolling up your sleeves and trying to build a wheel.

So what exactly is the dissatisfaction with the existing solution? 

- Most of them specify one `key` for the text information to be translated, and then use the form `$t("message.login")` and so on in the source code file, and then convert it into the final text information when translating. The biggest problem with this approach is that in the source code, you have to specify each `key` one artificially. In the Chinese context, it is more troublesome to think of a sentence that conforms to the `key` semantics for each Chinese sentence, and it is not intuitive and intuitive. I would like to use Chinese directly in the source file, such as `t("xxxxxxxxx")`, and then the internationalization framework should be able to automatically handle the subsequent series of troubles.

- To be able to support international collaboration in multi-library and multi-package `monorepo` scenarios in a friendly way, when the main program switches languages, other packages or libraries can also be automatically switched, and each package or library can be developed independently in terms of development, and can be seamlessly integrated into the main program. There is no ideal solution to this problem in the existing scheme.

  

**Based on this, we began to build `VoerkaI18n` an international multilingual solution, and the main features include:**
 
- Comprehensive engineering solution, providing tool chain support for initialization, text extraction, automatic translation, compilation, etc.
- Intuitively, there is no need to manually define text `Key` mappings.
- The powerful interpolation variable `formatter` mechanism can be extended to a powerful multi-language feature.
- Support `babel` the automatic import `t` of translation functions by plug-ins.
- Support `nodejs`, browser ( `vue`/ `react`/ `solid`), etc `React Native`., etc. Any JS scenario
- Designed separately `toolChain` from `runtime`, only a small runtime integration is required for release.
- Highly extensible `plural`, common multilingual processing mechanisms such as, `currency`, `datetime` and.
- During the translation process, the extracted text can be automatically synchronized and the translated content can be preserved.
- Supported languages can be added dynamically online
- Support online language pack patching after release to fix translation errors
- Support online automatic translation to translate the extracted text.
- Over 90% test coverage for core runtime `@voerkai18n/runtime`
- Support `TypeScript` development

 

# Open source recommendation

- `VoerkaI18n`: [ One-click Internationalization Solution Based on Nodejs/React/Vue ](https://zhangfisher.github.io/voerka-i18n/)
- `Logsets`: [Command line ui set](https://zhangfisher.github.io/logsets/)
- `AutoPub`: [ Automatic package sending tool based on pnpm/monorepo ](https://zhangfisher.github.io/autopub/)
- `FlexDecorators`: [ JavaScript/Type Script Decorator Development ](https://zhangfisher.github.io/flex-decorators/)
- `FlexState`: [Finite state machine](https://zhangfisher.github.io/flexstate/)
- `FlexTools`: [Utility Library](https://zhangfisher.github.io/flex-tools/)
