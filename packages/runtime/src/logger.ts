

const logMethods = {
    warn:console.warn,
    error:console.error,
    info:console.info,
    debug:console.debug        
}

export function createLogger(debug?:boolean){        
    return Object.keys(logMethods).reduce((logger,level:string)=>{
        logger[level] = function(...args:any[]){
            if(debug) (logMethods as any)[level]('[VoerkaI18n]',...args)
        }
        return logger
    },{} as any) as typeof logMethods
}
 