import type { VoerkaI18nManager } from "./manager" 

export type VoerkaI18nLoggerLevels = 'warn' | 'error' | 'info' | 'debug'

export type VoerkaI18nLogger = {
    [key in VoerkaI18nLoggerLevels]: (message:string,...args:any[])=>void
}

export const ConsoleLogger =  {
    warn : console.warn,
    error: console.error,
    info : console.info,
    debug: console.debug        
}



export function createLogger(manager:VoerkaI18nManager):VoerkaI18nLogger{    
    const logger = manager.scope.logger || ConsoleLogger        
    if(manager.debug){
        manager.on("log",({level,message})=>{
            const logMethod = logger[level as VoerkaI18nLoggerLevels]
            try{logMethod(message)}catch{}
        })
    }
    return { 
        warn : (message:string,...args:any[])=> manager.emit("log",{level:"warn",message:message+args.join(' ')}),
        error: (message:string,...args:any[])=>{ manager.emit("log",{level:"error",message:message+args.join(' ')})},
        info : (message:string,...args:any[])=>{ manager.emit("log",{level:"info",message:message+args.join(' ')})},
        debug: (message:string,...args:any[])=>{ manager.emit("log",{level:"debug",message:message+args.join(' ')})}
    }
}
 

