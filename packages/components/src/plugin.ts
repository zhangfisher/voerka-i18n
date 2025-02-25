import { VoerkaI18nManager, definePlugin } from '@voerkai18n/runtime'; 
import { VoerkaI18nMessagePatchable, VoerkaI18nMessagePatchableOptions } from './patchable';
 
 

definePlugin((manager:VoerkaI18nManager)=>{
 
  manager.patch = (options?:VoerkaI18nMessagePatchableOptions)=>{
      const patchable = new VoerkaI18nMessagePatchable(manager,options)
      
  }


})


