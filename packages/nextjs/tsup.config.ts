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
    treeshake:true,   
    minify: false,
    noExternal:['flex-tools'],
    cjsInterop: false,
    banner: {
        js: `/***        
    *   ---=== VoerkaI18n for Nextjs ===---
    *   https://zhangfisher.github.io/voerka-i18n/*
    */`}
}
) 