import { defineThemeConfig } from "vuepress-theme-hope";
import * as navbar from "./navbar";
import * as sidebar from "./sidebar";

export default defineThemeConfig({
  hostname: "https://vuepress-theme-hope-v2-demo.mrhope.site",
  author: {
    name: "wxzhang",
    url: "https://mrhope.site",
  },

  iconPrefix: "iconfont icon-",

  logo: "/logo.svg",

  home:"/zh/home",
  repo: "https://gitee.com/zhangfisher/voerka-i18n",

  docsDir: "docs",
  breadcrumb :false,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],
 
  locales: {
    /**
     * Chinese locale config
     */
     "/": {
        // navbar
        navbar: navbar.zh,
  
        // sidebar
        sidebar: sidebar.zh,
  
        //footer: "默认页脚",
  
        displayFooter: true 
      },
      "/en/": {
      // navbar
      navbar: navbar.en,

      // sidebar
      sidebar: sidebar.en,

      footer: "Default footer",
      displayFooter: true,
    }
  },
  plugins: {
    // If you don't need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    // comment: {
    //   /**
    //    * Using giscus
    //    */
    //   type: "giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",

    //   /**
    //    * Using twikoo
    //    */
    //   // type: "twikoo",
    //   // envId: "https://twikoo.ccknbc.vercel.app",

    //   /**
    //    * Using Waline
    //    */
    //   // type: "waline",
    //   // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
