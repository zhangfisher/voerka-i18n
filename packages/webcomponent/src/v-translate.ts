import { html, LitElement } from 'lit'
import { customElement,state, property } from 'lit/decorators.js' 
import { VoerkaI18nManager, VoerkaI18nScope } from '@voerkai18n/runtime'; 

@customElement('v-translate')
export class TranslateElement extends LitElement {
  
  _subscriber: any
  _scope: VoerkaI18nScope | undefined

  @state()
  result = ''  
  @property({ type: String })
  id = ''
  @property({ type: String })
  message = ''
  @property({ type: Array })
  vars = []
  @property({ type: Object })
  options = {}
  @property({ type: String })
  scope = ''

  connectedCallback() {
    super.connectedCallback()
    this._scope = this._getScope() 
    this.result = this.message
    if (this._scope) {
      this._scope.on('ready', this._onChangeLanguage.bind(this))
      this._subscriber = this._scope.on('change', this._onChangeLanguage.bind(this))
    }
  }

  private _onChangeLanguage() {
    const isParagraph = this.id && this.id.length > 0 
    if(isParagraph){
      this.result = this._scope?.activeParagraphs[this.id] || ''
    }else{
      this.result = this._scope!.t(this.message,this.vars,this.options)
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this._subscriber && this._subscriber.off()
  }

  private _getScope() {
    const manager: VoerkaI18nManager = (window as any).VoerkaI18n
    if (!manager) return
    const scopeId = this.scope
    const scope = manager.scopes.find(scope => scope.id === scopeId) || manager.scope
    return scope
  }

  render() {
    const isParagraph = this.id && this.id.length > 0 
    let dataId = this._scope!.getMessageId(this.message)
    if(isParagraph) dataId = this.id
 
    const scopeId =  this._scope?.library  ? this._scope?.$id : undefined    
   
    this.setAttribute('class','vt-msg')
    if(dataId) this.setAttribute('data-id',dataId)    
    if(scopeId) this.setAttribute('data-scope',String(scopeId))
    return html`${this.result}`      
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'v-translate': TranslateElement
  }
}

