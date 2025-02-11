/**
 * 
 *  import { createTranslateComponent } from '@voerkai18n/react'
 * 
 *  const scope = new VoerkaI18nScope({
 *      component: createTranslateComponent(
 *      (message,vars,options,language})=>{
 *          return <span>{message}</span>
 *      },
 *      {
 *          loading: <Loading/>             // 自定义加载中组件
 *          default: ""                     // 默认文本
 *      }
 *  })
 *  
 *  <Translate message="I am {}" vars={['fisher']} options={{...}} />
 *  <Translate 
 *      message={
 *          async (language,options)=>{ 
 *             const remoteMessage = await fetch(`https://example.com/api/translate?language=${language}&message=1001`).then((res)=>res.text())
 *             return remoteMessage  // = "I am {}"
 *          }
 *      } 
 *      vars={['fisher']} 
 *      options={{...}} 
 *  />
 * 
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { 
    VoerkaI18nTranslateVars,   
    VoerkaI18nTranslatedComponentProps,
    VoerkaI18nScope
} from "@voerkai18n/runtime"
 
 
export type TranslateWrapperComponent =React.FC<React.PropsWithChildren<{
    message : string    
    language: string,
    vars?   : VoerkaI18nTranslateVars 
    options?: Record<string,any>
}>>  

export type CreateTranslateComponentOptions = {
    default?: string,
    loading?: React.ReactNode
}

export function createTranslateComponent(Component?:TranslateWrapperComponent,options?:CreateTranslateComponentOptions){    
    const { default:defaultMessage ='' } = Object.assign({},options) as CreateTranslateComponentOptions

    const Loading = options?.loading || <></>

    return React.memo(function(this:VoerkaI18nScope,props:VoerkaI18nTranslatedComponentProps){
        const { message, vars, options } = props                
        
        const [ result, setResult ]   = useState(typeof(message)==='function' ? defaultMessage : message)
        const [ loading, setLoading ] = useState(false)

        const loadMessage = useCallback(async (language:string) => {
            const loader = typeof(message)==='function' 
                                ? message(language,vars,options)
                                : ()=>message
            setLoading(true)

            return Promise.resolve(loader()).then((result)=>{                    
                setResult(this.translate(result,vars,options))
            }).finally(()=>{
                setLoading(false)
            })

        },[message,vars,options])

        useEffect(()=>{
            const listener = this.on("change",(language)=>{                
                loadMessage(language)
            }) as any
            return ()=>listener.off()
        }) 

        return Component ? (
                loading ? (<Loading/>): (
                    <Component message={result} vars={vars} language={this.activeLanguage}/>
                )
            ) : (<>{result}</>)
    },()=>true)
}





// export const VoerkaI18nContext = React.createContext< {
//     language?       : string
//     changeLanguage  : (newLanguage:string)=>Promise<void> 
//     defaultLanguage?: string   
//     activeLanguage? : string   
//     languages       : VoerkaI18nLanguageDefine[]
//     t               : VoerkaI18nTranslate
//     isChanging      : boolean
// }>({
//     languages:[],
//     activeLanguage:'zh',
//     defaultLanguage:undefined,
//     changeLanguage:async () =>{},
//     t:()=>'',
//     isChanging: false
// })

// VoerkaI18nContext.displayName = 'VoerkaI18nProvider'

// export type VoerkaI18nProviderProps = React.PropsWithChildren & { 
//     scope:VoerkaI18nScope
//     fallback:React.ReactNode
// }

// export function VoerkaI18nProvider(props:VoerkaI18nProviderProps){
//     const { scope,fallback } = props
//     const [language, setLanguage ] = useState(VoerkaI18n.activeLanguage); 
//     const [isReady, setIsReady ] = useState(false);
//     const [isChanging, setIsChanging] = useState(false)
    
//     useEffect(() => { 
//         function onChangeLanguage(newLanguage:string) {
//             setLanguage(newLanguage) 
//         }        
//         VoerkaI18n.ready().then(()=>setIsReady(true))
//         const listenerId:any = VoerkaI18n.on("change",onChangeLanguage)
//       return () => VoerkaI18n.off(listenerId)
//     },[]);

//     const changeLanguage = useCallback((newLanguage:string) => {
//         setIsChanging(true)
//         return VoerkaI18n.change(newLanguage).then((lng) => {
//             setLanguage(lng) 
//             setIsChanging(false)
//         })
//     },[language])

//     const value ={
//         changeLanguage,
//         activeLanguage:language,            
//         defaultLanguage:VoerkaI18n.defaultLanguage,
//         languages:VoerkaI18n.languages,
//         t:scope.t,
//         isChanging
//     }
//     return (
//         <VoerkaI18nContext.Provider value={value}>
//             {(!isReady && fallback) ? props.fallback : props.children}
//         </VoerkaI18nContext.Provider>
//     )
// }

// export function useVoerkaI18n() {
//     return useContext(VoerkaI18nContext) 
    

// } 