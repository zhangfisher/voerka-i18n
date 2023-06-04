

import {test,vi,describe,expect,afterAll,beforeAll, beforeEach} from 'vitest'
import { VoerkaI18nScope } from '../scope' 
import { VoerkaI18nManager } from '../manager';
import { InvalidLanguageError } from '../errors';
import { createI18nScope } from './utils';
import { messages,zhMessages,enMessages } from './utils/testData';

let scope:VoerkaI18nScope;

describe("VoerkaI18n实例与语言切换", () => {
    beforeAll(async ()=>{
        return new Promise((resolve)=>{
            scope = createI18nScope({
                ready:resolve
            })
        })        
    })
    beforeEach(async ()=>{
        await scope.change("zh")
    })
    test("成功创建实例", () => {
        expect(scope).toBeInstanceOf(VoerkaI18nScope)
        expect(scope.activeLanguage).toBe("zh")
        expect(scope.defaultLanguage).toBe("zh")
        expect(scope.messages).toEqual(messages)
        expect(scope.default).toEqual(zhMessages)
        expect(scope.current).toEqual(zhMessages)
        // 全局管理器
        expect(scope.global).toBeInstanceOf(VoerkaI18nManager)
    })
    test("切换语言", () => {
        return new Promise<void>((resolve)=>{
            scope.once("change",(language:string) => {
                expect(language).toBe("en")
                expect(scope.activeLanguage).toBe("en")
                expect(scope.defaultLanguage).toBe("zh")
                expect(scope.messages).toEqual(messages)
                expect(scope.default).toEqual(zhMessages)
                expect(scope.current).toEqual(enMessages)
                resolve()
            })
            scope.change("en")
        })        
    })

    test("切换到不存在的语言", async () => {
        try{
            await scope.change("xn")
        }catch(e){
            expect(e).toBeInstanceOf(InvalidLanguageError)
        }        
    })
    test("指定了默认信息加载器时，切换到不存在的语言时从远程加载", async () => {
        scope.global.registerDefaultLoader(async function(newLanguage:string,curScope){
            expect(newLanguage).toBe("de")
            expect(curScope).toBe(scope)
            return {
                hello:"[DE]hello"
            }
        })
        await scope.change("de")
        expect((scope.current as any)['hello']).toEqual("[DE]hello")
    })

    test("全局切换语言", () => {
        return new Promise<void>((resolve)=>{
                let event = 0 
                VoerkaI18n.once("change",(language:string) => {
                    expect(language).toBe("en")                
                    expect(VoerkaI18n.activeLanguage).toBe("en")
                    expect(VoerkaI18n.defaultLanguage).toBe("zh") 
                    event++
                    if(event==2) resolve()
                })
                scope.once("change",(language:string) => {
                    expect(language).toBe("en")
                    expect(scope.activeLanguage).toBe("en")
                    expect(scope.defaultLanguage).toBe("zh")
                    expect(scope.messages).toEqual(messages)
                    expect(scope.default).toEqual(zhMessages)
                    expect(scope.current).toEqual(enMessages)
                    event++
                    if(event==2) resolve()
                })
                VoerkaI18n.change("en")
            })
    }) 
    // test("事件监听", () => {
    //     let results:any[] = [] 
    //     let events = ["ready","change","patched","restore","registered"]
    //     let listenerIds:any[]= events.map(event=>VoerkaI18n.on(event,(args) => {
    //         results.push([event,args])
    //     }))
    //     return new Promise<void>(async (resolve)=>{                        
    //         await VoerkaI18n.change("en")
    //         // await VoerkaI18n.change("zh")
    //         // await VoerkaI18n.change("en")
    //         // await VoerkaI18n.change("zh") 
    //         listenerIds.forEach(id=>VoerkaI18n.off(id))
    //     })      
    // })
  
})