/**
* 
* 简单的事件触发器
* 
*/
export class EventEmitter{
    #callbacks:[Function,number][]
    constructor(){
        this.#callbacks = []
    }
    on(callback:Function):Function{
        this.#callbacks.push([callback,0])
        return ()=>this.off(callback)
    }    
    /**
     * 只订阅一次
     * @param callback 
     */
    once(callback:Function){
        this.#callbacks.push([callback,1])
        return ()=>this.off(callback)
    }
    off(callback:Function){
        for(let i=0;i<this.#callbacks.length;i++){
            if(this.#callbacks[i][0]===callback ){
                this.#callbacks.splice(i,1)
            }
        }
    }
    offAll(){
        this.#callbacks = []
    }
    async emit(...args:any[]){
        try{
            await Promise.all(this.#callbacks.map(([cb])=>cb(...args)))
            this.#callbacks=this.#callbacks.filter(([cb,count])=>count!==1)
        }catch(e:any){
            console.error(`[VoerkaI18n] ${e.stack}`)
        }
    }    
}