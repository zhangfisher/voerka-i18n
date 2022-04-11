import { defineNavbarConfig } from "vuepress-theme-hope";

export const en = defineNavbarConfig([
  "/en/",
  "/home",
  { text: "Guide", icon: "creative", link: "/guide/" }
]);
