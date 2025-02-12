/**
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
 *      
 *      options={{...}}         // 传递给翻译器的参数
 *  />
 * 
 */

import { definePlugin, VoerkaI18nManager } from "@voerkai18n/runtime"
import { createTranslateComponent } from "./component"




definePlugin((manager:VoerkaI18nManager)=>{
    const component = createTranslateComponent()
    manager.scopes.forEach(scope=>{
        scope.options.component = component
    })
})
 