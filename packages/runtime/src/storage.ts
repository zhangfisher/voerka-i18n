

export default {
    get(key){
        if(globalThis.localStorage){
            return globalThis.localStorage.getItem(key)
        }
    },
    set(key,value){
        if(globalThis.localStorage){
            globalThis.localStorage.setItem(key,value)
        }
    }
} as IVoerkaI18nStorage