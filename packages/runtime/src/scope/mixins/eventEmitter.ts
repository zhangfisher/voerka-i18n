/**
 * 
 *  事件发射器混入
 * 
 */ 
import type { VoerkaI18nScope } from ".."  
import type { LiteEventListener } from "flex-tools/events/liteEvent" 



export type VoerkaI18nScopeEvents =  'change' 
export class EventEmitterMixin{
	// 以下方法引用全局VoerkaI18n实例的方法
	on(this:VoerkaI18nScope,event:VoerkaI18nScopeEvents,callback:LiteEventListener) {
        return this.manager.on(`${this.id}/${event}`,callback);	
    }
    once(this:VoerkaI18nScope,event:VoerkaI18nScopeEvents,callback:LiteEventListener) {
        return this.manager.once(`${this.id}/${event}`,callback);
    }
	off(this:VoerkaI18nScope,event:VoerkaI18nScopeEvents,callback:LiteEventListener) {
        return this.manager.off(`${this.id}/${event}`,callback); 
    }
    waitFor(this:VoerkaI18nScope,event:VoerkaI18nScopeEvents,timeout?:number):Promise<any>{
        return this.manager.waitFor(`${this.id}/${event}`,timeout);
    }
    async emit(this:VoerkaI18nScope,event:VoerkaI18nScopeEvents,payload?:any):Promise<any> {
        return await  this.manager.emitAsync(`${this.id}/${event}`,payload);
    }
}


 