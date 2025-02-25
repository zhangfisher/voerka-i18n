import { VoerkaI18nManager } from "@voerkai18n/runtime";
import { VoerkaI18nMessagePatchableOptions, VoerkaI18nMessagePatchArgs } from "./types";



export class VoerkaI18nMessagePatchable{
    el     : HTMLElement | undefined                        // 当前编辑的元素
    editing: boolean = false                                // 正在编辑中
    private _options:Required<VoerkaI18nMessagePatchableOptions> 
    private _eventListener:any
    constructor(public manager:VoerkaI18nManager,options?:VoerkaI18nMessagePatchableOptions){
        this._options = Object.assign({  
            enable  : false,
            url     : "/api/voerkai18n/patch",
            showMark: true
        },options) as Required<VoerkaI18nMessagePatchableOptions>
        this.enable = this._options.enable
    }
    get options(){ return this._options }
    get enable(){ return this._options.enable}
    set enable(val:boolean){
        if(this._options.enable!==val){
            if(val){
                this._bindEvents()
                window.document.body.classList.add('vt-patching')
                this._addMarkStyle()
            }else{
                this._onLeaveEdit()
                this._unbindEvents()
                window.document.body.classList.remove('vt-patching')
                this._removeMarkStyle()
            }
        }
        this._options.enable = val
    }

    private _bindEvents(){
        this._eventListener = this._onMessageEvents.bind(this)
        window.document.addEventListener('click',this._eventListener)
        window.document.addEventListener('keydown',this._eventListener)        
        window.document.addEventListener('focusin',this._eventListener)
        window.document.addEventListener('focusout', this._eventListener)
    }
    /**
     * 在当前页面添加样式
     * 
     */
    private _addMarkStyle(){
        if(!this.options.showMark) return 
        const style = document.createElement('style')
        style.id = 'voerkai18nt-patching-style'
        style.innerHTML = `
            .vt-patching .vt-msg{
                background-color:#fbff002e;
                outline: none;
            }
            .vt-patching .vt-msg.editing{
                border:1px solid #ffeb3b;
                border-radius: 4px;
            }
        `
        document.head.appendChild(style)

    }
    private _removeMarkStyle(){
        const style = document.getElementById('voerkai18nt-patching-style')
        if(style){
            style.remove()
        }
    }

    private _onMessageEvents(e:Event){
        const targetEle = e.target as HTMLElement
        if(this._isMessageElement(targetEle)){     
            switch(e.type){
                case 'click':                    
                    if((targetEle != this.el) || this.el==undefined || (this.el==targetEle && !this.editing)){              
                        if(this.editing) this._onLeaveEdit()
                        this.el = targetEle
                        this._onEnterEdit() 
                    }                    
                    break
                case 'keydown':
                    if(e instanceof KeyboardEvent && e.key === 'Enter'){
                        e.preventDefault()
                        this._onSubmit()
                        if(this.editing) this._onLeaveEdit()
                    }
                    break
                case 'focusin':
                    if((targetEle != this.el) || this.el==undefined || (this.el==targetEle && !this.editing)){              
                        this.el = targetEle
                        this._onEnterEdit() 
                    }
                    break
                case 'focusout':
                    if(this.el == targetEle && this.editing){
                        this._onSubmit()
                    }
                    this._onLeaveEdit()
                    break
            }
        }
    }

    private _unbindEvents(){
        if(this._eventListener){
            window.document.removeEventListener('click', this._eventListener)
            window.document.removeEventListener('keydown', this._eventListener)
            window.document.removeEventListener('focusin', this._eventListener)
            window.document.removeEventListener('focusout', this._eventListener)
            this._eventListener = undefined
        }
    }

    private _onEnterEdit(){
        if(this.el){ 
            const msgId = this.el.getAttribute('data-id')    
            if(msgId){
                this.editing = true
                this.el.setAttribute('contenteditable','true')
                this.el.classList.add('editing')
                this.el.style.backgroundColor = '#fbff002e'
            }
        } 
    }  

    private _onLeaveEdit(){
        this.editing = false
        if(this.el){
            this.el?.removeAttribute('contenteditable')
            this.el.classList.remove('editing')
            this.el.style.backgroundColor = ''
        }        
        this.el = undefined
    }

    private _onSubmit(){
        const el = this.el!
        const msgId = el.getAttribute('data-id')
        const scopeIdAttr = el.getAttribute('data-scope')
        if(msgId){
            const appScopeId = this.manager.scope.id
            let scopeId:string = appScopeId
            if(scopeIdAttr){
                const index = this.manager.scopes.findIndex(scope=>String(scope.$id)===scopeIdAttr)
                scopeId = index>-1 ? this.manager.scopes[index].id : appScopeId
            } 
 
            const patch = {
                id      : msgId,
                message : el.innerText,
                language: this.manager.activeLanguage,
                scope: scopeId
            }         
            // 使用fetch将path提交到服务器
            if(this._options.url){
                fetch(this._options.url,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(patch)
                }).then(()=>{
                    this._updateMessage(patch)
                }).catch((err)=>{
                    console.error(err)
                }) 
            }else{
                console.warn('[VoerkaI18n] : patch url is not configured')
            }             
        }
    }
    /**
     * 
     * 当提交成功后调用此方法来更新语言包
     * 
     */
    private _updateMessage(patch:VoerkaI18nMessagePatchArgs){
        this.editing = false 
        const scope = this.manager.getScope(patch.scope)
        if(scope && (patch.id in scope.activeMessages)){
            scope.activeMessages[patch.id] = patch.message
        }
    }

    private _isMessageElement(target:HTMLElement){
        return target.classList.contains('vt-msg')
    }

    destory(){
        this.enable = false
    }
}


 