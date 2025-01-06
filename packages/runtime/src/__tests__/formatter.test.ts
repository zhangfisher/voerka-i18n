import { test,  describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';
import { createFormatter } from '../formatter'; 


export type AddFormatterConfig = {
    count:number
}

// export interface VoerkaI18nFormatterConfigs {
//     add: AddFormatterConfig
// }
 

describe('格式化器', () => {

    beforeEach(() => {
        resetVoerkaI18n()
    });
    test("简单格式化器", async () => {
        const appScope = createVoerkaI18nScope({
            formatters:[
                createFormatter(()=>({
                    name:"add",
                    args:['count'],
                    default:{
                        count:1
                    },
                    next:(value,args)=>{
                        return String(Number(value)+args.count)
                    }
                }))
            ]
        })
        expect(appScope.t('{ | add }',1)).toBe("2")
    });
    test("从语言配置中读取格式化器配置", () => {
        
        const addFormatter = createFormatter((scope:scope)=>({
            name     : "add",
            args     : [ 'count' ],
            default  : {
                count: 1
            },
            next : (value,args,ctx)=>{   
                const config = ctx.getConfig()                            
                expect(config.count).toBe(1)
                expect(args.count).toBe(1) 
                return String(Number(value)+args.count)
            }
        }))
        

        return new Promise<void>((resolve)=>{
            const appScope = createVoerkaI18nScope({
                messages:{ 
                    zh:{ $config:{ add: { count: 1 } } },
                    en:{ $config:{ add: { count: 2 } } }                    
                },
                formatters:[
                    createFormatter((scope)=>({
                        name:"add",
                        args:['count'],
                        default:{
                            count: 1
                        },
                        next:(value,args,ctx)=>{  
                            const config = ctx.getConfig()                            
                            expect(config.count).toBe(1)
                            expect(args.count).toBe(1)
                            resolve()
                            return String(Number(value)+args.count)
                        }
                    }))
                ]
            },            
            // {
            //     zh:{ $config:{ add: { count: 1 } }  },
            //     en:{ $config:{ add: { count: 2 } } }      
            // }
            )
            
            const addFormatter = createFormatter((scope)=>({
                name:"add",
                args:['count'],
                default:{
                    count: 1
                },
                next:(value,args,ctx)=>{  
                    const config = ctx.getConfig()                            
                    expect(config.count).toBe(1)
                    expect(args.count).toBe(1)
                    resolve()
                    return String(Number(value)+args.count)
                }
            }))
            expect(appScope.t('{ | add }',1)).toBe("2")
            //expect(appScope.t('{ | add }',1)).toBe("2")
        })        
    });
})