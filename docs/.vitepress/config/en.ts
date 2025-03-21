export default {
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      label: "TOC",
      level: [2, 5]
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/en' },
      { text: 'Guide', link: '/en/guide' },
      { text: 'Reference', link: '/en/reference' },
      { text: 'Repos', link: 'https://zhangfisher.github.io/repos/' },
    ],
    sidebar: {
      "/en/guide/": [
        {
          text: 'Start',
          collapsed: false,
          items: [
            { text: 'Install', link: '/en/guide/intro/install' },
            { text: 'Get Started', link: '/en/guide/intro/get-started' },
            { text: 'History', link: '/en/guide/intro/history' },
            { text: 'Question', link: '/en/guide/intro/question' },
            { text: 'Support', link: '/en/guide/intro/support' },
          ]
        },
        {
          text: 'Guide',
          collapsed: false,
          items: [
            { 
              collapsed: false,
              items: [
                { text: 'Workflow', link: '/en/guide/use/workflow' },
                { text: 'Translate', link: '/en/guide/use/t' },
                { text: 'Component', link: '/en/guide/use/translate' },
                { text: 'Paragraph', link: '/en/guide/use/paragraph' },
                { text: 'Interpolation', link: '/en/guide/use/interpolation' },
                { text: 'DateTime', link: '/en/guide/use/datetime' },
                { text: 'Plural', link: '/en/guide/use/plural' },
                { text: 'Currency', link: '/en/guide/use/currency' },
                { text: 'Change Language', link: '/en/guide/use/change-language' },
                { text: 'Namespace', link: '/en/guide/use/namespace' },
                { text: 'Remember', link: '/en/guide/use/storage' },
                { text: 'Polysemy', link: '/en/guide/use/multi-translate' },
              ]
            },
          ]
        },
        {
          text: 'Integration',
          collapsed: false,
          items: [
            { text:'Vue', link: '/en/guide/integration/vue' },
            { text:'Vue2', link: '/en/guide/integration/vue2' },
            { text:'React', link: '/en/guide/integration/react' },
            { text:'Nextjs', link: '/en/guide/integration/nextjs' },
            { text:'Svelte', link: '/en/guide/integration/svelte' },
            { text:'Solid', link: '/en/guide/integration/solid' },
            { text:'uniapp', link: '/en/guide/integration/uniapp' },
            { text:'openinula', link: '/en/guide/integration/openinula' },
          ]
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Configuration', link: '/en/guide/advanced/settings'  },
            { text: 'Runtime', link: '/en/guide/advanced/runtime'  },
            { text: 'IdMap', link: '/en/guide/advanced/idMap'  },
            { text: 'Library ', link: '/en/guide/advanced/multi-libs' },
            { text: 'Events', link: '/en/guide/advanced/events' },
            { text: 'Transform', link: '/en/guide/advanced/transform' },
            { text: 'Formatter', link: '/en/guide/advanced/custom-formatter' },
            { text: 'Auto Import', link: '/en/guide/advanced/auto-import'  },
            { text: 'Language Pack', link: '/en/guide/advanced/lang-pack'  },
            { text: 'Auto Translate', link: '/en/guide/advanced/auto-translate' },
            { text: 'Dynamic Language', link: '/en/guide/advanced/dynamic-add'  },
            { text: 'Entry Path', link: '/en/guide/advanced/lang-entry-path'  },
            { text: 'Patch', link: '/en/guide/advanced/lang-patch' },
            { text: 'Edit Patch', link: '/en/guide/advanced/edit-patch'  },
            { text: 'TypeScript', link: '/en/guide/advanced/typescript' },
          ]
        },
        {
          text: 'Tools',
          collapsed: false,
          items: [
            { text: 'Cli', link: '/en/guide/tools/cli' },
            { text: 'Plugins', link: '/en/guide/tools/plugins' },
            { text: 'Babel', link: '/en/guide/tools/babel' },
            { text: 'Eslint', link: '/en/guide/tools/eslint' }
          ]
        }
      ],
      "/reference/": [ 
            { text: 'Language Code', link: '/reference/lang-code' },
            { text: 'VoerkaI18nScope', link: '/reference/i18nscope' },
            { text: 'VoerkaI18nManager', link: '/reference/voerkai18n' },
          ]  
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/voerka-i18n/' }
    ]  
  
  }
} 
