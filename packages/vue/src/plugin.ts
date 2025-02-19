/**
 * 
 *  import { createTranslateComponent } from '@voerkai18n/react'
 * 
 *  const scope = new VoerkaI18nScope({
 *      component: createTranslateComponent(({message,vars,options,language})=>{
 *          
 *      },
 *      {
 *          default: ""                     // 默认文本
 *      }
 *  }) 
 */

import { definePlugin, VoerkaI18nManager } from "@voerkai18n/runtime"
import { createTranslateComponent } from "./component"


definePlugin((manager:VoerkaI18nManager)=>{
    const component = createTranslateComponent()
    manager.scopes.forEach(scope=>{
        scope.options.component = component
    })
})
 