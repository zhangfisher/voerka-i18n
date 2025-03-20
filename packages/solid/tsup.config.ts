import { defineConfig } from 'tsup' 
import copyFiles from "esbuild-plugin-copy"


export default defineConfig([{
    entry: [
        'src/index.ts',
        'src/client/index.ts',
        'src/server/index.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:true,   
    minify: false,
    noExternal:['flex-tools','@voerkai18n/react'],
    cjsInterop: false,       
    esbuildPlugins: [
        // @ts-ignore
        copyFiles({
            assets:{
                from:"./src/install/**/*",
                to:'./install'
            }
        })
    ], 
    banner: {
        js: `/***        
    *   ---=== VoerkaI18n for Nextjs ===---
    *   https://zhangfisher.github.io/voerka-i18n/*
    */`}
}]) 