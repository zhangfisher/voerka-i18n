import { defineComponent, h, ref, watch, onUnmounted, Component, ComponentPublicInstance  } from 'vue'
import { loadAsyncModule, type VoerkaI18nScope, type VoerkaI18nTranslateProps } from "@voerkai18n/runtime"


 

export type CreateTranslateComponentOptions = {
    default?: string
    tagName?: string 
    class?  : string
    style?  : string
    loading?: Component | boolean | string
}

export type VoerkaI18nVueTranslateProps = VoerkaI18nTranslateProps & {}

export type VueTranslateComponentType = Component<VoerkaI18nTranslateProps> 

// 一个简单的加载中组件
const Loading = defineComponent({
    name: 'VoerkaI18nLoading',
    props: {
        message: { type: String, default: 'Loading...' }
    },
    setup(props){
        return () => h('span', { style: { 
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
        } }, props.message)
    }
})

export function createTranslateComponent(options?: CreateTranslateComponentOptions){
    const { default: defaultMessage = '',  tagName, class:className = 'vt-msg' ,style,loading } = Object.assign({ },options)

    return function(scope:VoerkaI18nScope){       
        return defineComponent<VoerkaI18nTranslateProps>({
            name: 'VoerkaI18nTranslate',
            props: {
                id: { type: String },
                message: { type: [String, Function] },
                vars   : { type: Array, default: () => [] },
                options: { type: Object, default: () => ({}) },
                tag    : { type: String },
                default: { type: String, default: '' }
            },   
            setup:(props,{ slots }) => {

                const { message, id } = props
                const isParagraph: boolean = typeof(id) === 'string' && id.length > 0

                const result = ref(
                    isParagraph ? slots.default && slots.default()
                     : (
                        typeof props.message === 'function'
                            ? props.default || defaultMessage
                            : scope.translate(message as string, props.vars, props.options)
                        )
                )
                // 仅当是段落时才显示加载中
                const isLoading = ref<boolean>(!!(isParagraph && loading))
                const isFirst = ref(false)
                const tag = props.tag || tagName
                const msgId = scope.getMessageId(props.message)

                const loadParagraph = async () => {
                    if(id){
                        const loader =  scope.activeParagraphs[id]
                        if(!loader) return
                        try{                   
                            const paragraphText = await loadAsyncModule(loader)
                            result.value = paragraphText
                        }catch(e:any){
                            console.error(e)
                        }finally{
                            isLoading.value = false
                        }                        
                    }                    
                }

                const loadMessage = async (language: string) => {
                    const loader = typeof props.message === 'function'
                        ? () => (props.message as Function)(language, props.vars, props.options)
                        : () => props.message
                    const messageText = await Promise.resolve(loader())
                    result.value = scope.translate(messageText, props.vars, props.options)
                }

                const refresh = (language: string) => {
                    if(isParagraph){
                        isLoading.value = true
                        loadParagraph()
                    }else{
                        loadMessage(language)
                    }
                } 
    
                // 监听语言变化
                const unsubscribe = scope.on('change', refresh)
                
                if (!isFirst.value && (typeof props.message === 'function' || isParagraph )) {
                    refresh(scope.activeLanguage)
                    isFirst.value = true
                } 
    
                // 清理事件监听
                onUnmounted(() => {
                    unsubscribe.off()
                })
     
                watch(
                    () => [props.id,props.message, props.vars, props.options],
                    () => loadMessage(scope.activeLanguage)
                )
            
                return function(this:ComponentPublicInstance){                     
                    if (tag) {
                        const attrs:Record<string,any> = {
                            class: className,
                            style: Object.assign({"position":"relative"},style)
                        }
                        if(msgId) attrs['data-id'] = msgId
                        if(id) attrs['data-id'] = id
                        if(scope.library) attrs['data-scope'] = scope.$id
                        return h(tag, attrs, [
                            result.value,
                            loading && isLoading.value && h(typeof(loading)==='boolean' ?
                                Loading : loading
                            )
                        ])
                    }else{
                        return result.value
                    }                    
                }
            }
        }) 
    }
}