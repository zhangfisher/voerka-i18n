/**
 * 
 *  翻译组件
 *  
 *  import { createTranslateComponent } from '@voerkai18n/react'
 * 
 *  const scope = new VoerkaI18nScope({
 *      component: createTranslateComponent(({message,vars,options,language})=>{
 *          return <span>{message}</span>
 *      },
 *      {
 *          loading: <Loading/>             // 自定义加载中组件
 *          default: ""                     // 默认文本
 *      }
 *  })
 *  
 *  <Translate message="I am {}" vars={['fisher']} options={{...}} />
 *  
 *  <Translate 
 *      message={
 *          async (language,vars,options)=>{ 
 *             const remoteMessage = await fetch(`https://example.com/api/translate?language=${language}&message=1001`).then((res)=>res.text())
 *             return remoteMessage         // = "I am {}"
 *          }
 *      } 
 *      default="I am {}"
 *      vars={['fisher']} 
 *      options={{...}}         // 传递给翻译器的参数
 *  />
 * 
 *  <Translate id="aaa">
 *      段落内容
 *  </Translate>
 * 
 */

import { createElement,useState, useEffect, useCallback, useRef,ComponentType } from 'react';
import { type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, loadAsyncModule } from "@voerkai18n/runtime" 

 
export type CreateTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : string
    style?    : React.CSSProperties
    loading?  : React.ReactNode | boolean | string
}

const delay = (ms: number=2000) => new Promise(resolve => setTimeout(resolve, ms))

const Loading = (props:{tips:string})=>(<div
    style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: '1em',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',            
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
    }}
>{ props.tips || 'Loading...'}</div>)

export type VoerkaI18nReactTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<ComponentType<VoerkaI18nTranslateProps>>

 export type ReactTranslateComponentType = ComponentType<VoerkaI18nTranslateProps>

export function createTranslateComponent(options?:CreateTranslateComponentOptions):VoerkaI18nReactTranslateComponentBuilder{        
    const { tagName,attrs={}, class:className = 'vt-msg' ,style, loading:gLoading } = Object.assign({ },options) as CreateTranslateComponentOptions
    
    const isCustomLoading = ['object','function'].includes(typeof(gLoading)) // 自定义加载中组件
    const gShowLoading:boolean = typeof(gLoading) === 'boolean' ? gLoading : isCustomLoading // 全局开关
    const LoadingComponent = isCustomLoading  ? gLoading : Loading 

    return function(scope:VoerkaI18nScope){
        return (props:VoerkaI18nTranslateProps)=>{
            const { id:paragraphId, message, vars, options:tOptions,default:tDefault = '', loading:showLoading = gShowLoading } = props             

            const isParagraph: boolean = typeof(paragraphId) === 'string' && paragraphId.length > 0

            const [ result, setResult ] = useState(()=>{
                if(isParagraph){
                    
                }else{
                    return typeof(message)==='function' ? tDefault : scope.translate(message!,vars,tOptions)
                }                
            })
    
            const isFirst = useRef(false) 
            // 仅当是段落时才显示加载中
            const isLoading = useRef<boolean>(false)         
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
                    isLoading.current = true
                    try{                   
                        await delay()
                        const paragraphText = await loadAsyncModule(loader)
                        result.value = paragraphText
                    }catch(e:any){
                        console.error(e)
                    }finally{
                        isLoading.current = false
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

            useEffect(()=>{            
                // 第一次渲染时执行函数进行加载
                if(!isFirst.current && typeof(message)==='function' ){
                    refresh(scope.activeLanguage)
                    isFirst.current = true 
                }
                const listener = scope.on("change",loadMessage) as any
                return ()=>listener.off()
            },[]) 
            
            if(msgId) attrs['data-id'] = msgId
            if(paragraphId) attrs['data-id'] = paragraphId

            return (tag ?
                        createElement(tag,{
                            dangerouslySetInnerHTML:{ __html:result },
                            ...attrs
                        })
                    : <>{result}</>
                )
        } 
    }

}
