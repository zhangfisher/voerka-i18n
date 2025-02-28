import { isBrowser } from "./isBrowser"
 
export type I18nScopeOptions = {
    translate?:(message:string)=>string  
}
export class I18nScope{
    static instance:I18nScope
    private _activeLangauge:string = "cn"
    callbacks:Record<string,any> = {}
    
    messages:Record<string,Record<string,string>> = {
        en:{
            "你好"   : "Hello",
            "客户端组件": "Client Component",
            "服务端组件": "Server Component",
            "特性"   : "Features",
            "开源项目" : "Open Source Repos"
        },
        cn:{
            "你好": "你好",
            "客户端组件": "客户端组件",
            "服务端组件": "服务端组件",
            "特性": "特性",
            "开源项目": "开源项目",
        }
    }
    options:I18nScopeOptions = {}
    constructor(options?:I18nScopeOptions){  
        this.options = options || {}
        if(I18nScope.instance){
            return I18nScope.instance
        }
        I18nScope.instance = this
        globalThis.I18n = this 
        this.on(this.updateMessages.bind(this))
    }
    get activeLangauge(){
        return this._activeLangauge
    }
    set activeLangauge(lang:string){
        this._activeLangauge = lang
        Object.values(this.callbacks).forEach((callback:any)=>{
            callback(lang)
        })
    }
    on(callback:any){
        let id = Math.random().toString(36).substring(2, 9)
        this.callbacks[id] = callback
        
        //this._onMutationObserver()

        return ()=>delete this.callbacks[id]
    } 

    t(message:string):any{ 
        const result = this.messages[this.activeLangauge][message] || message
        if(typeof(this.options.translate)==='function'){
            return this.options.translate(result)
        }
        return result
    }

    updateMessages(){
        const msgEle = document.querySelectorAll(".vt-msg")
        msgEle.forEach((ele)=>{
            const msg = ele.getAttribute("data-id")
            if(msg){
                ele.innerHTML = this.t(msg)
            }
        })
    }

}

export const scope = new I18nScope({
    translate: isBrowser() ? (message:string)=>{ return message } : undefined

}) 



// let observered:boolean = false
// function onMutationObserver(){
//     'use client'
//     if(observered)  return  
//     if(!isBrowser()) return 
//     const targetNode = document.body;

//     // 配置观察选项
//     const config = {
//         childList: true, // 观察目标子节点的变化
//         // subtree: true   // 观察整个子树
//     };
//     const self = scope
//     // 当观察到变化时执行的回调函数
//     const callback: MutationCallback= function(mutationsList, observer) {
//         // 显示mutationsList
//         for(const mutation of mutationsList) {
//             if (mutation.type == 'childList') {
//                 console.log(mutation.target.nodeName)
//             }
//         }
//         scope._onChangeLanguage(scope.activeLangauge)
//     };

//     // 创建一个 MutationObserver 实例并传入回调函数
//     const observer = new MutationObserver(callback);

//     // 开始观察目标节点
//     observer.observe(targetNode, config);
//     observered = false
// }

// onMutationObserver()

declare global {
    var I18n: I18nScope
}