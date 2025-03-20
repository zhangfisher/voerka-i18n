'use client'

import { definePlugin, VoerkaI18nManager } from '@voerkai18n/runtime'
import { applyTranslate } from '../utils'
 

definePlugin((manager?:VoerkaI18nManager)=>{    
    if(!manager) manager = globalThis.VoerkaI18n
    manager.on("change",()=>{
        applyTranslate(true)
    }) 
})
