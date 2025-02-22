import Vue from 'vue';
import type { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
 

export type CreateTranslateComponentOptions = {
    tagName?: string
}

export function createTranslateComponent(options?: CreateTranslateComponentOptions) {
    const { tagName } = Object.assign({
        tagName: 'span'
    }, options || {})
    const TranslateComponent = Vue.component('VoerkaI18nTranslate', {
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
        default: {
          type: String,
          default: ''
        }
      },
      data() {
        const scope=VoerkaI18n.scope
        return {
          result: typeof this.message === 'function'
            ? this.default || 'defaultMessage'
            : scope.translate(this.message, this.vars, this.options),
          isFirst: false
        };
      },
      created() {
        const scope=VoerkaI18n.scope
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
      render(h) {
        return h(tagName, this.result);
      }
    });
    console.log("TranslateComponent=",TranslateComponent)
    return TranslateComponent 
    // return function(this:VoerkaI18nScope,props:VoerkaI18nTranslateProps){
    //     const scope = (this as unknown) as VoerkaI18nScope

        

        
    // } 

}