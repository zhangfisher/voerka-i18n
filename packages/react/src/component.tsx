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
 */

import React, { createElement,useState, useEffect, useCallback, useRef } from 'react';
import type { VoerkaI18nTranslateVars, VoerkaI18nTranslateProps, VoerkaI18nScope } from "@voerkai18n/runtime" 
 
 
export type TranslateWrapperComponent =React.FC<React.PropsWithChildren<{
    message : string    
    language: string,
    vars?   : VoerkaI18nTranslateVars 
    options?: Record<string,any>
}>>  

export type CreateTranslateComponentOptions = {
    tagName?  : string
    wrapper?: TranslateWrapperComponent
}

export function createTranslateComponent(options?:CreateTranslateComponentOptions){    
    
    const { tagName,wrapper:Wrapper } = Object.assign({},options) as CreateTranslateComponentOptions

    return function(scope:VoerkaI18nScope){
        return (props:VoerkaI18nTranslateProps)=>{
            const { message, vars, options:tOptions,default:tDefault = '' } = props                
            const [ result, setResult ] = useState(()=>{
                return typeof(message)==='function' ? tDefault : scope.translate(message,vars,tOptions)
            })
    
            const isFirst = useRef(false) 
            
            const loadMessage = useCallback(async (language:string) => {
                const loader = typeof(message)==='function' ? ()=>message(language,vars,tOptions) : ()=>message
                return Promise.resolve(loader()).then((result)=>{                    
                    setResult(scope.translate(result,vars,tOptions))
                })
            },[message,vars,tOptions]) 
    
            useEffect(()=>{            
                // 第一次渲染时执行函数进行加载
                if(!isFirst.current && typeof(message)==='function' ){
                    loadMessage(scope.activeLanguage)
                    isFirst.current = true 
                }
                const listener = scope.on("change",loadMessage) as any
                return ()=>listener.off()
            },[]) 
            
            return Wrapper ? 
                <Wrapper message={result} vars={vars} language={ scope.activeLanguage } options={tOptions} />
                : (tagName ?
                    createElement(tagName,{dangerouslySetInnerHTML:{__html:result}})
                    : <>{result}</>
                )
        } 
    }
}

 