import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import i18nPlugin from '@voerkai18n/plugins/vite'
import { resolve } from 'path';
import viteInspector from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteInspector(),     
    tailwindcss(),
    i18nPlugin({debug:true}),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'v-translate'
        }
      }
    })
  ],
  resolve:{
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue', '.json']
  }
}) 