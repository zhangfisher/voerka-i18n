
import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';
import { VoerkaI18nInvalidLanguageError } from '@/errors';

 
describe('切换回退语言功能', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test("appScope切换到了不存在语言回退到默认语言", async () => {
        const appScope = createVoerkaI18nScope()
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('en')        
        await appScope.change('x')
        expect(appScope.activeLanguage).toBe('zh');         
    });
    test("appScope切换语言时出错回退到指定的回退语言", async () => {
        const appScope = createVoerkaI18nScope()
        // @ts-ignore
        appScope.messages.en = undefined
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('en')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 
    test("appScope切换远程语言时出错回退到指定的回退语言", async () => {
        const appScope = createVoerkaI18nScope({
            loader:async ()=>{throw new Error("加载语言包出错")}
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('x')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 

    test("appScope切换远程语言时出错回退到指定的回退语言", async () => {
        const appScope = createVoerkaI18nScope()   
        appScope.languages.push({ name: 'German', title: 'Deutsch' })     
        appScope.messages.de
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('de')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 




})