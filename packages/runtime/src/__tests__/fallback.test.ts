
import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';

 
describe('切换回退语言功能', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test("appScope切换时的默认回退语言", async () => {
        const appScope = createVoerkaI18nScope({
            fallback:"zh"
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('en')
        await appScope.change('x')
        expect(appScope.activeLanguage).toBe('zh');
    });
})