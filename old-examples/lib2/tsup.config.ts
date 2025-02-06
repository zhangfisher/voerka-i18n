import { defineConfig } from 'tsup' 

// 分析包大小 https://www.bundle-buddy.com/

export default defineConfig({
    entry: [
        'src/index.ts'
    ],    
    dts:true,
    format: ['cjs'],
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    minify: false,
    noExternal: [
        "@voerkai18n/runtime"
    ]
}) 