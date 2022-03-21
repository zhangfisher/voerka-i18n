/**
* 
* 简单的事件触发器
* 
*/
module.exports = class EventEmitter{
    constructor(){
        this._callbacks = []
    }
    on(callback){
        if(this._callbacks.includes(callback)) return
        this._callbacks.push(callback)
    }
    off(callback){
        for(let i=0;i<this._callbacks.length;i++){
            if(this._callbacks[i]===callback ){
                this._callbacks.splice(i,1)
            }
        }
    }
    offAll(){
        this._callbacks = []
    }
    async emit(...args){
        if(Promise.allSettled){
            await Promise.allSettled(this._callbacks.map(cb=>cb(...args)))
        }else{
            await Promise.all(this._callbacks.map(cb=>cb(...args)))
        }
    }    
}