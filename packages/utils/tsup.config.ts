import { defineConfig } from 'tsup' 

// 分析包大小 https://www.bundle-buddy.com/

export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    minify: false,
    noExternal:['flex-tools'],
    banner: {
        js: `/***        
*   ---=== VoerkaI18n Utils ===---
*   https://zhangfisher.github.io/voerka-i18n/
*/`}
}) 