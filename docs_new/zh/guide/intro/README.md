# 概述

`javascript`国际化方案很多，比较有名的有`fbt`、`i18next`、`react-i18next`、`vue-i18n`、`react-intl`等等，每一种解决方案均有大量的用户。为什么还要再造一个轮子？好吧，再造轮子的理由不外乎不满足于现有方案，总想着现有方案的种种不足之处，然后就撸起袖子开始干。

那么到底是对现有解决方案有什么不满？最主要有三点：

- 大部份均为要翻译的文本信息指定一个`key`，然后在源码文件中使用形如`$t("message.login")`之类的方式，然后在翻译时将之转换成最终的文本信息。此方式最大的问题是，在源码中必须人为地指定每一个`key`，在中文语境中，想为每一句中文均配套想一句符合语义的`英文key`是比较麻烦的，也很不直观不符合直觉。我希望在源文件中就直接使用中文，如`t("中华人民共和国万岁")`，然后国际化框架应该能自动处理后续的一系列麻烦。

- 要能够比较友好地支持多库多包`monorepo`场景下的国际化协作，当主程序切换语言时，其他包或库也可以自动切换，并且在开发上每个包或库均可以独立地进行开发，集成到主程序时能无缝集成。这点在现有方案上没有找到比较理想的解决方案。

基于此就开始造出`VoerkaI18n`这个**全新的国际化多语言解决方案**，主要特性包括：
 
- **全流程支持**
   
  从文本提取/自动翻译/编译/动态切换的全流程工程化支持，适用于大型项目

 - **集成自动翻译**
  
  调用在线翻译服务API支持对提取的文本进行自动翻译，大幅度提高工程效率

 - **符合直觉**

  在源码中直接使用符合直觉的翻译形式，不需要绞尽脑汁想种种key

 - **自动提取文本**

  提供扫描提取工具对源码文件中需要翻译的文本进行提取

 - **TypeScript支持**

    内置支持TypeScript类型以及生成TypeScript源码

 - **适用性**
    
    支持任意Javascript应用,包括`Nodejs/Vue/React/ReactNative`等。

 - **多库联动**
    
    支持多包工程下多库进行语言切换的联动

 - **工具链**
    
    提供Vue/React/Babel等扩展插件，简化各种应用开发

 - **插值变量**
    
    强大的插值变量机制，能扩展支持复数、日期、货币等灵活强大的多语言特性

 - **语言补丁**
    
    在应用上线后发现错误时可以在线修复

 - **动态增加语种**
    
    可以在应用上线后动态增加语种支持

 - **90%+测试覆盖率**
    
    核心运行时超过90%的测试覆盖率

  

# **开源推荐：** 

- **`VoerkaI18n`**: [基于Nodejs/React/Vue的一键国际化解决方案](https://zhangfisher.github.io/voerka-i18n/)
- **`Logsets`**: [命令行应用增强输出库](https://zhangfisher.github.io/logsets/)
- **`VoerkaLogger`**:  [日志](https://zhangfisher.github.io/voerkalogger/)
- **`FlexDecorators`**:  [JavaScript/TypeScript装饰器开发](https://zhangfisher.github.io/flex-decorators/)
- **`FlexState`**:  [有限状态机实现](https://zhangfisher.github.io/flexstate/)
- **`FlexTools`**:  [实用工具函数库](https://zhangfisher.github.io/flex-tools/)
- **`AutoPub`**:  [基于pnpm/monorepo的自动发包工具](https://zhangfisher.github.io/autopub/)
