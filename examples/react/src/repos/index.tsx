import { GitFork, Star, UserRound } from "lucide-react";

const repos = [
  {
    title: "VoerkaI18n",
    author: "zhangfisher",
    name: "voerka-i18n",
    homepage: "https://zhangfisher.github.io/voerka-i18n",
    description: "全流程国际化解决方案",
    topics: [],
    focus: true,
    notes: "Nodejs/Vue/React/ReactNative/UniApp/...",
  },
  {
    title: "AutoStore",
    author: "zhangfisher",
    name: "autostore",
    homepage: "https://zhangfisher.github.io/autostore",
    description: "支持异步计算/信号组件/表单绑定的全自动状态管理库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "FlexTree ",
    author: "zhangfisher",
    name: "flextree",
    homepage: "https://zhangfisher.github.io/flextree",
    description: "Nodejs下高效的树数据库存储管理工具库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "LiteTree ",
    author: "zhangfisher",
    name: "lite-tree",
    homepage: "https://zhangfisher.github.io/lite-tree",
    description: "vitepress/dumi/docsify等文档网站专用的轻量树UI组件",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "FlexStyled",
    author: "zhangfisher",
    name: "flexstyled",
    homepage: "https://zhangfisher.github.io/flexstyled",
    description: "轻量React/CSS-IN-JS解决方案",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "FlexState",
    author: "zhangfisher",
    name: "flexstate",
    homepage: "https://zhangfisher.github.io/flexstate",
    description: "有限状态机实现",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "FlexTools",
    author: "zhangfisher",
    name: "flex-tools",
    homepage: "https://zhangfisher.github.io/flex-tools",
    description: "实用的工具函数库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "FlexVars",
    author: "zhangfisher",
    name: "flexvars",
    homepage: "https://zhangfisher.github.io/flexvars",
    description: "强大的字符串插值工具库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "flex-decorators",
    author: "zhangfisher",
    name: "flex-decorators",
    homepage: "https://zhangfisher.github.io/flex-decorators",
    description: "简化装饰器开发的工具库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "voerkalogger",
    author: "zhangfisher",
    name: "voerkalogger",
    homepage: "https://zhangfisher.github.io/voerkalogger",
    description: "日志工具库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "vue-style-bundler",
    author: "zhangfisher",
    homepage: "https://github.com/zhangfisher/vite-plugin-vue-style-bundler",
    name: "vite-plugin-vue-style-bundler",
    description: "Vite插件/将Vue组件中的样式注入到JS文件中",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "mixcli",
    author: "zhangfisher",
    homepage: "https://zhangfisher.github.io/mixcli",
    name: "mixcli",
    description: "增强型命令行开发工具，能自动生成交互提示",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "logsets",
    author: "zhangfisher",
    homepage: "https://zhangfisher.github.io/logsets",
    name: "logsets",
    description: "终端输出增强组件",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "json_comments_extension",
    author: "zhangfisher",
    name: "json_comments_extension",
    homepage: "https://github.com/zhangfisher/json_comments_extension",
    description: "VSCODE插件/支持为任意JSON文件注入注释",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "AsyncSignal",
    author: "zhangfisher",
    name: "asyncsignal",
    homepage: "https://github.com/zhangfisher/asyncsignal",
    description: "异步信号处理库",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "PrismaShell",
    author: "zhangfisher",
    name: "prisma-shell",
    homepage: "https://github.com/zhangfisher/prisma-shell",
    description: "prisma数据库交互式控制台",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "unplugin-embed",
    author: "zhangfisher",
    name: "unplugin-embed",
    homepage: "https://github.com/zhangfisher/unplugin-embed",
    description: "将文件以base64方式嵌入到了源码的vite/webpack/esbuild/...插件",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "svg-captcha-embed",
    author: "zhangfisher",
    name: "svg-captcha-embed",
    homepage: "https://github.com/zhangfisher/svg-captcha-embed",
    description: "生成captcha图片",
    topics: [],
    focus: false,
    notes: "",
  },
  {
    title: "bcp47-language-tags",
    author: "zhangfisher",
    name: "bcp47-language-tags",
    homepage: "https://github.com/zhangfisher/bcp47-language-tags",
    description: "符合简化BCP47规格的语言编码库",
    topics: [],
    focus: false,
    notes: "",
  },
];

function FillStar() {
  return (
    <svg
      className="h-4 w-4 text-yellow-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
    </svg>
  );
}
export default function Repos() {
  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-8 mt-18 pt-2 px-2 min-h-lvh">
      <div className="mx-auto max-w-screen-xl px-2 2xl:px-0">
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {
            repos.map((repo:any) => {
              return (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 hover:shadow-md">
                <div className="flex flex-row items-center justify-between">
                  <a
                    href="#"
                    className="text-lg font-semibold leading-tight text-blue-700 hover:underline dark:text-white"
                  >
                    {repo.title}
                  </a>
                  <span className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        data-tooltip-target="tooltip-quick-look"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <GitFork className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        data-tooltip-target="tooltip-add-to-favorites"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <span>
                  <UserRound className="inline text-gray-400 w-4 h-4 mr-1"/>{repo.author}
                  </span>
                  <span className="flex me-2 rounded bg-primary-100 px-0 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      <FillStar />
                      <FillStar />
                      <FillStar />
                      <FillStar />
                      <FillStar />
                  </span>
                </div>
                <div className="mt-2 min-h-16 text-gray-900 dark:text-white">
                    {repo.description}
                </div> 
              </div>
    
              )
            })
          }

        </div>
        <div className="w-full text-center">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            更多开源项目...
          </button>
        </div>
      </div>
    </section>
  );
}
