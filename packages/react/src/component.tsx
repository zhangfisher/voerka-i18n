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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { VoerkaI18nTranslateVars, VoerkaI18nTranslatedComponentProps, VoerkaI18nScope } from "@voerkai18n/runtime" 

 
export type TranslateWrapperComponent =React.FC<React.PropsWithChildren<{
    message : string    
    language: string,
    vars?   : VoerkaI18nTranslateVars 
    options?: Record<string,any>
}>>  

export type CreateTranslateComponentOptions = {
    default?: string
}

export function createTranslateComponent(Component?:TranslateWrapperComponent,options?:CreateTranslateComponentOptions){    
    
    const { default:defaultMessage ='' } = Object.assign({},options) as CreateTranslateComponentOptions

    return function(this:VoerkaI18nScope,props:VoerkaI18nTranslatedComponentProps){
        const { message, vars, options:tOptions,default:tDefault } = props                
        const [ result, setResult ] = useState(()=>{
            return typeof(message)==='function' 
                                    ? tDefault || defaultMessage 
                                    : this.translate(message,vars,tOptions)
        })

        const isFirst = useRef(false)
        
        const loadMessage = useCallback(async (language:string) => {
            const loader = typeof(message)==='function' ? ()=>message(language,vars,tOptions) : ()=>message
            return Promise.resolve(loader()).then((result)=>{                    
                setResult(this.translate(result,vars,tOptions))
            })
        },[message,vars,tOptions]) 

        useEffect(()=>{            
            if(!isFirst.current && typeof(message)==='function' ){
                loadMessage(this.activeLanguage)
                isFirst.current = true
            }
            const listener = this.on("change",loadMessage) as any
            return ()=>listener.off()
        }) 
        
        return Component ? 
            <Component message={result} vars={vars} language={ this.activeLanguage } options={tOptions} />
            : <>{result}</>
    }
}

 