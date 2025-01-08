

import { test, vi, describe, expect, beforeEach } from 'vitest' 
import { createVoerkaI18nScope, getTestStorage, resetVoerkaI18n } from './_utils'; 



describe('保存与恢复语言', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('保存与恢复语言配置到存储', async () => {
        const storage = getTestStorage()
        const scope = createVoerkaI18nScope({storage});
        expect(storage.get('language')).toBe(undefined);
        await scope.change('en')
        expect(storage.get('language')).toBe('en');
        await scope.change('zh')
        expect(storage.get('language')).toBe('zh');
    });
    test('从存储中恢复语言', async () => {
        const storage = getTestStorage({ language:'en'} )
        const scope = createVoerkaI18nScope({storage});
        await scope.ready()
        expect(scope.activeLanguage).toBe('en');
        expect(scope.activeMessages).toEqual({ message: 'Hello' });
    });
    test('多个scope从存储中恢复语言', async () => {
        const storage = getTestStorage({ language:'en'} )
        const libScope1 = createVoerkaI18nScope({id:"a", library:true});
        const libScope2 = createVoerkaI18nScope({id:"b", library:true});
        const libScope3 = createVoerkaI18nScope({id:"c", library:true});
        const appScope = createVoerkaI18nScope({id:"app",storage});                
        await appScope.ready()
        await libScope1.ready()
        await libScope2.ready()
        await libScope3.ready()
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope1.activeLanguage).toBe('en');
        expect(libScope1.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope2.activeLanguage).toBe('en');
        expect(libScope2.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope3.activeLanguage).toBe('en');
        expect(libScope3.activeMessages).toEqual({ message: 'Hello' });
    });
    test('多个libScope在appScope后面注册时从存储中恢复语言', async () => {
        const storage = getTestStorage({ language:'en'} )        
        const appScope = createVoerkaI18nScope({id:"app",storage});                        
        await appScope.ready()
        const libScope1 = createVoerkaI18nScope({id:"a", library:true});
        const libScope2 = createVoerkaI18nScope({id:"b", library:true});
        const libScope3 = createVoerkaI18nScope({id:"c", library:true});
        await libScope1.ready()
        await libScope2.ready()
        await libScope3.ready()
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope1.activeLanguage).toBe('en');
        expect(libScope1.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope2.activeLanguage).toBe('en');
        expect(libScope2.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope3.activeLanguage).toBe('en');
        expect(libScope3.activeMessages).toEqual({ message: 'Hello' });
    });
});


