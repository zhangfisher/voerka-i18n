import { IVoerkaI18nStorage } from "@/types";


export function isStorage(obj:any):obj is IVoerkaI18nStorage{
    return obj 
        && typeof obj.get === 'function' 
        && typeof obj.set === 'function' 
        && typeof obj.remove === 'function'
}