/**
 * 
 * 异步加载语言包
 * 
 */



import { test,  describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, resetVoerkaI18n } from './_utils';
import { VoerkaI18nScope } from '@/scope';
import { delay } from "flex-tools/async/delay";

describe('加载远程异步语言包', () => {

    beforeEach(() => {
        resetVoerkaI18n()
    });

    test('加载远程异步语言包', async () => {
        const loader = getTestLanguageLoader(async (language:string,scope:VoerkaI18nScope)=>{            
            await delay(10)
            return {
                en: { "1":"hello" },
                de: { "1":"hallo" }
            }[language]
        })
        const appScope = createVoerkaI18nScope({
            loader,
            messages:{
                "zh":{ "你好": "你好" }
            },
            idMap:{
                "你好":1, 
            }
        })
        const t = appScope.t
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        expect(t("你好")).toBe("你好")
        await appScope.change("en")
        expect(t("你好")).toBe("hello")
        await appScope.change("de")
        expect(t("你好")).toBe("hallo")
    })

    test('加载远程不存在的异步语言包时回退到默认语言', async () => {
        const loader = getTestLanguageLoader(async (language:string,scope:VoerkaI18nScope)=>{            
            await delay(10)
            return {
                en: { "1":"hello" },
                de: { "1":"hallo" }
            }[language]
        })
        const appScope = createVoerkaI18nScope({
            loader,
            messages:{
                "zh":{ "你好": "你好" }
            },
            idMap:{
                "你好":1, 
            }
        })
        const t = appScope.t
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        expect(t("你好")).toBe("你好")
        
        await appScope.change("xy")
        expect(appScope.activeLanguage).toBe('zh');
        expect(t("你好")).toBe("你好")
        const d = ()=>import("./data/en")
    })
    test('异步语言包', async () => {
        const loader = getTestLanguageLoader(async (language:string,scope:VoerkaI18nScope)=>{            
            await delay(10)
            return {
                en: { "1":"hello" },
                de: { "1":"hallo" }
            }[language]
        })
        const appScope = createVoerkaI18nScope({
            loader,
            messages:{
                "zh":{ "你好": "你好" },
                "en":()=>import("./data/en")
            },
            idMap:{
                "你好":1, 
            }
        })
        const t = appScope.t
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        expect(t("你好")).toBe("你好")
        await appScope.change("en")
        expect(t("你好")).toBe("hello")
        await appScope.change("de")
        expect(t("你好")).toBe("hallo")
    })

})