'use client'

import { VoerkaI18nScope, VoerkaI18nTranslateProps } from "@voerkai18n/runtime"
import { createElement, useCallback, useEffect, useRef, useState } from "react"

 

export type createClientTranslateComponentOptions = {
    tagName?  : string 
}

export function createClientTranslateComponent(options?:createClientTranslateComponentOptions){    
    
    const { tagName  } = Object.assign({},options) as createClientTranslateComponentOptions

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

            const scopeAttr = scope.library ? { 'data-scope': scope.$id } : {}

            return tagName ?
                    createElement(tagName,{
                        dangerouslySetInnerHTML: {__html:result},
                        className: "vt-msg" ,
                        "data-id":  props.message,
                        ...scopeAttr
                    })
                    : (
                        <span 
                            className="vt-msg" 
                            data-id={props.message}
                            {...scopeAttr }
                        >{result}
                    </span>
                    )
        } 
    }
}

 