
import { test, vi, describe, expect, beforeEach } from 'vitest'
import { resetVoerkaI18n,createVoerkaI18nScope } from './_utils';
import { VoerkaI18nLoggerLevels } from '@/logger';

 
describe('自定义日志功能', () => {
    beforeEach(() => {
        resetVoerkaI18n()
    });

    test("自定义日志功能", async () => {
        const logs:[string,string][] = []
       
        const appScope = createVoerkaI18nScope({
            debug:true,
            log:(level:VoerkaI18nLoggerLevels, message:string) => {
                logs.push([level,message])
                console.log(level, message)
            }
        })
        await appScope.ready()
        appScope.logger.info("1")
        appScope.logger.warn("2")
        appScope.logger.error("3")
        appScope.logger.debug("4")
        expect(logs.filter(log=>log[0] === "info" && log[1]==='1').length).toBe(1)
        expect(logs.filter(log=>log[0] === "warn" && log[1]==='2').length).toBe(1)
        expect(logs.filter(log=>log[0] === "error" && log[1]==='3').length).toBe(1)
        expect(logs.filter(log=>log[0] === "debug" && log[1]==='4').length).toBe(1)

    })

})