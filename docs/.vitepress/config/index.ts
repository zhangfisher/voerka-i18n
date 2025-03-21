import { defineConfig } from 'vitepress'
import en from './en'
import zh from './zh' 
import share from './share'

export default defineConfig({
    ...share,
    locales: {
        root: { label: '简体中文', ...zh,link: '/' },
        en: { label: 'English', ...en }
    }
})