
<template>
    <div>
        <Translate id="features">
基于此就开始打造VoerkaI18n国际化多语言解决方案，主要特性包括：
-    全面工程化解决方案，提供初始化、提取文本、自动翻译、编译等工具链支持。
-    符合直觉，不需要手动定义文本Key映射。
-    强大的插值变量格式化器机制，可以扩展出强大的多语言特性。
-    支持babel插件自动导入t翻译函数。
-    支持nodejs、浏览器(vue/react/solid)等、React Native等任意JS场景
-    采用工具链与运行时分开设计，发布时只需要集成很小的运行时。
-    高度可扩展的复数、货币、数字等常用的多语言处理机制。
-    翻译过程内，提取文本可以自动进行同步，并保留已翻译的内容。
-    可以动态在线添加支持的语言
-    支持发布后的在线打语言包补丁，修复翻译错误
-    支持调用在线自动翻译对提取文本进行翻译。
-    核心运行时@voerkai18n/runtime超过90%的测试覆盖率
-    支持TypeScript开发 
        </Translate>
    </div>
</template>
<script setup>
import { Translate } from "../languages.bak"
</script>


