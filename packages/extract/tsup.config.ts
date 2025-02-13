import { defineConfig } from 'tsup' 
import copyFiles from "esbuild-plugin-copy"

// 分析包大小 https://www.bundle-buddy.com/

export default defineConfig(
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
        minify: false,
        noExternal:['flex-tools'], 
        esbuildPlugins: [
            copyFiles({
                assets:{
                    from:"./src/schemas/*.yaml",
                    to:'./'
                }
            })
        ],
        banner: {
            js: `/***        
    *   ---=== VoerkaI18n Extract Tool ===---
    *   https://zhangfisher.github.io/voerka-i18n/
    */`}
    }) 