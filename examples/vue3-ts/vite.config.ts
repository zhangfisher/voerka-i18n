import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [        
    Inspect(),  // localhost:3000/__inspect/ 
    Voerkai18nPlugin({
        debug:true,
        autoImport:false
    }), 
    vue()],
})
