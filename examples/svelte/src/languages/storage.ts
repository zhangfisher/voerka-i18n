import type { IVoerkaI18nStorage } from "@voerkai18n/runtime" 

export default {
    get(key:string){
        if(globalThis.localStorage){
            return globalThis.localStorage.getItem(key)
        }
    },
    set(key:string,value:any){
        if(globalThis.localStorage){
            globalThis.localStorage.setItem(key,value)
        }
    },
    remove(key:string){
        if(globalThis.localStorage){
            globalThis.localStorage.removeItem(key)
        }
    }
} as IVoerkaI18nStorage