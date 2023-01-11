import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        Inspect(),  // localhost:3000/__inspect/ 
        // Voerkai18nPlugin({ debug: true }),
        react()
    ]
})
