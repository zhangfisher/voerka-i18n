/**
 * 语言切换测试
 */




import { test,  describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';

describe('语言切换', () => {
  
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('单scope切换语言', async () => {
      const scope = createVoerkaI18nScope();
      expect(scope.id).toBe('test-scope');
      expect(scope.debug).toBe(false);
      expect(scope.activeLanguage).toBe('zh');
      expect(scope.defaultLanguage).toBe('zh');
      expect(scope.activeMessages).toEqual({ message: '你好' }); 
      await scope.change("en")
      expect(scope.activeLanguage).toBe('en');
      expect(scope.defaultLanguage).toBe('zh');
      expect(scope.activeMessages).toEqual({ message: 'Hello' });
    }); 
    test('多scope切换语言', async () => {
      const scope1 = createVoerkaI18nScope({ id: "a" });
      const scope2 = createVoerkaI18nScope({ id: "b", library: true });
      const scope3 = createVoerkaI18nScope({ id: "c", library: true });
      const scope4 = createVoerkaI18nScope({ id: "d", library: true });
      expect(globalThis.VoerkaI18n.scopes.length).toBe(4);
      const newLanguage = await scope1.change("en")
      expect(newLanguage).toBe('en');
      expect(scope1.activeLanguage).toBe('en');
      expect(scope1.activeMessages).toEqual({ message: 'Hello' });
      expect(scope2.activeLanguage).toBe('en');
      expect(scope2.activeMessages).toEqual({ message: 'Hello' });
      expect(scope3.activeLanguage).toBe('en');
      expect(scope3.activeMessages).toEqual({ message: 'Hello' });
      expect(scope4.activeLanguage).toBe('en');
      expect(scope4.activeMessages).toEqual({ message: 'Hello' });
    }) 
    test('先创建libScope再注册appScope', async () => {      
      const libScope1 = createVoerkaI18nScope({ id: "b", library: true });
      const libScope2 = createVoerkaI18nScope({ id: "c", library: true });
      const libScope3 = createVoerkaI18nScope({ id: "d", library: true });
      const appScope = createVoerkaI18nScope({ id: "a" });
      expect(globalThis.VoerkaI18n.scopes.length).toBe(4);
      const newLanguage = await appScope.change("en")
      expect(newLanguage).toBe('en');
      expect(appScope.activeLanguage).toBe('en');
      expect(appScope.activeMessages).toEqual({ message: 'Hello' });
      expect(libScope1.activeLanguage).toBe('en');
      expect(libScope1.activeMessages).toEqual({ message: 'Hello' });
      expect(libScope2.activeLanguage).toBe('en');
      expect(libScope2.activeMessages).toEqual({ message: 'Hello' });
      expect(libScope3.activeLanguage).toBe('en');
      expect(libScope3.activeMessages).toEqual({ message: 'Hello' });
    }) 
    test('先创建appScope再注册libScope', async () => {
      const scope1 = createVoerkaI18nScope({ id: "a" });            
      await scope1.change("en")
      const scope2 = createVoerkaI18nScope({ id: "b", library: true });
      const scope3 = createVoerkaI18nScope({ id: "c", library: true });
      const scope4 = createVoerkaI18nScope({ id: "d", library: true });
      // 由于是语言切换是异步的，所以需要等待切换完成
      await scope2.refreshing()
      await scope3.refreshing()
      await scope4.refreshing()
      expect(scope1.activeLanguage).toBe('en');
      expect(scope1.activeMessages).toEqual({ message: 'Hello' });
      expect(scope2.activeLanguage).toBe('en');
      expect(scope2.activeMessages).toEqual({ message: 'Hello' });
      expect(scope3.activeLanguage).toBe('en');
      expect(scope3.activeMessages).toEqual({ message: 'Hello' });
      expect(scope4.activeLanguage).toBe('en');
      expect(scope4.activeMessages).toEqual({ message: 'Hello' });
    })

    test("语言切换change事件",()=>{
      return new Promise<void>((resolve)=>{
          const scope1 = createVoerkaI18nScope({ id: "a" });            
          VoerkaI18n.on("change",(language)=>{
            expect(language).toBe('en');
            resolve()
          })
          scope1.change("en").then((language)=>{
            expect(scope1.activeLanguage).toBe('en');
            expect(scope1.activeMessages).toEqual({ message: 'Hello' });
            expect(language).toBe('en');
          })
      })
    })
    test("ready事件",async ()=>{
        const libScope1 = createVoerkaI18nScope({ id: "b", library: true });
        const libScope2 = createVoerkaI18nScope({ id: "c", library: true });
        const libScope3 = createVoerkaI18nScope({ id: "d", library: true });
        const appScope = createVoerkaI18nScope({ id: "a" });
        expect(globalThis.VoerkaI18n.scopes.length).toBe(4);
        appScope.change("en")        
        await VoerkaI18n.ready()
        expect(appScope.activeLanguage).toBe('en');
        expect(appScope.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope1.activeLanguage).toBe('en');
        expect(libScope1.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope2.activeLanguage).toBe('en');
        expect(libScope2.activeMessages).toEqual({ message: 'Hello' });
        expect(libScope3.activeLanguage).toBe('en');
        expect(libScope3.activeMessages).toEqual({ message: 'Hello' });
    })
    test("切换appScope语言时不影响detachedScope",async ()=>{
      const detachedScope = createVoerkaI18nScope({ id: "b", library: true,attached:false }); 
      const appScope = createVoerkaI18nScope({ id: "a" });
      await VoerkaI18n.change('en')
      expect(appScope.activeLanguage).toBe("en")
      expect(appScope.activeMessages).toEqual({ message: 'Hello' })
      expect(detachedScope.activeLanguage).toBe("zh")
      expect(detachedScope.activeMessages).toEqual({ message: '你好' })
    })

    test("独立切换detachedScope语言",async ()=>{
      const detachedScope = createVoerkaI18nScope({ id: "b", library: true,attached:false }); 
      const appScope = createVoerkaI18nScope({ id: "a" });
      await detachedScope.change('en')
      expect(appScope.activeLanguage).toBe("zh")
      expect(appScope.activeMessages).toEqual({ message: '你好' })
      expect(detachedScope.activeLanguage).toBe("en")
      expect(detachedScope.activeMessages).toEqual({ message: 'Hello' })

    })

    test("切换到不存在的语言时进行回退",async ()=>{
      const appScope = createVoerkaI18nScope({ id: "a" });      
      await appScope.change("de")
      // 回退到defaultLanguage
      expect(appScope.activeLanguage).toBe("zh")
      expect(appScope.activeMessages).toEqual({ message: 'Hello' })

    })
});


