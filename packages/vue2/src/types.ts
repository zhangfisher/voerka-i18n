export {}

import vue from "vue/types/vue"

declare module 'vue/types/vue' {    
    interface Vue {
        t(message:string,...args:any[]):string
        changeLanguage:(language:string)=>Promise<any>
    }
}
