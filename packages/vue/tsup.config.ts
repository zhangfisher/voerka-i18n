import { defineConfig } from 'tsup' 
import copyFiles from "esbuild-plugin-copy"


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
        banner: {
            js: `/***
            *   ---=== VoerkaI18n for Vue ===---
            *   https://zhangfisher.github.io/voerka-i18n
            */`
        }
    },
    {
        entry: [
            'src/postinstall/index.ts'
        ],
        outDir: 'dist/postinstall',
        format: ['esm','cjs'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        treeshake:true,  
        minify: true, 
        esbuildPlugins: [
            // @ts-ignore
            copyFiles({
                assets:{
                    from:"./src/postinstall/templates/*.*",
                    to:'./templates'
                }
            })
        ]
    }
]) 