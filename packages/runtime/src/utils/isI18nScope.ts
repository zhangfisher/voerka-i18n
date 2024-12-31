
export function isI18nScope(obj:any){
    return obj && typeof(obj)==='object' && obj.__VoerkaI18nScope__ 
}