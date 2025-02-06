import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from '@voerkai18n/vite'
export default defineConfig({
  plugins: [ Inspect(),Voerkai18nPlugin(),vue()]
})
