import { defineConfig } from 'tsup' 
import copyFiles from "esbuild-copy-static-files"

// 分析包大小 https://www.bundle-buddy.com/

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
        minify: false,
        noExternal:['flex-tools'], 
        banner: {
            js: `/***        
    *   ---=== VoerkaI18n Utils ===---
    *   https://zhangfisher.github.io/voerka-i18n/
    */`}
    },
    {
        entry: [
            'src/extractMessages/index.ts'
        ],
        publicDir: 'src/extractMessages/configs',
        outDir: 'dist/extractMessages',
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
                src: './src/extractMessages/schemas',
                dest: './dist/extractMessages',
                filter: (source:string,dest)=>{
                    return source.endsWith('.yaml')
                }
            })
        ],
        banner: {
            js: `/***        
    *   ---=== VoerkaI18n Utils ===---
    *   https://zhangfisher.github.io/voerka-i18n/
    */`}
    },
]) 