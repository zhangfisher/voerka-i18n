/**
 * 
 *  事件发射器混入
 * 
 */ 
import type { VoerkaI18nScope } from ".." 
import { VoerkaI18nEvents } from "@/types"
import type { LiteEventListener } from "flex-tools/events/liteEvent" 


export class EventEmitterMixin{
	// 以下方法引用全局VoerkaI18n实例的方法
	on(this:VoerkaI18nScope,event:keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this.manager.on(event,callback);	
    }
    once(this:VoerkaI18nScope,event:keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this.manager.once(event,callback);
    }
	off(this:VoerkaI18nScope,event:keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this.manager.off(event,callback); 
    }
}


 