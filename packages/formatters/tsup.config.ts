import { defineConfig } from 'tsup' 

// 分析包大小 https://www.bundle-buddy.com/
const formatters:any = [    
    "datetime/date.ts",
    "datetime/time.ts",
    "datetime/timeSlots.ts",
    "datetime/weekday.ts",
    "datetime/month.ts",
    "datetime/quarter.ts",
    "datetime/relativeTime.ts"
]
 

export default defineConfig([
        {
            entry: [
                'src/index.ts'
            ],
            format: ['esm','cjs','iife'],
            dts: true,
            splitting: false,
            sourcemap: true,
            clean: true,
            treeshake:true,   
            minify: false,
            noExternal:['flex-tools'], 
            globalName: 'VoerkaI18nFormatters',
            cjsInterop: false,
            banner: {
                js: `/***        
            *   ---=== VoerkaI18n Formatters ===---
            *   https://zhangfisher.github.io/voerka-i18n/*
            */`}
        },
        ...formatters.map((name:string) => ({
                entry: [
                    `src/${name}`  
                ],
                format: ['esm','cjs','iife'],
                outDir: `./dist/datetime/`,
                dts: true,
                splitting: false,
                sourcemap: true,
                clean: true,
                treeshake:true,  
                cjsInterop: false,
                minify: true,
                noExternal:['flex-tools'],
                globalName: `VoerkaI18n${name.split("/")[1].charAt(0).toUpperCase() + name.split("/")[1].slice(1)}Formatters`
            })),
        {
            entry: [
                `src/number/index.ts`   
            ],
            format: ['esm','cjs','iife'],
            dts: true,
            outDir: './dist/number/',
            splitting: false,
            sourcemap: true,
            clean: true,
            treeshake:true,  
            cjsInterop: false,
            minify: true,
            noExternal:['flex-tools'],
            globalName: `VoerkaI18nNumberFormatter`
        },{
            entry: [
                `src/currency/index.ts`        
            ],
            outDir: './dist/currency/',
            format: ['esm','cjs','iife'],
            dts: true,
            splitting: false,
            sourcemap: true,
            clean: true,
            treeshake:true,  
            cjsInterop: false,
            minify: true,
            noExternal:['flex-tools'],
            globalName: `VoerkaI18nCurrencyFormatter`
        }
    ]
) 