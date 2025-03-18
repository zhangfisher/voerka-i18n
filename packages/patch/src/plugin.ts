/**
 * 
 * 
 *  - 开始启用补丁
 * 
 *   VoerkaI18n.patch(true,options)
 *   
 *  - 禁用补丁
 *   VoerkaI18n.patch(false)
 * 
 * 
 */
import { VoerkaI18nManager, definePlugin } from '@voerkai18n/runtime'; 
import type { VoerkaI18nMessagePatchableOptions } from './types';
import { VoerkaI18nMessagePatchable } from './patchable';
 

definePlugin((manager:VoerkaI18nManager)=>{
   manager.patch = (enable?:boolean,options?:VoerkaI18nMessagePatchableOptions)=>{ 
    if(!manager._patchable){
      // @ts-ignore
      manager._patchable = new VoerkaI18nMessagePatchable(manager,options)
    }
    if(options){
      Object.assign(manager._patchable.options,options)
    }
    manager._patchable.enable = enable === undefined ? true : enable 
  } 
  manager.scope.patch = manager.patch 
})

declare module '@voerkai18n/runtime' {
  interface VoerkaI18nManager {
    // @ts-ignore
    _patchable: VoerkaI18nMessagePatchable
    patch: (enable?:boolean,options?:VoerkaI18nMessagePatchableOptions)=>void
  }
  interface VoerkaI18nScope {
    patch: (enable?:boolean,options?:VoerkaI18nMessagePatchableOptions)=>void
  }
}
