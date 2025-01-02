

import { test, vi, describe, expect, beforeEach } from 'vitest'
import { VoerkaI18nScope } from '../scope'
import { VoerkaI18nManager } from '../manager';
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';
import { VoerkaI18nOnlyOneAppScopeError } from '@/errors';


describe('VoerkaI18nScope', () => {
  describe('创建VoerkaI18nScope实例', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('创建默认VoerkaI18nScope实例', () => {
      const scope = createVoerkaI18nScope();
      expect(scope.id).toBe('test-scope');
      expect(scope.debug).toBe(false);
      expect(scope.activeLanguage).toBe('zh');
      expect(scope.defaultLanguage).toBe('zh');
      expect(scope.activeMessages).toEqual({ message: '你好' });
      expect(scope.defaultMessages).toEqual({ message: '你好' });
      expect(scope.messages).toEqual({ en: { message: 'Hello' }, zh: { message: '你好' } });
      expect(scope.manager).toBeInstanceOf(VoerkaI18nManager);
      expect(scope.appScope).toBeInstanceOf(VoerkaI18nScope);
      expect(scope.manager.scopes).toEqual([scope]);
    });
    test('只能有一个VoerkaI18nScope,library=false应用实例,否则触发错误', () => {
      createVoerkaI18nScope({ id: "a" });
      try {
        createVoerkaI18nScope({ id: "b" });
      } catch (e) {
        expect(e).toBeInstanceOf(VoerkaI18nOnlyOneAppScopeError);
      }
    });

    test('创建多个VoerkaI18nScope实例', () => {
      createVoerkaI18nScope({ id: "a" });
      createVoerkaI18nScope({ id: "b", library: true });
      createVoerkaI18nScope({ id: "c", library: true });
      createVoerkaI18nScope({ id: "d", library: true });
      expect(globalThis.VoerkaI18n.scopes.length).toBe(4);
    })
    test('延后创建多个VoerkaI18nScope实例', () => {            
      createVoerkaI18nScope({ id: "b", library: true });
      createVoerkaI18nScope({ id: "c", library: true });
      createVoerkaI18nScope({ id: "d", library: true });
      createVoerkaI18nScope({ id: "a" });      
      expect(globalThis.VoerkaI18n.scopes.length).toBe(4);
    })

  }) 
});


