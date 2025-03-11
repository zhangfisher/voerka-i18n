/**
 * 
 *  翻译组件 
 * 
 */

import { createElement,useState, useEffect, useCallback, useRef } from 'openinula';
import { type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, loadAsyncModule } from "@voerkai18n/runtime" 
 
 
export type CreateTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : string
    style?    : React.CSSProperties
    loading?  : React.ReactNode | boolean | string
}
  

export type ReactTranslateComponentType = React.FC<VoerkaI18nTranslateProps>

export type VoerkaI18nReactTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<ReactTranslateComponentType>


export function createTranslateComponent(options?:CreateTranslateComponentOptions):VoerkaI18nReactTranslateComponentBuilder{        
    const { tagName,attrs={}, class:className = 'vt-msg' ,style:gStyle, loading:LoadingComponent } = Object.assign({ },options) as CreateTranslateComponentOptions
    const hasLoading:boolean = !!LoadingComponent

    return function(scope:VoerkaI18nScope){
        return (props:VoerkaI18nTranslateProps)=>{            
            const { id:paragraphId, message, vars, options:tOptions,default:tDefault = '' } = props             

            const isParagraph: boolean = typeof(paragraphId) === 'string' && paragraphId.length > 0 

            const [ result, setResult ] = useState(()=>{
                if(isParagraph){
                    return props.children
                }else{
                    return typeof(message)==='function' ? tDefault : scope.translate(message!,vars,tOptions)
                }                
            })
        
            const isFirst = useRef(false) 
            // 仅当是段落时才显示加载中
            const [ loading, setLoading ]  = useState<boolean>(false)         
            const tag = props.tag || tagName
            const msgId = scope.getMessageId(props.message)
            
            const loadMessage = useCallback(async (language:string) => {
                const loader = typeof(message)==='function' ? ()=>message(language,vars,tOptions) : ()=>message
                return Promise.resolve(loader()).then((result)=>{                    
                    setResult(scope.translate(result!,vars,tOptions))
                })
            },[message,vars,tOptions]) 

            const loadParagraph = async () => {
                if(paragraphId){
                    const loader =  scope.activeParagraphs[paragraphId]
                    if(!loader) return
                    if(hasLoading) setLoading(true)
                    try{                    
                        const paragraphText = await loadAsyncModule(loader)
                        setResult(paragraphText)
                    }catch(e:any){
                        console.error(e)
                    }finally{
                        if(hasLoading) setLoading(false)
                    }                        
                }                    
            }

            const refresh = useCallback((language: string) => {
                if(isParagraph){ 
                    loadParagraph()
                }else{
                    loadMessage(language)
                }
            },[]) 

            // 第一次渲染时执行函数进行加载
            if(!isFirst.current && (typeof(message)==='function'  || isParagraph)){
                refresh(scope.activeLanguage)
                isFirst.current = true 
            }

            useEffect(()=>{  
                const listener = scope.on("change",refresh) as any
                return ()=>listener.off()
            },[]) 
            
            if(msgId) attrs['data-id'] = msgId
            if(paragraphId) attrs['data-id'] = paragraphId
            if(scope.library) attrs['data-scope'] = String(scope.$id)
            
            if(tag || isParagraph){
                return createElement(tag || 'div',{
                    ...attrs,
                    className,
                    suppressHydrationWarning:true,
                    style:Object.assign({"position":"relative"},gStyle,props.style)
                },
                result,
                hasLoading && loading ? LoadingComponent : null,
                )
            }else{
                return <>{result}</>
            }   
        } 
    }

}
