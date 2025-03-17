import Vue, { computed } from 'vue';
import { loadAsyncModule, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, type VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import type { Component } from 'vue';


export type CreateTranslateComponentOptions = {
  default?: string
  tagName?: string 
  class?  : string
  style?  : string
  loading?: Component | boolean | string
}

export type VueTranslateComponentType = Component<any,any,any,VoerkaI18nTranslateProps>  
 

export function createTranslateComponent<ComponentType=any>(options?: CreateTranslateComponentOptions) {
    const { default: defaultMessage = '',  tagName, class:className = 'vt-msg' ,style,loading:LoadingComponent } = Object.assign({ },options)
    const hasLoading:boolean = !!LoadingComponent
    
    return function (scope: VoerkaI18nScope) {
      return  Vue.component('VoerkaI18nTranslate', {
        props: {
          id: {
            type: String
          },
          message: {
            type: [String, Function], 
          },
          vars: {
            type: Array,
            default: () => []
          },          
          options: {
            type: Object,
            default: () => ({})
          },
          tag: {
              type: String
          },
          default: {
            type: String,
            default: ''
          } 
        },
        data() { 
          return {
            result        : typeof this.message === 'function' ? this.default || defaultMessage
                                  : scope.translate(this.message, this.vars, this.options),
            isLoading     : false,
            isParagraph   : typeof this.id === 'string' && this.id.length > 0,
          };
        },
        computed: {
        
        },
        mounted() { 
            this.refresh();
            // @ts-ignore
            this._subscriber = scope.on('change', this.refresh);
        },

        beforeDestroy() {
            // @ts-ignore
            this._subscriber.off();
        }, 
        methods: {
          async refresh() {
            if (this.isParagraph) {
              this.loadParagraph();
            } else {
              this.loadMessage();
            }
          },
          async loadMessage() {
            const scope=VoerkaI18n.scope
            const activeLanguage = scope.activeLanguage;
            const loader = typeof this.message === 'function'
                            ? () => (this.message as any)(activeLanguage, this.vars, this.options)
                            : () => this.message;
            const messageText = await Promise.resolve(loader());
            await scope.changing()
            this.result = scope.translate(messageText, this.vars, this.options); 
          },
          async loadParagraph() {
            const paragraphId = this.id;
            if(paragraphId){
              const loader =  scope.activeParagraphs[paragraphId]
              if(!loader) return
              this.isLoading = true
              try{                
                  const paragraphText = await loadAsyncModule(loader)
                  this.result = paragraphText
              }catch(e:any){
                  console.error(e)
              }finally{
                  this.isLoading = false
              }                        
            }                    
          }
        },
        render(h:any) {
            const tag  = this.tag || tagName|| 'div'
            const attrs:Record<string,any> = {
                class: className,
                style: Object.assign({"position":"relative"},style)
            }
            
            const msgId                           = scope.getMessageId(this.message)
            if(msgId) attrs['data-id']            = msgId
            if(this.id) attrs['data-id']          = this.id
            if(scope.library) attrs['data-scope'] = scope.$id
            const showLoading = this.isParagraph || typeof(this.message) === 'function'

            return h(tag || 'div', attrs, [
                  this.result,
                  showLoading && hasLoading && this.isLoading  ? h(LoadingComponent) : null 
            ])
          }
      }) as any 
    }  as unknown as VoerkaI18nTranslateComponentBuilder<ComponentType>
}