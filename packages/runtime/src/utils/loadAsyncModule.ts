 
export async function loadAsyncModule(this:any,module:Function):Promise<any>{
    const loadResult = (await (module as any).call(this))    
    // @ts-ignore      
    if((loadResult && "__esModule" in loadResult) || (Symbol.toStringTag in loadResult)){
        return  (loadResult as any).default 
    }else{
        return  loadResult
    }  
    
} 