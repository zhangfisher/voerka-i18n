/**
 * 只处理服务器端组件的翻译
 * @param refresh   
 * @returns 
 */
export function applyTranslate(refresh?:boolean){ 
    const manager = globalThis.VoerkaI18n
    const elements = document.querySelectorAll(`.vt-msg.s${refresh ? '' : ':not([done])'}`)        
    elements.forEach((ele)=>{
        const msgId   = ele.getAttribute("data-id")
        const scopeId = ele.getAttribute("data-scope")
        if(msgId){
            const scope = manager.getScope(scopeId) || manager.scope
            if(scope){
                ele.innerHTML = scope.t(msgId)
                ele.removeAttribute("done")
            }
        }
    })
}