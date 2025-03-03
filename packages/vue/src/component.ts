import { defineComponent, h, ref, watch, onMounted, onUnmounted, Component  } from 'vue'
import type { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"

 

export type CreateTranslateComponentOptions = {
    default?: string
    tagName?: string 
    class?  : string
    style?  : string
}

export type VueTranslateComponentType = Component<VoerkaI18nTranslateProps>
 
export function createTranslateComponent(options?: CreateTranslateComponentOptions){
    const { default: defaultMessage = '',  tagName, class:className = 'vt-msg' ,style } = Object.assign({ },options)

    return function(scope:VoerkaI18nScope){
        return function(props:VoerkaI18nTranslateProps){
             const TranslateComponent = defineComponent<VoerkaI18nTranslateProps>({
                name: 'VoerkaI18nTranslate',
                props: {
                    message: { type: [String, Function], required: true },
                    vars   : { type: Array, default: () => [] },
                    options: { type: Object, default: () => ({}) },
                    tag    : { type: String },
                    default: { type: String, default: '' }
                },
                setup(props) {
                    const result = ref(
                        typeof props.message === 'function'
                            ? props.default || defaultMessage
                            : scope.translate(props.message, props.vars, props.options)
                    )
 
                    const isFirst = ref(false)
                    const tag = props.tag || tagName
                    const msgId = scope.getMessageId(props.message)
                    const loadMessage = async (language: string) => {
                        const loader = typeof props.message === 'function'
                            ? () => (props.message as Function)(language, props.vars, props.options)
                            : () => props.message
                        const messageText = await Promise.resolve(loader())
                        result.value = scope.translate(messageText, props.vars, props.options)
                    }
        
                    // 监听语言变化
                    const unsubscribe = scope.on('change', loadMessage)
        
                    // 首次加载
                    onMounted(() => {
                        if (!isFirst.value && typeof props.message === 'function') {
                            loadMessage(scope.activeLanguage)
                            isFirst.value = true
                        }
                    })
        
                    // 清理事件监听
                    onUnmounted(() => {
                        unsubscribe.off()
                    })
         
                    watch(
                        () => [props.message, props.vars, props.options],
                        () => loadMessage(scope.activeLanguage)
                    )
                    
                    return () => {
                        if (tag) {
                            const attrs:Record<string,any> = {
                                class: className,
                                style
                            }
                            if(msgId) attrs['data-id'] = msgId
                            if(scope.library) attrs['data-scope'] = scope.$id
                            return h(tag, attrs, result.value)
                        }
                        return result.value
                    }
                }
            }) 
            return h(TranslateComponent,props as any)
        } 
    }
}