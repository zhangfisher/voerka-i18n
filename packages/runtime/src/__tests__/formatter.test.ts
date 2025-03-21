import { test,  describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';
import { createFormatter } from '../formatter'; 
import { assignObject } from 'flex-tools/object/assignObject';


export type AddFormatterConfig = {
    count:number,
    x:number
}
 
 

describe('格式化器', () => {

    beforeEach(() => {
        resetVoerkaI18n()
    });
    test("简单格式化器", async () => {
        const appScope = createVoerkaI18nScope({
            formatters:[
                {
                    name:"add",
                    args:['count'],
                    default:{
                        count:1
                    },
                    next:(value,args,ctx)=>{
                        return String(Number(value)+args.count)
                    }
                }
            ]
        })
        expect(appScope.t('{ | add }',1)).toBe("2")
    });
    test("从语言配置中读取格式化器配置", () => {

        return new Promise<void>((resolve)=>{
            const appScope = createVoerkaI18nScope({
                messages:{ 
                    zh:{ $config:{ add: { count: 1 } } },
                    en:{ $config:{ add: { count: 2 } } }                    
                },
                formatters:[
                    {
                        name:"add",
                        args:['count'],
                        default:{
                            count: 1
                        },
                        next:(value,args,ctx)=>{  
                            const config = ctx.getConfig()                            
                            const scope = ctx.scope
                            if(scope.activeLanguage === "zh"){
                                expect(config.count).toBe(1)
                                expect(args.count).toBe(1)
                            }else{
                                expect(config.count).toBe(2)
                                expect(args.count).toBe(1)
                            }
                            resolve()
                            return String(Number(value)+args.count)
                        }
                    }
                ]
            },            
            // {
            //     zh:{ $config:{ add: { count: 1 } }  },
            //     en:{ $config:{ add: { count: 2 } } }      
            // }
            )
             
            expect(appScope.t('{ | add }',1)).toBe("2")
            appScope.change("en").then(()=>{
                expect(appScope.t('{ | add }',1)).toBe("2")
            })            
        })        
    });

    test("创建格式化器时指定不同语言的配置", () => {
        return new Promise<void>((resolve)=>{
            const appScope = createVoerkaI18nScope({ 
                formatters:[
                    [{
                        name:"add",
                        args:['count'],
                        default:{
                            count: 1
                        },
                        next:(value,args,ctx)=>{  
                            const config = ctx.getConfig()                            
                            const scope = ctx.scope
                            if(scope.activeLanguage === "zh"){
                                expect(config.count).toBe(1)
                                expect(args.count).toBe(1)
                            }else{
                                expect(config.count).toBe(3)
                                expect(args.count).toBe(1)
                            }
                            return String(Number(value)+args.count)
                        }
                    },{
                        zh:{  count: 1 },
                        en:{  count: 3 }      
                    }]
                ]
            }
            )
             
            expect(appScope.t('{ | add }',1)).toBe("2")
            appScope.change("en").then(()=>{
                expect(appScope.t('{ | add }',1)).toBe("2")                
                resolve()
            })            
        })        
    });

    test("合并创建格式化器语言配置", () => {
        // 格式化器的配置来自于语言包中的$config和createFormatter的第二个参数
        return new Promise<void>((resolve)=>{            
            type Args = { count:number }
            type Config = { count:number,x:number }
            const appScope = createVoerkaI18nScope({                 
                messages:{ 
                    zh:{ $config:{ add: { count: 10,x:1 } } },
                    en:{ $config:{ add: { count: 20,x:2 } } }                    
                },
                formatters:[
                    [{
                        name:"add",
                        args:['count'],
                        default:{
                            count: 1
                        },
                        next:(value,args,ctx)=>{  
                            const config = ctx.getConfig()                            
                            const scope = ctx.scope
                            if(scope.activeLanguage === "zh"){
                                expect(config.count).toBe(10)
                                expect(config.x).toBe(1)
                                expect(args.count).toBe(1)
                            }else{
                                expect(config.count).toBe(20)
                                expect(config.x).toBe(2)
                                expect(args.count).toBe(1)
                            }
                            return String(Number(value)+args.count)
                        }
                    },{
                        zh:{  count: 1 },
                        en:{  count: 3 }      
                    }]
                ]
            })             
            
            expect(appScope.t('{ | add }',1)).toBe("2")
            appScope.change("en").then(()=>{
                expect(appScope.t('{ | add }',1)).toBe("2")                
                resolve()
            })            
        })        
    });
    test("bookname式化器", async () => {
        type BookNameArgs = { beginChar:string, endChar:string }
        const scope = createVoerkaI18nScope({
            messages: {
                zh: {
                    "hello {|bookname}": "你好 {|bookname}",
                    "hello {|bookname('#')}": "你好 {|bookname('#')}",
                    "hello {|bookname('#','!')}": "你好 {|bookname('#','!')}",
                    "hello {|bookname|bookname|bookname}": "你好 {|bookname|bookname|bookname}",
                },
                en: {
                    "hello {|bookname}": "hello {|bookname}",
                    "hello {|bookname('#')}": "hello {|bookname('#')}",
                    "hello {|bookname('#','!')}": "hello {|bookname('#','!')}",
                    "hello {|bookname|bookname|bookname}": "hello {|bookname|bookname|bookname}",
                },
            },
        });

        scope.formatters.register({
            name:"bookname",
            args:['beginChar','endChar'], 
            next:(value, args, ctx) => {       
                if(!args.endChar) args.endChar = args.beginChar
                args = assignObject({},ctx.getConfig(),args)                
                return args.beginChar + value + args.endChar;
            }
        },{
            zh:{
                beginChar: "《",
                endChar: "》",
            },
            en:{
                beginChar: "<",
                endChar: ">",
            }
        })
        const t = scope.t

        expect(t("hello { | bookname}", "tom")).toBe("hello 《tom》");
        expect(t("hello { | bookname|bookname|bookname}", "tom")).toBe("hello 《《《tom》》》");
        expect(t("hello { | bookname('#')}", "tom")).toBe("hello #tom#");
        expect(t("hello { | bookname('#','!')}", "tom")).toBe("hello #tom!");        
        await scope.change("en");
        expect(t("hello { | bookname}", "tom")).toBe("hello <tom>");
        expect(t("hello { | bookname|bookname|bookname}", "tom")).toBe("hello <<<tom>>>");
        expect(t("hello { | bookname('#')}", "tom")).toBe("hello #tom#");
        expect(t("hello { | bookname('#','!')}", "tom")).toBe("hello #tom!");
      });


      
})