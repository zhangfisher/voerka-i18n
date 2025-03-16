import type {  Component,ComponentPublicInstance  } from 'vue'
import { defineComponent, h, ref, watch, onUnmounted  } from 'vue'
import { loadAsyncModule, type VoerkaI18nScope, type VoerkaI18nTranslateProps } from "@voerkai18n/runtime"


export type CreateTranslateComponentOptions = {
    default?: string
    tagName?: string 
    class?  : string
    style?  : string
    loading?: Component | boolean | string
}
 
export type VueTranslateComponentType = Component<VoerkaI18nTranslateProps> 


export function createTranslateComponent(options?: CreateTranslateComponentOptions){
    const { default: defaultMessage = '',  tagName, class:className = 'vt-msg' ,style,loading:LoadingComponent } = Object.assign({ },options)
 
    const hasLoading:boolean = !!LoadingComponent

    return function(scope:VoerkaI18nScope){       
        return defineComponent<VoerkaI18nTranslateProps>({
            name: 'VoerkaI18nTranslate',
            props: {
                id      : { type: String },
                message : { type: [ String, Function ] },
                vars    : { type: [String,Number,Array,Boolean,Object], default: () => [] },
                options : { type: Object, default: () => ({}) },
                tag     : { type: String }, 
                default : { type: String, default: '' }
            },   
            setup:(props,{ slots }) => {

                const { message, id: paragraphId } = props
                const isParagraph: boolean = typeof(paragraphId) === 'string' && paragraphId.length > 0 

                const result = ref(
                    isParagraph ? slots.default && slots.default()
                     : (
                        typeof props.message === 'function'
                            ? props.default || defaultMessage
                            : scope.translate(message as string, props.vars, props.options)
                        )
                )
                // 仅当是段落时才显示加载中
                const isLoading = ref<boolean>(false)
                const isFirst = ref(false)
                const tag = props.tag || tagName
                const msgId = scope.getMessageId(props.message)

                const loadParagraph = async () => {
                    if(paragraphId){
                        const loader =  scope.activeParagraphs[paragraphId]
                        if(!loader) return
                        isLoading.value = true
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
                    if (tag || isParagraph) {
                        const attrs:Record<string,any> = {
                            class: className,
                            style: Object.assign({"position":"relative"},style)
                        }
                        if(msgId) attrs['data-id'] = msgId
                        if(paragraphId) attrs['data-id'] = paragraphId
                        if(scope.library) attrs['data-scope'] = scope.$id
                        return h(tag || 'div', attrs, [
                            result.value,
                            hasLoading && isLoading.value  ?
                                LoadingComponent : null 
                        ])
                    }else{
                        return result.value
                    }                    
                }
            }
        }) 
    }
}