import Vue from 'vue';
import type { VoerkaI18nScope, VoerkaI18nTranslateComponentBuilder, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import type { Component } from 'vue';


export type CreateTranslateComponentOptions = {
  default?: string
  tagName?: string 
  class?:string
  style?:string
}

export type VueTranslateComponentType = Component<any,any,any,VoerkaI18nTranslateProps>  

export function createTranslateComponent<ComponentType=any>(options?: CreateTranslateComponentOptions) {
    const { tagName } = Object.assign({
        tagName: 'span'
    }, options)
    
    return function (scope: VoerkaI18nScope) {
      return  Vue.component('VoerkaI18nTranslate', {
        props: {
          message: {
            type: [String, Function],
            required: true
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
            result: typeof this.message === 'function'
              ? this.default || 'defaultMessage'
              : scope.translate(this.message, this.vars, this.options),
            isFirst: false
          };
        },
        created() { 
            this.loadMessage();
            // @ts-ignore
            this._subscriber = scope.on('change', this.loadMessage);
        },
        beforeDestroy() {
            // @ts-ignore
            this._subscriber.off();
        },
        watch: {
          message: 'loadMessage',
          vars   : 'loadMessage',
          options: 'loadMessage'
        },
        methods: {
          async loadMessage() {
            const scope=VoerkaI18n.scope
            const activeLanguage = scope.activeLanguage;
            const loader = typeof this.message === 'function'
                            ? () => (this.message as any)(activeLanguage, this.vars, this.options)
                            : () => this.message;
            const messageText = await Promise.resolve(loader());
            this.result = scope.translate(messageText, this.vars, this.options);
          }
        },
        render(h:any) {
          return h(tagName, this.result);
        }
      }); 
    } as VoerkaI18nTranslateComponentBuilder<ComponentType>
}