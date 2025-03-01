
<template>
  <section class="py-8 antialiased dark:bg-gray-900 md:py-8 pt-2 px-2 min-h-lvh">
    <div class="mx-auto max-w-screen-xl px-2 2xl:px-0">
      <div class="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="repo in repos" :key="repo.name">
              <div class="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 hover:shadow-md">
              <div class="flex flex-row items-center justify-between">
                <a
                  href="#"
                  class="text-lg font-semibold leading-tight text-blue-700 hover:underline dark:text-white"
                >
                  {{repo.title}}
                </a>
                <span class="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      data-tooltip-target="tooltip-quick-look"
                      class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <GitFork class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      data-tooltip-target="tooltip-add-to-favorites"
                      class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <Star class="w-4 h-4" />
                    </button>
                  </span>
              </div>
              <div class="flex flex-row items-center justify-between">
                <span>
                <UserRound class="inline text-gray-400 w-4 h-4 mr-1"/>{{repo.author}}
                </span>
                <span class="flex me-2 rounded bg-primary-100 px-0 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    <FillStar />
                    <FillStar />
                    <FillStar />
                    <FillStar />
                    <FillStar />
                </span>
              </div>
              <div class="mt-2 min-h-16 text-gray-900 dark:text-white">
                <Translate :message="() => repo.description" />
              </div> 
            </div>
        </div>

      </div>
      <div class="w-full text-center">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          <Translate message='更多开源项目...' />
          {{ $t('更多开源项目...')  }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup >
import { GitFork, Star, UserRound } from "lucide-vue-next";
import { t,Translate } from '../languages';
import FillStar from '../components/FillStar';

import {useVoerkaI18n} from '@voerkai18n/vue'
const { t:$t} = useVoerkaI18n()

const repos = [
  {
    title: 'VoerkaI18n',
    author: "zhangfisher",
    name: "voerka-i18n",
    homepage: "https://zhangfisher.github.io/voerka-i18n",
    description: t('全流程国际化解决方案'),
    topics: [],
    focus: true,
    notes: t('Nodejs/Vue/React/ReactNative/UniApp/...'),
  },
  {
    title: 'AutoStore',
    author: "zhangfisher",
    name: "autostore",
    homepage: "https://zhangfisher.github.io/autostore",
    description: t('支持异步计算/信号组件/表单绑定的全自动状态管理库')
  },
  {
    title: 'FlexTree ',
    author: "zhangfisher",
    name: "flextree",
    homepage: "https://zhangfisher.github.io/flextree",
    description: t('Nodejs下高效的树数据库存储管理工具库')
  },
  {
    title: 'LiteTree ',
    author: "zhangfisher",
    name: "lite-tree",
    homepage: "https://zhangfisher.github.io/lite-tree",
    description: t('vitepress/dumi/docsify等文档网站专用的轻量树UI组件')
  },
  {
    title: 'FlexStyled',
    author: "zhangfisher",
    name: "flexstyled",
    homepage: "https://zhangfisher.github.io/flexstyled",
    description: t('轻量React/CSS-IN-JS解决方案')
  },
  {
    title: 'FlexState',
    author: "zhangfisher",
    name: "flexstate",
    homepage: "https://zhangfisher.github.io/flexstate",
    description: t('有限状态机实现')
  },
  {
    title: 'FlexTools',
    author: "zhangfisher",
    name: "flex-tools",
    homepage: "https://zhangfisher.github.io/flex-tools",
    description: t('实用的工具函数库')
  },
  {
    title: 'FlexVars',
    author: "zhangfisher",
    name: "flexvars",
    homepage: "https://zhangfisher.github.io/flexvars",
    description: t('强大的字符串插值工具库')
  },
  {
    title: 'flex-decorators',
    author: "zhangfisher",
    name: "flex-decorators",
    homepage: "https://zhangfisher.github.io/flex-decorators",
    description: t('简化装饰器开发的工具库')
  },
  {
    title: 'voerkalogger',
    author: "zhangfisher",
    name: "voerkalogger",
    homepage: "https://zhangfisher.github.io/voerkalogger",
    description: t('日志工具库')
  },
  {
    title: 'vue-style-bundler',
    author: "zhangfisher",
    homepage: "https://github.com/zhangfisher/vite-plugin-vue-style-bundler",
    name: "vite-plugin-vue-style-bundler",
    description: t('Vite插件/将Vue组件中的样式注入到JS文件中')
  },
  {
    title: 'mixcli',
    author: "zhangfisher",
    homepage: "https://zhangfisher.github.io/mixcli",
    name: "mixcli",
    description: t('增强型命令行开发工具，能自动生成交互提示')
  },
  {
    title: 'logsets',
    author: "zhangfisher",
    homepage: "https://zhangfisher.github.io/logsets",
    name: "logsets",
    description: t('终端输出增强组件')
  },
  {
    title: 'json_comments_extension',
    author: "zhangfisher",
    name: "json_comments_extension",
    homepage: "https://github.com/zhangfisher/json_comments_extension",
    description: t('VSCODE插件/支持为任意JSON文件注入注释')
  },
  {
    title: 'AsyncSignal',
    author: "zhangfisher",
    name: "asyncsignal",
    homepage: "https://github.com/zhangfisher/asyncsignal",
    description: t('异步信号处理库')
  },
  {
    title: 'PrismaShell',
    author: "zhangfisher",
    name: "prisma-shell",
    homepage: "https://github.com/zhangfisher/prisma-shell",
    description: t('prisma数据库交互式控制台')
  },
  {
    title: 'unplugin-embed',
    author: "zhangfisher",
    name: "unplugin-embed",
    homepage: "https://github.com/zhangfisher/unplugin-embed",
    description: t('将文件以base64方式嵌入到了源码的vite/webpack/esbuild/...插件')
  },
  {
    title: 'svg-captcha-embed',
    author: "zhangfisher",
    name: "svg-captcha-embed",
    homepage: "https://github.com/zhangfisher/svg-captcha-embed",
    description: t('生成captcha图片')
  },
  {
    title: 'bcp47-language-tags',
    author: "zhangfisher",
    name: "bcp47-language-tags",
    homepage: "https://github.com/zhangfisher/bcp47-language-tags",
    description: t('符合简化BCP47规格的语言编码库')
  },
];


</script>
