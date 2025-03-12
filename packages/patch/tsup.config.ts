import { defineConfig } from 'tsup' 
 

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
    banner: {
        js: `/***        
    *   ---=== VoerkaI18n Patch Utility  ===---
    *   https://zhangfisher.github.io/voerka-i18n/*
    */`}
}) 