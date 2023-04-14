import {test,vi,describe,expect,afterAll,beforeAll, beforeEach} from 'vitest'
import { VoerkaI18nScope } from '../scope'
import zhFormatters from '../formatters/zh';
import enFormatters from '../formatters/en';
import { VoerkaI18nManager } from '../manager';
import { VoerkaI18nFormatterRegistry } from '../formatterRegistry';
import {  VoerkaI18nTranslate } from '../types';
import { default as inlineFormatters } from '../formatters';
import { InvalidLanguageError } from '../errors';
import { createI18nScope, mergeFormattersConfigs } from './utils';
import { messages,zhMessages,enMessages,formatters } from './utils/testData';

let scope:VoerkaI18nScope;

describe("格式化化配置与参数", () => {    
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
    test("格式化器参数", async () => {        
        expect(scope.formatters).toBeInstanceOf(VoerkaI18nFormatterRegistry)
        expect(scope.formatters.activeLanguage).toBe("zh")
        expect(scope.formatters.formatters).toEqual(formatters)
        expect(scope.formatters.types).toBe(zhFormatters.$types)
    })

    test("查找格式化器", async () => {        
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


describe('插值变量格式化器', () => {
    let t:VoerkaI18nTranslate
    

    beforeAll(() => {
        t = scope.t
        // 注册格式化器，注册为所有语言
        scope.registerFormatter("add", (value,args,config) => {
                return String(Number(value) + (Number(args.length==0 ? 1 : args[0])))
        });
        scope.formatters.updateConfig("zh",{
            bookname:{        
                beginChar:"《",
                endChar:"》"
            }
        });
        scope.formatters.updateConfig("en",{
            bookname:{        
                beginChar:"<",
                endChar:">"
            }
        });
        // 注册格式化器，注册为所有语言
        scope.registerFormatter("bookname", (value,args,config) => {
            let { beginChar = "<",endChar=">" } = Object.assign({},(config as any)?.bookname)            
            if(args.length==1){
                beginChar = endChar = args[0]
            }else if(args.length>=2){
                beginChar = args[0]
                endChar = args[1]
            }
            return beginChar  + value + endChar
    })
    })
    test('格式化器',async () => {
        expect(t("我的工资是每月{|add}元",1000)).toBe("我的工资是每月1001元")
        expect(t("我的工资是每月{|add()}元",1000)).toBe("我的工资是每月1001元")
        expect(t("我的工资是每月{|add(2)}元",1000)).toBe("我的工资是每月1002元")
        expect(t("我的工资是每月{|add|add()|add(2)}元",1000)).toBe("我的工资是每月1004元")
    })
    test('bookname式化器',async () => {
        expect(t("hello {|bookname}","tom")).toBe("hello 《tom》")
        expect(t("hello {|bookname('#')}","tom")).toBe("hello #tom#")
        expect(t("hello {|bookname('#','!')}","tom")).toBe("hello #tom!")
        expect(t("hello {|bookname|bookname|bookname}","tom")).toBe("hello 《《《tom》》》")
        await scope.change("en")
        expect(t("hello {|bookname}","tom")).toBe("hello <tom>")        
    })

    test('空值格式化器',async () => {
        expect(t("hello {|bookname|empty('空')}",undefined)).toBe("hello 《空》")
    })

})

describe('内置格式化器', () => {

})