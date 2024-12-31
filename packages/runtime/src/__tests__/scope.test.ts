

import {test,vi,describe,expect } from 'vitest'
import { VoerkaI18nScope } from '../scope'  
import { VoerkaI18nManager } from '../manager'; 
import { createVoerkaI18nScope } from './_utils';
 

describe('VoerkaI18nScope', () => { 
  describe('创建VoerkaI18nScope', () => { 


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
      expect(scope.global).toBeInstanceOf(VoerkaI18nScope);

    }); 
  })  
  describe('VoerkaI18n事件', () => { 


  })
});