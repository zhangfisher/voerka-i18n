import { defineConfig } from 'vite'
import i18nPlugin from '@voerkai18n/plugins/vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import viteInspector from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    i18nPlugin(),
    react(),    
    tailwindcss(),
    viteInspector(),
    
  ],
})
