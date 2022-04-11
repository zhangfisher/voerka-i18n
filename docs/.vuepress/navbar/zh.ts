import { defineNavbarConfig } from "vuepress-theme-hope";

export const zh = defineNavbarConfig([
    { 
        text: "主页", 
        icon: "home", 
        link: "/" 
    },
    { 
        text: "指南", 
        link: "/zh/guide/intro" 
    },
    {
        text: "参考",
        link: "/zh/reference",
    },
    {
        text: "贡献源码",
        link: "/zh/contribute",
    }
]);


