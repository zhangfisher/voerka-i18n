import { defineHopeConfig } from "vuepress-theme-hope";
import themeConfig from "./themeConfig";

export default defineHopeConfig({
  base: "/voerka-i18n/",
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css",
      },
    ],
  ],
  locales: {
    "/": {
      lang: "zh-CN",
      title: "VoerkaI18n",
      description: "适用于Nodejs/Vue/React的国际化解决方案",
    },
    "/en/": {
      lang: "en-US",
      title: "VoerkaI18n",
      description: "适用于Nodejs/Vue/React的国际化解决方案",
    }
  },

  themeConfig,
});
