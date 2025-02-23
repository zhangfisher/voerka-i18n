import { defineConfig } from 'tsup' 
// import copyFiles from "esbuild-plugin-copy" 

export default defineConfig([
    {
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
        noExternal:[
            "unplugin"
        ],
        banner: {
            js: `/***
            *   ---=== VoerkaI18n plugins ===---
            *   https://zhangfisher.github.io/voerka-i18n
            */`}
    } 
]) 