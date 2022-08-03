import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import * as navbar from "./navbar";
import * as sidebar from "./sidebar";

export default defineUserConfig({
    base                 : "/voerka-i18n/",          // 发布位置GithubPages时
    lang                     : "zh-CN",
    locales                  : {
        "/"                  : {
            lang             : "zh-CN",
            title            : "中文"
        },
        "/en/"               : {
            lang             : "en-US",
            title            : "English"
        }
    },
    theme                    : hopeTheme({
        hostname             : "https://gitee.com/zhangfisher/voerka-i18n",
        author               : {
            name             : "wxzhang",
            url              : "https://gitee.com/zhangfisher/voerka-i18n",
        },
        iconPrefix           : "iconfont icon-",
        logo                 : "/logo.svg",
        home                 : "/zh/home",
        repo                 : "https://gitee.com/zhangfisher/voerka-i18n",    
        docsDir              : "docs",
        breadcrumb           : false,
        pageInfo             : ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],
        locales              : {
            "/"              : {
                navbar       : navbar.zh,
                sidebar      : sidebar.zh,
                displayFooter: true
            },
            "/en/"           : {
                navbar       : navbar.en,    
                sidebar      : sidebar.en,
                footer       : "Default footer",
                displayFooter: true,
            }
        },
        plugins              : { 
            mdEnhance        : {
                enableAll    : true,
                presentation : {
                    plugins  : ["highlight", "math", "search", "notes", "zoom"],
                },
            } 
        } 
    })
})
