import Vue from 'vue';
import { loadAsyncModule, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, type VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import type { Component } from 'vue';
import { ref } from 'vue';


export type CreateTranslateComponentOptions = {
  default?: string
  tagName?: string 
  class?  : string
  style?  : string
  loading?: Component | boolean | string
}

export type VueTranslateComponentType = Component<any,any,any,VoerkaI18nTranslateProps>  

export const Loading = Vue.component('VoerkaI18nLoading', {
  props: {
    tips: { type: String, default: 'Loading...' }
  },
  render(h:any) {
    return h('span', { 
      style: { 
        "position": 'absolute',
        "top": 0,
        "left": 0,
        "font-size": '1em',
        "width": '100%',
        "height": '100%',
        "display": 'flex',
        "justify-content": 'center',            
        "align-items": 'center',
        "background-color": 'rgba(255, 255, 255, 0.8)',
        "z-index": 9999
    } }, this.tips)
  }
})


const delay = (ms:number=2000)=>new Promise(resolve=>setTimeout(resolve,ms))

export function createTranslateComponent<ComponentType=any>(options?: CreateTranslateComponentOptions) {
    const { default: defaultMessage = '',  tagName, class:className = 'vt-msg' ,style,loading:gLoading } = Object.assign({ },options)
    const isCustomLoading = ['object','function'].includes(typeof(gLoading))      // 自定义<加载中>组件
    const defaultShowLoading:boolean = typeof(gLoading) === 'boolean' ? gLoading : isCustomLoading // 全局开关
    const LoadingComponent = (isCustomLoading  ? gLoading : Loading) as Component
    
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
          },
          loading: {
            type: [Boolean,String],
            default: defaultShowLoading
          }
        },
        data() { 
          return {
            result     : typeof this.message === 'function' ? this.default || defaultMessage
                       : scope.translate(this.message, this.vars, this.options),
            isLoading  : false,
            isParagraph: typeof this.id === 'string' && this.id.length > 0,
          };
        },
        mounted() { 
            this.refresh(scope.activeLanguage);
            // @ts-ignore
            this._subscriber = scope.on('change', this.refresh);
        },

        beforeDestroy() {
            // @ts-ignore
            this._subscriber.off();
        },
        watch: {
          message: 'refresh',
          vars   : 'refresh',
          options: 'refresh',
          id: 'refresh'
        },
        methods: {
          async refresh(language: string) {
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
                  await delay()
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
            const msgId      = scope.getMessageId(this.message)
            if(msgId) attrs['data-id'] = msgId
            if(this.id) attrs['data-id'] = this.id
            if(scope.library) attrs['data-scope'] = scope.$id
            const showLoading =  typeof(this.loading) === 'boolean' ? this.loading : typeof(this.loading)==='string'
            const loadingTips = typeof this.loading === 'string' ? this.loading : 'Loading...'
            const isShowLoading = showLoading && LoadingComponent && this.isLoading && this.isParagraph
            return h(tag || 'div', attrs, [
              this.result,
              isShowLoading  ?
                    h(LoadingComponent,{ tips: loadingTips }) : null 
            ])
          }
      }) as any 
    }  as unknown as VoerkaI18nTranslateComponentBuilder<ComponentType>
}