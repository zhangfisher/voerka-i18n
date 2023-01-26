import { defineConfig } from 'dumi';

// more config: https://d.umijs.org/config

export default defineConfig({
    title     : 'VoerkaI18n全流程国际化解决方案',
    base      : "/voerka-i18n/",
    publicPath: "/voerka-i18n/",
    mode      : 'site',
    logo      : "/voerka-i18n/images/i18n.png",
    outputPath: "docs/dist",
    resolve   : {
        includes:["docs/src"]
    },
    metas: [
        {
          name: 'keywords',
          content: 'vue-i18n,i18n,国际化,多语言开发,react-intl,fbt,i18next,kiwi,Lingui,fbt,react-i18next',
        },
        {
          name: 'description',
          content: 'nodejs/vue/react国际化全流程解决方案',
        }
    ],
    locales: [['zh-CN', '中文']],
    theme:{
        "@c-heading": "#4569d4"
    },  
    styles: [`
    ul.__dumi-default-layout-toc > li[data-depth=2] { 
        font-weight: bold; 
    }
    `], 
    mfsu:{},
    scripts:[`
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?14df7a33942125aa14ad60ee1cdb1940";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();  
    `],
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
            title:"开源推荐",
            children:[
                {title:"FlexDecorators",path:"https://zhangfisher.github.io/flex-decorators/"},
                {title:"FlexState",path:"https://zhangfisher.github.io/flexstate/"},
                {title:"FlexTools",path:"https://zhangfisher.github.io/flex-tools/"},
                {title:"Logsets",path:"https://zhangfisher.github.io/logsets/"},
                {title:"AutoPub",path:"https://zhangfisher.github.io/autopub/"}      
            ] 
        }, 
        {
            title:"GitHub",
            path: "https://github.com/zhangfisher/voerka-i18n"
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
                   "/guide/advanced/langedit.md",
                   "/guide/advanced/typescript.md"                   
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

