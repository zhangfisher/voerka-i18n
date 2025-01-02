/**
 * 
 * 语言补丁
 * 
 * 语言补丁功能需要配置LnaguageLoader
 * 
 * 
 */



import { test, vi, describe, expect, beforeEach } from 'vitest'
import { VoerkaI18nScope } from '../scope'
import { VoerkaI18nManager } from '../manager';
import { createVoerkaI18nScope, getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';
import { VoerkaI18nOnlyOneAppScopeError } from '@/errors';
import { VoerkaI18nLanguageLoader } from '@/types';

 
describe('语言包补丁功能', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('appScope加载时加载补丁', async () => {     
        const storage = getTestStorage()
        const languageLoader = getTestLanguageLoader()
        
        const appScope = createVoerkaI18nScope({
            storage,
            loader:languageLoader as VoerkaI18nLanguageLoader
        })
    });
});


