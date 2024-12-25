

export async function loadAsyncModule(context:any,module:Function){
    const loadResult = (await (module as any).call(context))          
    if(("__esModule" in loadResult) || (Symbol.toStringTag in loadResult)){
        return  (loadResult as any).default 
    }else{
        return  loadResult
    }
} 