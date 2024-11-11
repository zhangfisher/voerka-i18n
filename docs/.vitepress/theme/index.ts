// https://vitepress.dev/guide/custom-theme
// @ts-ignore
import { h } from 'vue'
import type { Theme, } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { LiteTree } from "@lite-tree/vue"
import "@lite-tree/icons/filetypes.css"
import Tree from "./Tree.vue" 
 
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app }) {
    // ...
    app.component('LiteTree',LiteTree )  
    app.component('Tree',Tree )   
  }
} satisfies Theme
