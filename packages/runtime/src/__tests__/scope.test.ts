

import {test,vi,describe,expect } from 'vitest'
import { VoerkaI18nScope } from '../scope'  
import { VoerkaI18nManager } from '../manager'; 
import { createVoerkaI18nScope } from './_utils';
 

describe('VoerkaI18nScope', () => { 
 

  test('should initialize with default options', () => {
    const scope = createVoerkaI18nScope();
    expect(scope.id).toBe('test-scope');
    expect(scope.debug).toBe(false);
    expect(scope.activeLanguage).toBe('en');
    expect(scope.defaultLanguage).toBe('en');
    expect(scope.currentMessages).toEqual({ message: 'Hello' });
    expect(scope.defaultMessages).toEqual({ message: 'Hello' });
    expect(scope.messages).toEqual({ en: { message: 'Hello' }, zh: { message: '你好' } });
    expect(scope.manager).toBeInstanceOf(VoerkaI18nManager);
    expect(scope.global).toBeInstanceOf(VoerkaI18nScope);

  });
 
  // 可以添加更多测试用例来覆盖其他功能
});