import { VoerkaI18nManager } from "./manager"

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



export function createLogger():VoerkaI18nLogger{        
    let  manager:VoerkaI18nManager    
    const logCache:[string,string][] = []
    const logOutput = (level:VoerkaI18nLoggerLevels,message:string,...args:any[])=>{
        if(!manager){
            // @ts-ignore
            manager =  globalThis.__VoerkaI18n__ 
            if(manager && manager instanceof VoerkaI18nManager){
                const logger = manager.scope.logger || ConsoleLogger        
                if(manager.debug){
                    const log = (level:VoerkaI18nLoggerLevels,message:string)=>{
                        const logMethod = logger[level as VoerkaI18nLoggerLevels]
                        try{logMethod(message)}catch{}
                    }
                    manager.on("log",({level, message}) => log(level as any, message))
                    logCache.forEach(([level,message])=>log(level as any,message))
                }else{                    
                    logCache.splice(0,logCache.length)      // 清空缓存
                }
            }else{
                logCache.push([level,message + ' ' + args.join(' ')])
            }
        }else{
            if(!manager.debug) return
            manager.emit("log",{level,message:message + ' ' + args.join(' ')})    
        }
    }
    return { 
        warn: (message: string, ...args: any[]) => logOutput("warn",message,...args),
        error: (message: string, ...args: any[]) => logOutput("error",message,...args),
        info: (message: string, ...args: any[]) => logOutput("info",message,...args),
        debug: (message: string, ...args: any[]) => logOutput("debug",message,...args)
    }
}
 