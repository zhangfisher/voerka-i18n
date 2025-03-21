export default {
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
                { text: '工作流', link: '/zh/guide/use/workflow' },
                { text: '翻译函数', link: '/zh/guide/use/t' },
                { text: '翻译组件', link: '/zh/guide/use/translate' },
                { text: '段落', link: '/zh/guide/use/paragraph' },
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
            { text:'Nextjs', link: '/zh/guide/integration/nextjs' },
            { text:'Svelte', link: '/zh/guide/integration/svelte' },
            { text:'Solid', link: '/zh/guide/integration/solid' },
            { text:'uniapp', link: '/zh/guide/integration/uniapp' },
            { text:'openinula', link: '/zh/guide/integration/openinula' },
          ]
        },
        {
          text: '高级',
          collapsed: false,
          items: [
            { text: '配置', link: '/zh/guide/advanced/settings'  },
            { text: '运行时', link: '/zh/guide/advanced/runtime'  },
            { text: '文本映射', link: '/zh/guide/advanced/idMap'  },
            { text: '多库联动', link: '/zh/guide/advanced/multi-libs' },
            { text: '事件', link: '/zh/guide/advanced/events' },
            { text: '翻译变换', link: '/zh/guide/advanced/transform' },
            { text: '定制格式化器', link: '/zh/guide/advanced/custom-formatter' },
            { text: '自动导入翻译函数', link: '/zh/guide/advanced/auto-import'  },
            { text: '语言包', link: '/zh/guide/advanced/lang-pack'  },
            { text: '自动翻译', link: '/zh/guide/advanced/auto-translate' },
            { text: '动态增加语言支持', link: '/zh/guide/advanced/dynamic-add'  },
            { text: '更改语言目录', link: '/zh/guide/advanced/lang-entry-path'  },
            { text: '语言包补丁', link: '/zh/guide/advanced/lang-patch' },
            { text: '在线补丁编辑', link: '/zh/guide/advanced/edit-patch'  },
            { text: 'TypeScript', link: '/zh/guide/advanced/typescript' },
          ]
        },
        {
          text: '工具',
          collapsed: false,
          items: [
            { text: '命令行', link: '/zh/guide/tools/cli' },
            { text: '编译插件', link: '/zh/guide/tools/plugins' },
            { text: 'Babel插件', link: '/zh/guide/tools/babel' },
            { text: 'Eslint', link: '/zh/guide/tools/eslint' }
          ]
        }
      ],
      "/zh/reference/": [ 
            { text: '语言代码', link: '/zh/reference/lang-code' },
            { text: 'VoerkaI18nScope', link: '/zh/reference/i18nscope' },
            { text: 'VoerkaI18nManager', link: '/zh/reference/voerkai18n' },
          ]  
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/voerka-i18n/' }
    ]  
  
  }
}
