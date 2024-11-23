import { defineConfig } from 'vitepress' 

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "VoerkaI18n",
  description: "一键国际化全流程解决方案",
  base: '/voerka-i18n/',
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: '/en/' // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
      // 其余 locale 特定属性...
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      label: "目录",
      level: [2, 5]
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/zh/guide' },
      { text: '参考', link: '/zh/reference' },
      { text: '开源推荐', link: 'https://zhangfisher.github.io/repos/' },
    ],
    sidebar: {
      "/zh/guide/": [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '安装', link: '/zh/guide/intro/install' },
            { text: '快速入门', link: '/zh/guide/intro/get-started' },
            { text: '更新历史', link: '/zh/guide/intro/history' },
            { text: '常见问题', link: '/zh/guide/intro/question' },
            { text: '获取支持', link: '/zh/guide/intro/support' },
          ]
        },
        {
          text: '指南',
          collapsed: false,
          items: [
            { 
              collapsed: false,
              items: [
                { text: '翻译函数', link: '/zh/guide/use/t' },
                { text: '插值变量', link: '/zh/guide/use/interpolation' },
                { text: '日期时间', link: '/zh/guide/use/datetime' },
                { text: '复数', link: '/zh/guide/use/plural' },
                { text: '货币', link: '/zh/guide/use/currency' },
                { text: '切换语言', link: '/zh/guide/use/change-language' },
                { text: '名称空间', link: '/zh/guide/use/namespace' },
                { text: '记住切换语言', link: '/zh/guide/use/storage' },
                { text: '一词多译', link: '/zh/guide/use/multi-translate' },
              ]
            },
          ]
        },
        {
          text: '集成',
          collapsed: false,
          items: [
            { text:'Vue', link: '/zh/guide/integration/vue' },
            { text:'Vue2', link: '/zh/guide/integration/vue2' },
            { text:'React', link: '/zh/guide/integration/react' },
            { text:'uniapp', link: '/zh/guide/integration/uniapp' },
            { text:'openinula', link: '/zh/guide/integration/openinula' },
          ]
        },
        {
          text: '高级',
          collapsed: false,
          items: [
            { text: '运行时', link: '/zh/guide/advanced/runtime'  },
            { text: '文本映射', link: '/zh/guide/advanced/textMap'  },
            { text: '多库联动', link: '/zh/guide/advanced/multi-libs' },
            { text: '事件', link: '/zh/guide/advanced/events' },
            { text: '定制格式化器', link: '/zh/guide/advanced/custom-formatter' },
            { text: '自动导入翻译函数', link: '/zh/guide/advanced/auto-import'  },
            { text: '语言包', link: '/zh/guide/advanced/lang-pack'  },
            { text: '自动翻译', link: '/zh/guide/advanced/auto-translate' },
            { text: '动态增加语言支持', link: '/zh/guide/advanced/dynamic-add'  },
            { text: '更改语言目录', link: '/zh/guide/advanced/lang-entry-path'  },
            { text: '语言包补丁', link: '/zh/guide/advanced/lang-patch' },
            { text: '在线编辑应用界面', link: '/zh/guide/advanced/lang-edit'  },
            { text: 'TypeScript', link: '/zh/guide/advanced/typescript' },
          ]
        },
        {
          text: '工具',
          collapsed: false,
          items: [
            { text: '命令行', link: '/zh/guide/tools/cli' },
            { text: 'Babel插件', link: '/zh/guide/tools/babel' },
            { text: 'Vite插件', link: '/zh/guide/tools/vite' },
            { text: 'Vue插件', link: '/zh/guide/tools/vue' },
            { text: 'WebPack', link: '/zh/guide/tools/webpack' },
          ]
        }
      ],
      "/zh/reference/": [ 
            { text: '语言代码', link: '/zh/reference/lang-code' },
            { text: 'i18nScope', link: '/zh/reference/i18nscope' },
            { text: 'VoerkaI18n', link: '/zh/reference/voerkai18n' },
          ]  
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/voerka-i18n/' }
    ]
  }, 
  vue: {
    template: {
      compilerOptions: {
        whitespace: 'preserve'
      }
    }
  },
  // vite:{
  //   plugins: [codeInspectorPlugin({ bundler: 'vite'})]
  // }
})
