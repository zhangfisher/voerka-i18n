import type { VoerkaI18nManager } from "./manager"
import type { VoerkaI18nScope } from "./scope"

export type VoerkaI18nLoggerLevels = 'warn' | 'error' | 'info' | 'debug'

export type VoerkaI18nLogger = {
    [key in VoerkaI18nLoggerLevels]: (message:string)=>void
}

export const ConsoleLogger =  {
    warn : console.warn,
    error: console.error,
    info : console.info,
    debug: console.debug        
}

// export function createLogger(debug?:boolean,scope:VoerkaI18nScope):VoerkaI18nLogger{        
//     return Object.keys(logMethods).reduce((logger,level:string)=>{
//         logger[level] = function(...args:any[]){
//             if(debug) (logMethods as any)[level]('[VoerkaI18n]',...args)
//         }
//         return logger
//     },{} as any) as VoerkaI18nLogger
// }



export function createLogger(manager:VoerkaI18nManager):VoerkaI18nLogger{    
    const logger = manager.scope.logger || ConsoleLogger        
    if(manager.debug){
        manager.on("log",({level,message})=>{
            const logMethod = logger[level as VoerkaI18nLoggerLevels]
            try{logMethod(message)}catch{}
        })
    }
    return {
        warn : (message:string)=>{ manager.emit("log",{level:"warn",message})},
        error: (message:string)=>{ manager.emit("log",{level:"error",message})},
        info : (message:string)=>{ manager.emit("log",{level:"info",message})},
        debug: (message:string)=>{ manager.emit("log",{level:"debug",message})}
    }
}
 

