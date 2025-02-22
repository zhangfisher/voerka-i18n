import { defineComponent, h, ref, watch, onMounted, onUnmounted } from 'vue'
import type { VoerkaI18nTranslateVars, VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"

export type TranslateWrapperComponent = {
    message: string
    language: string
    vars?: VoerkaI18nTranslateVars
    options?: Record<string, any>
}

export type CreateTranslateComponentOptions = {
    default?: string
    wrapper?: Parameters<typeof h>[0]
}

export function createTranslateComponent(options?: CreateTranslateComponentOptions) {
    const { default: defaultMessage = '', wrapper } = options || {}

    return function(scope:VoerkaI18nScope){
        return function(props:VoerkaI18nTranslateProps){
             const TranslateComponent = defineComponent({
                name: 'VoerkaI18nTranslate',
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
                setup(props) {
                    const result = ref(
                        typeof props.message === 'function'
                            ? props.default || defaultMessage
                            : scope.translate(props.message, props.vars, props.options)
                    )
                    const isFirst = ref(false)
        
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
                        if (wrapper) {
                            return h(wrapper, {
                                message: result.value,
                                vars: props.vars,
                                language: scope.activeLanguage,
                                options: props.options
                            })
                        }
                        return result.value
                    }
                }
            }) 
            return h(TranslateComponent,props as any)
        } 
    }
    

}