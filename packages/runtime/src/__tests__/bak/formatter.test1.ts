/**
 * 格式化器基本功能测试
 */
import {test,vi,describe,expect,afterAll,beforeAll, beforeEach} from 'vitest'
import { VoerkaI18nScope } from '../../scope'
import { VoerkaI18nFormatterRegistry } from '../formatterRegistry';
import { default as inlineFormatters } from '../../formatters';
import { createI18nScope, mergeFormattersConfigs } from '../data';
import { messages,zhMessages,enMessages,formatters } from '../data/testData';

let scope:VoerkaI18nScope;

describe("格式化器配置与参数", () => {    
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
 