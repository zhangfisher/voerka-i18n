import { isBrowser, VoerkaI18nManager } from "@voerkai18n/runtime"

/**
 * 只处理服务器端组件的翻译
 * @param manager 
 * @returns 
 */
export function applyTranslate(manager?:VoerkaI18nManager){ 
    if(!isBrowser()) return
    if(!manager) manager = globalThis.VoerkaI18n
    const elements = document.querySelectorAll(".vt-msg.s:not([data-done])")        
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