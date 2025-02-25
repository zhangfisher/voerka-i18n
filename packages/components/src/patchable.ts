import { VoerkaI18nManager } from "@voerkai18n/runtime";



export type VoerkaI18nMessagePatchArgs = {
    language  : string
    message   : string
    id        : string
}

export type VoerkaI18nMessagePatchableOptions = { 
    enable? : boolean
    url?    : string | undefined     
    onSubmit: (args:VoerkaI18nMessagePatchArgs)=>boolean
}


export class VoerkaI18nMessagePatchable{
    el: HTMLElement | undefined                     // 当前编辑的元素
    updating:boolean = false                        // 正在更新中
    private _options:Required<VoerkaI18nMessagePatchableOptions> 
    constructor(public manager:VoerkaI18nManager,options?:VoerkaI18nMessagePatchableOptions){
        this._options = Object.assign({  
            enable:true,
            onSubmit: ()=>true
        },options) as Required<VoerkaI18nMessagePatchableOptions>
        this.enable = this._options.enable
    }
    get enable(){ return this._options.enable}
    set enable(val:boolean){
        if(this._options.enable!==val){
            if(val){
                this._bindEvents()
            }else{
                this._onLeaveUpdate()
                this._unbindEvents()
            }
        }
        this._options.enable = val
    }

    private _bindEvents(){
        window.addEventListener('click',this._onMessageEvents)
        window.addEventListener('keydown',this._onMessageEvents)        
        window.addEventListener('focus',this._onMessageEvents)
        window.addEventListener('blur', this._onMessageEvents)
    }

    private _onMessageEvents(e:Event){
        const targetEle = e.target as HTMLElement
        if(this._isMessageElement(targetEle)){            
            switch(e.type){
                case 'click':                    
                    if((targetEle != this.el) || this.el==undefined || (this.el==targetEle && !this.updating)){              
                        this.el = targetEle
                        this._onEnterUpdate() 
                    }                    
                    break
                case 'keydown':
                    if(e instanceof KeyboardEvent && e.key === 'Enter'){
                        e.preventDefault()
                        this._onSubmit()
                    }
                    break
                case 'focus':
                    if((targetEle != this.el) || this.el==undefined || (this.el==targetEle && !this.updating)){              
                        this.el = targetEle
                        this._onEnterUpdate() 
                    }
                    break
                case 'blur':
                    this._onLeaveUpdate()
                    if(this.el == targetEle && this.updating){
                        this._onSubmit()
                    }
                    break
            }
        }
    }

    private _unbindEvents(){
        window.removeEventListener('click', this._onMessageEvents)
        window.removeEventListener('keydown', this._onMessageEvents)
        window.removeEventListener('blur', this._onMessageEvents)
        window.removeEventListener('focus', this._onMessageEvents)
    }
  

    private _onLeaveUpdate(){
        this.updating = false
        if(this.el){
            this.el?.removeAttribute('contenteditable')
            this.el.classList.remove('editing')
        }        
        this.el = undefined
    }

    private _onEnterUpdate(){
        this.updating = true
        if(this.el){
            this.el.setAttribute('contenteditable','true')
            this.el.classList.add('editing')
            this.el.style.backgroundColor = 'rgba(255,255,0,0.1)'
        } 
    }

    private _onSubmit(){
        const el = this.el!
        const msgId = el.getAttribute('data-id')
        if(msgId){
            const patch = {
                id      : msgId,
                message : el.innerText,
                language: this.manager.activeLanguage
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
                    
                }).catch((err)=>{
                    console.error(err)
                }) 
            }else{
                console.warn('[VoerkaI18n] : patch url is not configured')
            }             
        }
    }


    private _isMessageElement(target:HTMLElement){
        return target.classList.contains('vt-msg')
    }

    destory(){
        this._unbindEvents()
    }
}


 