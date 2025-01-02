/**
 * 
 *  事件发射器混入
 * 
 */ 
import { VoerkaI18nEvents } from "@/types"
import type { VoerkaI18nScope } from ".."  
import { LiteEvent, LiteEventListener } from "flex-tools/events/liteEvent" 


 
export class EventEmitterMixin{
    private _eventEmitter!: LiteEvent<VoerkaI18nEvents>
    protected _getEventEmitter(this:VoerkaI18nScope):LiteEvent<VoerkaI18nEvents>{
        if(this.attached){
            return this.manager
        }else{
            if(!this._eventEmitter) this._eventEmitter = new LiteEvent<VoerkaI18nEvents>()
            return this._eventEmitter
        }
    } 
	// 以下方法引用全局VoerkaI18n实例的方法
	on(this:VoerkaI18nScope,event: keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this._getEventEmitter().on(event,callback);	
    }
    once(this:VoerkaI18nScope,event: keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this._getEventEmitter().once(event,callback);
    }
	off(this:VoerkaI18nScope,event: keyof VoerkaI18nEvents,callback:LiteEventListener) {
        return this._getEventEmitter().off(event,callback); 
    }
    waitFor(this:VoerkaI18nScope,event: keyof VoerkaI18nEvents,timeout?:number):Promise<any>{
        return this._getEventEmitter().waitFor(event,timeout);
    }
    async emit(this:VoerkaI18nScope,event: keyof VoerkaI18nEvents,payload?:any,retain?:boolean):Promise<any> {
        return await this._getEventEmitter().emitAsync(event,payload,retain);
    }
}


 