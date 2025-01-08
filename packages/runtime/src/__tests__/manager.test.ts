import { test, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';
import { VoerkaI18nManager } from '@/manager';

 
describe('VoerkaI18nManager', () => {

    beforeEach(() => {
        resetVoerkaI18n()
    });

    test('VoerkaI18nManager是单例', async () => {     
        const appScope = createVoerkaI18nScope()
        expect(appScope.manager).toBeInstanceOf(VoerkaI18nManager)
        const manager = new VoerkaI18nManager()
        expect(appScope.manager).toBe(manager)        
    });

})