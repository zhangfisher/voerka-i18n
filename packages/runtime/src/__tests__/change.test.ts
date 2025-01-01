/**
 * 语言切换测试
 */




import { test, vi, describe, expect, beforeEach } from 'vitest'
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
    test('多个延后注册scope切换语言', async () => {
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

    test("语言切换事件",async()=>{
      const scope1 = createVoerkaI18nScope({ id: "a" });            
      VoerkaI18n.on("change",(language)=>{})
      scope1.change("en").then((language)=>{})
      })

});


