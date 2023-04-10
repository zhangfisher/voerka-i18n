

import {test,vi,describe,expect,afterAll,beforeAll, beforeEach} from 'vitest'
import { VoerkaI18nScope } from '../scope'
import zhFormatters from '../formatters/zh';
import enFormatters from '../formatters/en';
import { VoerkaI18nManager } from '../manager';
import { VoerkaI18nFormatterRegistry } from '../formatterRegistry';
import { VoerkaI18nLanguageMessages, VoerkaI18nFormatterConfigs } from '../types';
import { deepMerge } from 'flex-tools/object/deepMerge';
import { isPlainObject } from 'flex-tools/typecheck/isPlainObject';
import { default as inlineFormatters } from '../formatters';
import { InvalidLanguageError } from '../errors';

function mergeFormattersConfigs(configSources:any[]){        
    return configSources.reduce((finalConfig, curConfig)=>{
            if(isPlainObject(curConfig)) deepMerge(finalConfig,curConfig,{newObject:false,array:'replace'})
            return finalConfig
        },{})                      
}
const zhMessages:VoerkaI18nLanguageMessages = {
    $config:{
        add:{a:1},
        dec:{b:1}
    },
    "1": "你好",
    "2": "你好，{name}",
    "3": "中国",
    "4": ["我有一部车","我有很多部车"]  ,
}
const enMessages={
    "1": "hello",
    "2": "hello,{name}",
    "3": "china",
    "4": "I have {} cars"
}

const messages = {
    zh: zhMessages,
    en: enMessages
}

const idMap={
    "你好":1,
    "你好，{name}":2,
    "中国":3,
    "我有{}部车":4
}
const languages = [
    { name: "zh",default:true,active:true},
    { name: "en"}
]

Object.assign(zhFormatters.$config,{
    x:{x1:1,x2:2},
    y:{y1:1,y2:2}
})
Object.assign(enFormatters.$config,{
    x:{x1:11,x2:22},
    y:{y1:11,y2:22},
    z:{z1:11,z2:22}
})

const formatters ={
    "*":{
        $config:{
            x:{g:1},
            y:{g:1},
            g:{g1:1,g2:2}
        },
        add:(value:any,args?:any[],$config?:VoerkaI18nFormatterConfigs)=>'*'+ value+1,
    },
    zh:{
        first:(value:any)=>'ZH'+value[0],
        ...zhFormatters
    },
    en:{ 
        first:(value:any)=>'EN'+value[0],
        ...enFormatters,
    },
    jp:()=>{}
}

let scope:VoerkaI18nScope;


beforeAll(async ()=>{
    return new Promise((resolve)=>{
        scope = new VoerkaI18nScope({
            id: "test",
            languages,
            idMap,
            messages,
            formatters,
            callback:()=>{
                resolve()
            }
        })
    })        
})
beforeEach(async ()=>{
    await scope.change("zh")
})

describe("VoerkaI18nScope", () => {    
    test("成功创建实例", () => {
        expect(scope).toBeInstanceOf(VoerkaI18nScope)
        expect(scope.activeLanguage).toBe("zh")
        expect(scope.defaultLanguage).toBe("zh")
        expect(scope.messages).toEqual(messages)
        expect(scope.default).toEqual(zhMessages)
        expect(scope.current).toEqual(zhMessages)
        expect(scope.idMap).toEqual(idMap) 
        // 全局管理器
        expect(scope.global).toBeInstanceOf(VoerkaI18nManager)
    })
    test("切换语言", () => {
        return new Promise<void>((resolve)=>{
            scope.on((language:string) => {
                expect(language).toBe("en")
                expect(scope.activeLanguage).toBe("en")
                expect(scope.defaultLanguage).toBe("zh")
                expect(scope.messages).toEqual(messages)
                expect(scope.default).toEqual(zhMessages)
                expect(scope.current).toEqual(enMessages)
                expect(scope.idMap).toEqual(idMap) 
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
            scope.on((language:string) => {
                expect(language).toBe("en")
                expect(scope.activeLanguage).toBe("en")
                expect(scope.defaultLanguage).toBe("zh")
                expect(scope.messages).toEqual(messages)
                expect(scope.default).toEqual(zhMessages)
                expect(scope.current).toEqual(enMessages)
                expect(scope.idMap).toEqual(idMap) 
                event++
                if(event==2) resolve()
            })
            VoerkaI18n.on((language:string) => {
                expect(language).toBe("en")                
                expect(VoerkaI18n.activeLanguage).toBe("en")
                expect(VoerkaI18n.defaultLanguage).toBe("zh") 
                event++
                if(event==2) resolve()
            })
            VoerkaI18n.change("en")
        })
    })

    test("多个Scope", async () => {    
        let scope1 = new VoerkaI18nScope({
            languages,
            idMap: {},
            messages: {},
            formatters: {},
        })
        let scope2 = new VoerkaI18nScope({
            languages,
            idMap: {},
            messages: {},
            formatters: {},
        })




    })
    

})
describe("格式化化配置与参数", () => {    

    test("格式化器参数", async () => {        
        expect(scope.formatters).toBeInstanceOf(VoerkaI18nFormatterRegistry)
        expect(scope.formatters.activeLanguage).toBe("zh")
        expect(scope.formatters.formatters).toEqual(formatters)
        expect(scope.formatters.types).toBe(zhFormatters.$types)
    })

    test("查找格式化器", async () => {        
        expect(scope.formatters.get("add")).toBe(formatters['*'].add)
        expect(scope.formatters.get("first")).toBe(formatters.zh.first)
        await scope.change("en")
        expect(scope.formatters.get("first")).toBe(formatters.en.first)        
    })
    test("合并后的格式化器配置", async () => {         
        let fallbackLanguage = scope.getLanguage(scope.activeLanguage)?.fallback
        const globalFormatters = inlineFormatters
        let scopeConfig = mergeFormattersConfigs([
            (fallbackLanguage! in globalFormatters) ? (globalFormatters as any)?.[fallbackLanguage!].$config:{},
            globalFormatters.zh.$config,
            (fallbackLanguage! in formatters) ? (formatters as any)?.[fallbackLanguage!]?.$config:{},
            formatters.zh.$config
        ])
        expect(scope.formatters.config).toEqual(scopeConfig)
        // 
        await scope.change("en")
        fallbackLanguage = scope.getLanguage(scope.activeLanguage)?.fallback
        scopeConfig = mergeFormattersConfigs([
            (fallbackLanguage! in globalFormatters) ? (globalFormatters as any)?.[fallbackLanguage!].$config:{},
            globalFormatters.en.$config,
            (fallbackLanguage! in formatters) ? (formatters as any)?.[fallbackLanguage!]?.$config:{},
            formatters.en.$config
        ])
        expect(scope.formatters.config).toEqual(scopeConfig)        
    })
})

describe('翻译函数', () => {


})

