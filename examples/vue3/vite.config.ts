import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';
import ViteInspector from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [  
    ViteInspector(),
    tailwindcss(),
    vue()
  ],
  resolve:{
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.vue', '.json']
  }
})
