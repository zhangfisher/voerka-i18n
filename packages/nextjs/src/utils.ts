import { isBrowser, VoerkaI18nManager } from "@voerkai18n/runtime"

export function applyTranslate(manager?:VoerkaI18nManager){ 
    if(!isBrowser()) return
    if(!manager) manager = globalThis.VoerkaI18n
    const elements = document.querySelectorAll(".vt-msg:not([data-done])")        
    elements.forEach((ele)=>{
        const msgId   = ele.getAttribute("data-id")
        const scopeId = ele.getAttribute("data-scope")
        if(msgId){
            const scope = manager.getScope(scopeId) || manager.scope
            if(scope){
                ele.innerHTML = scope.t(msgId)
                ele.setAttribute("data-done","")
            }
        }
    })
}