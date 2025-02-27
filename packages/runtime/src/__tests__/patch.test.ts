/**
 * 
 * 语言补丁
 * 
 * 语言补丁功能需要配置
 * 
 * - Loader: 用来加载补丁
 * - Storage: 用来存储补丁数据
 * 
 * 
 */



import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';

 
describe('语言包补丁功能', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('appScope加载时加载补丁', async () => {     
        const storage = getTestStorage()
        const loader = getTestLanguageLoader(async (language,scope)=>{            
           return { message: language==='en' ? 'Hello VoerkaI18n!' : '你好VoerkaI18n!' }
        })        
        const appScope = createVoerkaI18nScope({
            storage,
            loader 
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        expect(appScope.activeMessages).toEqual({ message: '你好VoerkaI18n!' });
        await appScope.change('en')
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello VoerkaI18n!' });
        expect(JSON.parse(storage.get('voerkai18n_test-scope_en_patched_messages'))).toEqual({ 
            message: 'Hello VoerkaI18n!' 
        });
    });


    test('先创建多个libScope再创建appScope加载时加载补丁', async () => {     
        const storage = getTestStorage()
        const loader = getTestLanguageLoader(async (language,scope)=>{            
           return { message: language==='en' ? 
                    `Hello VoerkaI18n<${scope.id}>!` : 
                    `你好VoerkaI18n<${scope.id}>!` 
                }
        })        
        const libScope1 = createVoerkaI18nScope({id:"a", library:true });
        const libScope2 = createVoerkaI18nScope({id:"b", library:true });
        const libScope3 = createVoerkaI18nScope({id:"c", library:true });
        const appScope = createVoerkaI18nScope({
            id:"app",
            storage,
            loader 
        })
        await appScope.ready() 
        expect(appScope.activeLanguage).toBe('zh');
        expect(appScope.activeMessages).toEqual({ message: '你好VoerkaI18n<app>!' });
        expect(libScope1.activeLanguage).toBe('zh');
        expect(libScope1.activeMessages).toEqual({ message: '你好VoerkaI18n<a>!' });
        expect(libScope2.activeLanguage).toBe('zh');
        expect(libScope2.activeMessages).toEqual({ message: '你好VoerkaI18n<b>!' });
        expect(libScope3.activeLanguage).toBe('zh');
        expect(libScope3.activeMessages).toEqual({ message: '你好VoerkaI18n<c>!' });

        await appScope.change('en')
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello VoerkaI18n<app>!' });
        expect(libScope1.activeLanguage).toBe('en');
        expect(libScope1.activeMessages).toEqual({ message: 'Hello VoerkaI18n<a>!' });
        expect(libScope2.activeLanguage).toBe('en');
        expect(libScope2.activeMessages).toEqual({ message: 'Hello VoerkaI18n<b>!' });
        expect(libScope3.activeLanguage).toBe('en');
        expect(libScope3.activeMessages).toEqual({ message: 'Hello VoerkaI18n<c>!' });

        expect(JSON.parse(storage.get('voerkai18n_app_en_patched_messages'))).toEqual({ 
            message: 'Hello VoerkaI18n<app>!' 
        });
    });
    test('先创建appScope再创建多个libScope加载时加载补丁', async () => {     
        const storage = getTestStorage()
        const loader = getTestLanguageLoader(async (language,scope)=>{            
           return { message: language==='en' ? 
                        `Hello VoerkaI18n<${scope.id}>!` : 
                        `你好VoerkaI18n<${scope.id}>!` 
                }
        })
        const appScope = createVoerkaI18nScope({
            id:"app",
            storage,
            loader 
        })
        const libScope1 = createVoerkaI18nScope({id:"a", library:true });
        const libScope2 = createVoerkaI18nScope({id:"b", library:true });
        const libScope3 = createVoerkaI18nScope({id:"c", library:true });
        await appScope.ready() 
        expect(appScope.activeLanguage).toBe('zh');
        expect(appScope.activeMessages).toEqual({ message: '你好VoerkaI18n<app>!' });
        expect(libScope1.activeLanguage).toBe('zh');
        expect(libScope1.activeMessages).toEqual({ message: '你好VoerkaI18n<a>!' });
        expect(libScope2.activeLanguage).toBe('zh');
        expect(libScope2.activeMessages).toEqual({ message: '你好VoerkaI18n<b>!' });
        expect(libScope3.activeLanguage).toBe('zh');
        expect(libScope3.activeMessages).toEqual({ message: '你好VoerkaI18n<c>!' });

        await appScope.change('en')
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello VoerkaI18n<app>!' });
        expect(libScope1.activeLanguage).toBe('en');
        expect(libScope1.activeMessages).toEqual({ message: 'Hello VoerkaI18n<a>!' });
        expect(libScope2.activeLanguage).toBe('en');
        expect(libScope2.activeMessages).toEqual({ message: 'Hello VoerkaI18n<b>!' });
        expect(libScope3.activeLanguage).toBe('en');
        expect(libScope3.activeMessages).toEqual({ message: 'Hello VoerkaI18n<c>!' });

        expect(JSON.parse(storage.get('voerkai18n_app_en_patched_messages'))).toEqual({ 
            message: 'Hello VoerkaI18n<app>!' 
        });
    });
});


