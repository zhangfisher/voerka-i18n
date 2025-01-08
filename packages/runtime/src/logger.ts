import { VoerkaI18nManager } from "./manager"

export type VoerkaI18nLoggerLevels = 'warn' | 'error' | 'info' | 'debug'

export type VoerkaI18nLogger = {
    [key in VoerkaI18nLoggerLevels]: (message:string,...args:any[])=>void
}

export type VoerkaI18nLoggerOutput = (level:VoerkaI18nLoggerLevels,message:string)=>void

export const ConsoleLogger =  {
    warn : console.warn,
    error: console.error,
    info : console.info,
    debug: console.debug        
}



export function createLogger(logFn:VoerkaI18nLoggerOutput):VoerkaI18nLogger{        
    let  manager:VoerkaI18nManager    
    const logCache:[string,string][] = []
    const logOutput = (level:VoerkaI18nLoggerLevels,...args:any[])=>{
        const message = args.join(" ")
        if(!manager){
            // @ts-ignore
            manager =  globalThis.VoerkaI18n 
            if(manager && manager instanceof VoerkaI18nManager){
                if(manager.debug){
                    logCache.push([level,message])
                    const log = (level:VoerkaI18nLoggerLevels,message:string)=>{                        
                        if(logFn){
                            logFn(level,message)
                        }else{
                            ConsoleLogger[level as VoerkaI18nLoggerLevels](message)
                        }
                    }
                    manager.on("log",({level, message}) => log(level as any, message))
                    logCache.forEach(([level,message])=>log(level as any,message))
                }else{                    
                    logCache.splice(0,logCache.length)      // 清空缓存
                }
            }else{
                logCache.push([level,message])
            }
        }else{
            if(!manager.debug) return
            manager.emit("log",{level,message})    
        }
    }
    return { 
        warn: ( ...args: any[]) => logOutput("warn",...args),
        error: ( ...args: any[]) => logOutput("error",...args),
        info: ( ...args: any[]) => logOutput("info",...args),
        debug: (...args: any[]) => logOutput("debug",...args)
    }
}
 