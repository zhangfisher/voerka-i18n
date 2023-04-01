/**
* 
* 简单的事件触发器
* 
*/
export class EventEmitter{
    #callbacks:Function[]
    constructor(){
        this.#callbacks = []
    }
    on(callback:Function){
        if(this.#callbacks.includes(callback)) return
        this.#callbacks.push(callback)
    }
    off(callback:Function){
        for(let i=0;i<this.#callbacks.length;i++){
            if(this.#callbacks[i]===callback ){
                this.#callbacks.splice(i,1)
            }
        }
    }
    offAll(){
        this.#callbacks = []
    }
    async emit(...args:any[]){
        if(Promise.allSettled){
            await Promise.allSettled(this.#callbacks.map(cb=>cb(...args)))
        }else{
            await Promise.all(this.#callbacks.map(cb=>cb(...args)))
        }
    }    
}