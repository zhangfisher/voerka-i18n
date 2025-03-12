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

import { useState, useEffect, useCallback, useRef,FC} from '@lynx-js/react';
import { CSSProperties } from '@lynx-js/types' 
import { type VoerkaI18nTranslateProps, type VoerkaI18nScope, type VoerkaI18nTranslateComponentBuilder, loadAsyncModule } from "@voerkai18n/runtime" 
 

 
export type CreateTranslateComponentOptions = {
    tagName?  : string
    attrs?    : Record<string,string>        
    class?    : string
    style?    : CSSProperties
}
  

export type LynxReactTranslateComponentType = FC<VoerkaI18nTranslateProps>

export type VoerkaI18nLynxReactTranslateComponentBuilder = VoerkaI18nTranslateComponentBuilder<LynxReactTranslateComponentType>


export function createTranslateComponent(options?:CreateTranslateComponentOptions):VoerkaI18nLynxReactTranslateComponentBuilder{        
    const { attrs={}, class:className = 'vt-msg' ,style:gStyle } = Object.assign({ },options) as CreateTranslateComponentOptions
 
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
                    try{                    
                        const paragraphText = await loadAsyncModule(loader)
                        setResult(paragraphText)
                    }catch(e:any){
                        console.error(e)
                    }finally{ 
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
            
            if(isParagraph){
                return <view className={className} style={gStyle} {...attrs}>
                    {result}
                </view>
            }else{
                return <view>{result}</view>
            }   
        } 
    }

}
