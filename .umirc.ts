import { defineConfig } from 'dumi';

// more config: https://d.umijs.org/config

export default defineConfig({
    title: 'VoerkaI18n全流程国际化解决方案',
    base:"/voerka-i18n/",
    publicPath:"/voerka-i18n/",
    mode: 'site',
    logo: "/voerka-i18n/images/i18n.png",
    outputPath:"docs/dist",
    resolve:{
        includes:["docs/src"]
    },
    locales: [['zh-CN', '中文']],
    scripts:["/voerka-i18n/js/baidu-stats.js"],
    navs:[
        {
            title:"指南",
            path: "/guide"
        },
        {
            title:"参考",
            path: "/reference"
        },
        {
            title:"贡献源码",
            path: "/contribute"
        },
        {
            title:"源代码",
            path: "https://gitee.com/zhangfisher/voerka-i18n"
        }
    ],
    menus: {
        '/guide': [
            {
                title: '开始',
                children: [
                   "/guide/intro/readme.md",
                   "/guide/intro/install.md",
                   "/guide/intro/get-started.md",
                   "/guide/intro/versions.md",
                   "/guide/intro/history.md",
                   "/guide/intro/support.md",
                   "/guide/intro/question.md"
                ],
            },
            {
                title: '指南',
                children: [
                   "/guide/use/t.md",
                   "/guide/use/interpolation.md",
                   "/guide/use/datetime.md",
                   "/guide/use/plural.md",
                   "/guide/use/currency.md",
                   "/guide/use/namespace.md",
                   "/guide/use/change-langeuage.md",
                   "/guide/use/vue.md",
                   "/guide/use/react.md"
                ],
            },
            {
                title: '高级特性',
                children: [
                   "/guide/advanced/runtime.md",
                   "/guide/advanced/textMap.md",
                   "/guide/advanced/multi-libs.md",
                   "/guide/advanced/autoimport.md",
                   "/guide/advanced/customformatter.md",
                   "/guide/advanced/langpack.md",
                   "/guide/advanced/autotranslate.md",
                   "/guide/advanced/framework.md",
                   "/guide/advanced/dynamic-add.md",
                   "/guide/advanced/lngpatch.md",
                   "/guide/advanced/langedit.md"
                ],
            },
            {
                title: '工具',
                children: [
                   "/guide/tools/cli.md",
                   "/guide/tools/babel.md",
                   "/guide/tools/vite.md",
                   "/guide/tools/vue.md"
                ],
            },
        ],
        '/reference': [
            {
                title: '参考',
                children:[
                    "/reference/voerkaI18n.md",
                    "/reference/i18nscope.md",
                    "/reference/formatters.md",
                    "/reference/lang-code.md",

                ]
            }
        ]
        
    }
});

