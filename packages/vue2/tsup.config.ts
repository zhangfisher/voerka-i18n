import { defineConfig } from 'tsup' 
import copyFiles from "esbuild-plugin-copy"


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
    minify: true,
    external:["vue"],    
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
*   ---=== VoerkaI18n for Vue2 ===---
*   https://zhangfisher.github.io/voerka-i18n
*/`}
}) 