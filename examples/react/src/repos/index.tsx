import { GitFork, Star } from "lucide-react";

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



function FillStar(){
    return (<svg
        className="h-4 w-4 text-yellow-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
      </svg>
    )
}
export default function Repos() {
  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12 mt-18 pt-8 px-8 min-h-lvh">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="h-56 w-full">
              <a href="#">
                <img
                  className="mx-auto h-full dark:hidden"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                  alt=""
                />
                <img
                  className="mx-auto hidden h-full dark:block"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                  alt=""
                />
              </a>
            </div>
            <div className="pt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="flex me-2 rounded bg-primary-100 px-0 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  <FillStar/><FillStar/><FillStar/><FillStar/><FillStar/>
                </span>

                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    data-tooltip-target="tooltip-quick-look"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <GitFork />
                  </button> 

                  <button
                    type="button"
                    data-tooltip-target="tooltip-add-to-favorites"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Star />
                  </button> 
                </div>
              </div>

              <a
                href="#"
                className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
              >
                VoerkaI18n
              </a>

              <div className="mt-2 flex items-center gap-2">

                <p className="text-sm font-medium text-gray-900 dark:text-white">
                全流程国际化解决方案
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <button type="button"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            更多开源项目...
          </button>
        </div>
      </div>
      {/* <!-- Filter modal --> */}
      <form
        action="#"
        method="get"
        id="filterModal"
        tabindex="-1"
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full"
      >
        <div className="relative h-full w-full max-w-xl md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
            {/* <!-- Modal header --> */}
            <div className="flex items-start justify-between rounded-t p-4 md:p-5">
              <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                Filters
              </h3>
              <button
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="filterModal"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div className="px-4 md:px-5">
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul
                  className="-mb-px flex flex-wrap text-center text-sm font-medium"
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist"
                >
                  <li className="mr-1" role="presentation">
                    <button
                      className="inline-block pb-2 pr-1"
                      id="brand-tab"
                      data-tabs-target="#brand"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      Brand
                    </button>
                  </li>
                  <li className="mr-1" role="presentation">
                    <button
                      className="inline-block px-2 pb-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                      id="advanced-filers-tab"
                      data-tabs-target="#advanced-filters"
                      type="button"
                      role="tab"
                      aria-controls="advanced-filters"
                      aria-selected="false"
                    >
                      Advanced Filters
                    </button>
                  </li>
                </ul>
              </div>
              <div id="myTabContent">
                <div
                  className="grid grid-cols-2 gap-4 md:grid-cols-3"
                  id="brand"
                  role="tabpanel"
                  aria-labelledby="brand-tab"
                >
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      A
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="apple"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="apple"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Apple (56){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="asus"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="asus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Asus (97){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="acer"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="acer"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Acer (234){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="allview"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="allview"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Allview (45){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="atari"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="asus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Atari (176){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="amd"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="amd"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        AMD (49){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="aruba"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="aruba"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Aruba (16){" "}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      B
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="beats"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="beats"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Beats (56){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="bose"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="bose"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Bose (97){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="benq"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="benq"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        BenQ (45){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="bosch"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="bosch"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Bosch (176){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="brother"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="brother"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Brother (176){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="biostar"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="biostar"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Biostar (49){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="braun"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="braun"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Braun (16){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="blaupunkt"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="blaupunkt"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Blaupunkt (45){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="benq2"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="benq2"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        BenQ (23){" "}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      C
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="canon"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="canon"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Canon (49){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="cisco"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="cisco"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Cisco (97){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="cowon"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="cowon"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Cowon (234){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="clevo"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="clevo"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Clevo (45){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="corsair"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="corsair"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Corsair (15){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="csl"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="csl"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Canon (49){" "}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      D
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="dell"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="dell"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dell (56){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="dogfish"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="dogfish"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dogfish (24){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="dyson"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="dyson"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dyson (234){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="dobe"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="dobe"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dobe (5){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="digitus"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="digitus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Digitus (1){" "}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      E
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="emetec"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="emetec"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Emetec (56){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="extreme"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="extreme"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Extreme (10){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="elgato"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="elgato"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Elgato (234){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="emerson"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="emerson"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Emerson (45){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="emi"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="emi"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        EMI (176){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="fugoo"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="fugoo"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fugoo (49){" "}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      F
                    </h5>

                    <div className="flex items-center">
                      <input
                        id="fujitsu"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="fujitsu"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fujitsu (97){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="fitbit"
                        type="checkbox"
                        value=""
                        checked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="fitbit"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fitbit (56){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="foxconn"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="foxconn"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Foxconn (234){" "}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="floston"
                        type="checkbox"
                        value=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                      />

                      <label
                        for="floston"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Floston (45){" "}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="space-y-4"
                id="advanced-filters"
                role="tabpanel"
                aria-labelledby="advanced-filters-tab"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        for="min-price"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Min Price{" "}
                      </label>
                      <input
                        id="min-price"
                        type="range"
                        min="0"
                        max="7000"
                        value="300"
                        step="1"
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label
                        for="max-price"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Max Price{" "}
                      </label>
                      <input
                        id="max-price"
                        type="range"
                        min="0"
                        max="7000"
                        value="3500"
                        step="1"
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between space-x-2">
                      <input
                        type="number"
                        id="min-price-input"
                        value="300"
                        min="0"
                        max="7000"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 "
                        placeholder=""
                        required
                      />

                      <div className="shrink-0 text-sm font-medium dark:text-gray-300">
                        to
                      </div>

                      <input
                        type="number"
                        id="max-price-input"
                        value="3500"
                        min="0"
                        max="7000"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        for="min-delivery-time"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Min Delivery Time (Days){" "}
                      </label>

                      <input
                        id="min-delivery-time"
                        type="range"
                        min="3"
                        max="50"
                        value="30"
                        step="1"
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>

                    <input
                      type="number"
                      id="min-delivery-time-input"
                      value="30"
                      min="3"
                      max="50"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 "
                      placeholder=""
                      required
                    />
                  </div>
                </div>

                <div>
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Condition
                  </h6>

                  <ul className="flex w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <li className="w-full border-r border-gray-200 dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-all"
                          type="radio"
                          value=""
                          name="list-radio"
                          checked
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                        />
                        <label
                          for="condition-all"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          All{" "}
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-r border-gray-200 dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-new"
                          type="radio"
                          value=""
                          name="list-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                        />
                        <label
                          for="condition-new"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          New{" "}
                        </label>
                      </div>
                    </li>
                    <li className="w-full">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-used"
                          type="radio"
                          value=""
                          name="list-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-primary-600"
                        />
                        <label
                          for="condition-used"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Used{" "}
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Colour
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="blue"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="blue"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-primary-600"></div>
                          Blue
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="gray"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="gray"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-gray-400"></div>
                          Gray
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="green"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="green"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-green-400"></div>
                          Green
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="pink"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="pink"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-pink-400"></div>
                          Pink
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="red"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="red"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-red-500"></div>
                          Red
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Rating
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="five-stars"
                          type="radio"
                          value=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          for="five-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="four-stars"
                          type="radio"
                          value=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          for="four-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="three-stars"
                          type="radio"
                          value=""
                          name="rating"
                          checked
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          for="three-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="two-stars"
                          type="radio"
                          value=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          for="two-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="one-star"
                          type="radio"
                          value=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />
                        <label
                          for="one-star"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Weight
                    </h6>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="under-1-kg"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="under-1-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Under 1 kg{" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="1-1-5-kg"
                          type="checkbox"
                          value=""
                          checked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="1-1-5-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          1-1,5 kg{" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="1-5-2-kg"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="1-5-2-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          1,5-2 kg{" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="2-5-3-kg"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="2-5-3-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          2,5-3 kg{" "}
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="over-3-kg"
                          type="checkbox"
                          value=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                        />

                        <label
                          for="over-3-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Over 3 kg{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Delivery type
                  </h6>

                  <ul className="grid grid-cols-2 gap-4">
                    <li>
                      <input
                        type="radio"
                        id="delivery-usa"
                        name="delivery"
                        value="delivery-usa"
                        className="peer hidden"
                        checked
                      />
                      <label
                        for="delivery-usa"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            USA
                          </div>
                          <div className="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-europe"
                        name="delivery"
                        value="delivery-europe"
                        className="peer hidden"
                      />
                      <label
                        for="delivery-europe"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Europe
                          </div>
                          <div className="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-asia"
                        name="delivery"
                        value="delivery-asia"
                        className="peer hidden"
                        checked
                      />
                      <label
                        for="delivery-asia"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Asia
                          </div>
                          <div className="w-full">Delivery only for Asia</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-australia"
                        name="delivery"
                        value="delivery-australia"
                        className="peer hidden"
                      />
                      <label
                        for="delivery-australia"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Australia
                          </div>
                          <div className="w-full">
                            Delivery only for Australia
                          </div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- Modal footer --> */}
            <div className="flex items-center space-x-4 rounded-b p-4 dark:border-gray-600 md:p-5">
              <button
                type="submit"
                className="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
              >
                Show 50 results
              </button>
              <button
                type="reset"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
