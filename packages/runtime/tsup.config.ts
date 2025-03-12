import { defineConfig } from 'tsup' 

// 分析包大小 https://www.bundle-buddy.com/

export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['esm','cjs','iife'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    minify: true,
    noExternal:['flex-tools'],
    globalName: 'VoerkaI18n',
    banner: {
        js: `/***        
*   ---=== VoerkaI18n Runtime ===---
*   https://zhangfisher.github.io/voerka-i18n/*
*/`}
}) 