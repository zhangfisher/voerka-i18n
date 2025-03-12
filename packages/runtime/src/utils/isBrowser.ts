export function isBrowser():boolean {
    try{
    return typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';
    }catch{
        return false
    }
}