import { test,  describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';
import { createFormatter } from '@/formatter';

describe('格式化器', () => {

    beforeEach(() => {
        resetVoerkaI18n()
    });
    test("简单格式化器", async () => {
        const appScope = createVoerkaI18nScope({
            formatters:{
                add:createFormatter(()=>({
                    name:"add",
                    args:['count'],
                    default:{count:1},
                    next:(value,args)=>{
                        return value+args.count
                    }
                }))
            }
        })
        await appScope.ready()
    });

})