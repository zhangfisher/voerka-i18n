import { defineConfig } from 'vite' 
import path from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/v-translate.ts'),
      formats: ['es',"cjs","umd","iife","system"],
      name: 'VoerkaI18nTranslate',
      fileName: (format) => {
        if(format === 'es') {
          return 'v-translate.js'
        }else if(format === 'cjs') {
          return 'v-translate.cjs'          
        }else{
          return `v-translate.${format}.js`
        }
      }
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          
        }
      }
    }
  }
})