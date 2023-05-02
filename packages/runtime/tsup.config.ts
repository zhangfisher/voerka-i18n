import { defineConfig } from 'tsup' 


export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:false,  
    minify: false,
    banner: {
        js: `/***        
*   ---=== VoerkaI18n Runtime ===---
*   https://zhangfisher.github.io/voerka-i18n/*
*/`}
}) 