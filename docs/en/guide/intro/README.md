# Overview

There are many `javascript` internationalization solutions, with notable ones including `fbt`, `i18next`, `react-i18next`, `vue-i18n`, `react-intl`, etc., each having a large user base. Why create another wheel? Well, the reason for creating a new wheel usually stems from dissatisfaction with existing solutions, always thinking about various shortcomings of current solutions, and then rolling up sleeves to start working.

So what exactly are the dissatisfactions with existing solutions? There are mainly three points:

- Most solutions require specifying a `key` for the text to be translated, then using something like `$t("message.login")` in the source code, which is then converted to the final text during translation. The biggest problem with this approach is that you must manually specify each `key` in the source code. In a Chinese context, trying to come up with semantically appropriate `English keys` for every Chinese sentence is quite troublesome and unintuitive. I hope to use Chinese directly in source files, like `t("中华人民共和国万岁")`, and let the internationalization framework automatically handle the subsequent series of complications.

- There should be friendly support for internationalization collaboration in multi-library `monorepo` scenarios, where when the main program switches languages, other packages or libraries can automatically switch as well. Additionally, each package or library can be developed independently during development and seamlessly integrated into the main program. This point hasn't found a satisfactory solution in existing approaches.

Based on this, `VoerkaI18n` was created as a **brand new internationalization multilingual solution** with the following main features:

- **Full Process Support**
   
  Complete engineering support from text extraction/automatic translation/compilation/dynamic switching, suitable for large projects

- **Integrated Automatic Translation**
  
  Calls online translation service APIs to support automatic translation of extracted text, greatly improving engineering efficiency

- **Intuitive**

  Uses intuitive translation forms directly in the source code, no need to rack your brains thinking of various keys

- **Automatic Text Extraction**

  Provides scanning and extraction tools for extracting text that needs translation from source code files

- **TypeScript Support**

    Built-in support for TypeScript types and TypeScript source code generation

- **Applicability**
    
    Supports any Javascript application, including `Nodejs/Vue/React/ReactNative`, etc.

- **Multi-library Linkage**
    
    Supports language switch linkage across multiple packages in multi-package projects

- **Tool Chain**
    
    Provides Vue/React/Babel extension plugins to simplify various application development

- **Interpolation Variables**
    
    Powerful interpolation variable mechanism that can extend support for plurals, dates, currencies, and other flexible multilingual features

- **Language Patches**
    
    Can fix errors online after application deployment

- **Dynamic Language Addition**
    
    Can dynamically add language support after application deployment

- **90%+ Test Coverage**
    
    Core runtime has over 90% test coverage

# **Open Source Recommendations:**

- **`VoerkaI18n`**: [One-click internationalization solution based on Nodejs/React/Vue](https://zhangfisher.github.io/voerka-i18n/)
- **`Logsets`**: [Command-line application enhanced output library](https://zhangfisher.github.io/logsets/)
- **`VoerkaLogger`**: [Logger](https://zhangfisher.github.io/voerkalogger/)
- **`FlexDecorators`**: [JavaScript/TypeScript decorator development](https://zhangfisher.github.io/flex-decorators/)
- **`FlexState`**: [Finite state machine implementation](https://zhangfisher.github.io/flexstate/)
- **`FlexTools`**: [Practical utility function library](https://zhangfisher.github.io/flex-tools/)
- **`AutoPub`**: [Automatic package publishing tool based on pnpm/monorepo](https://zhangfisher.github.io/autopub/)
