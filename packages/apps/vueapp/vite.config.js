import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import { babel } from '@rollup/plugin-babel'; 
import Inspect from 'vite-plugin-inspect'
import Voerkai18nPlugin from "@voerkai18n/vite"

 
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        //legacy(),
        //babel(),
        Inspect(),  // localhost:3000/__inspect/ 
        Voerkai18nPlugin({
            debug:true,
            autoImport:false
        }), 
        vue()
    ],
    resolve:{
        alias:{
            "voerkai18n":"./languages/index.js"
        }
    },
    build:{
        rollupOptions:{
            include:["@voerkai18n/vue"]
        }
    }
})
