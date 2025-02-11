/**
 * 
 * 动态变量的多语言支持
 * 
 * import { signal } from "@voerkai18n/signals"
 * 
 * const dict = signal(async (language:string)=>{
 *      return []
 * })
 * 
 * dict(2)
 * 
 * const orders = [
 *      { name: "fisher" }
 * ]
 * 
 * t(async ()=>orders[0].name,'',{default:""})
 * 
 * t(()=>'') 
 * 
 * 
 * translate(fn:()=>name){
 *    const [ text, setText ] = useState(default)
 *    this.on("change",()=>{
 *       fn()
 *    }) 
 *   
 *    return text
 * 
 * 
 * 
 * let name = $t(()=>{},vars,options)
 * 
 * console.log(car)
 *  
 * 
 */

import { test, vi, describe, expect, beforeEach } from 'vitest'
import { getTestLanguageLoader, getTestStorage, resetVoerkaI18n } from './_utils';
import { VoerkaI18nScope, VoerkaI18nScopeOptions } from '../scope'  
import { delay } from 'flex-tools/async/delay';


function createVoerkaI18nScope(options?: VoerkaI18nScopeOptions):VoerkaI18nScope{
    return new VoerkaI18nScope({
        id:"app",
        languages: [
            {
                "name": "zh-CN",
                "title": "简体中文",
                "nativeTitle": "简体中文",
                "active": true,
                "default": true
            },
            {
                "name": "en-US",
                "title": "英语(美国)",
                "nativeTitle": "English (United States)"
            },
            {
                "name": "ja-JP",
                "title": "日语",
                "nativeTitle": "日本語"
            },
            {
                "name": "zh-TW",
                "title": "繁体中文",
                "nativeTitle": "繁體中文"
            }
        ],
        messages:{},
        ...options || {},
    })
}
 
describe('翻译动态变量', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test('动态变量翻译', async () => {     
        const cars={
            "zh-CN": "汽车",
            "en-US": "car",
            "ja-JP": "車",
            "zh-TW": "汽車"
        } as Record<string,string>

        const scope = createVoerkaI18nScope()
        const t  = scope.t 
        const Translate = scope.Translate





        const getCar =  (language:string)=>{
            return cars[language]
        }

        expect(t(getCar, [], {default:"汽车"})).toBe("汽车")
        await scope.change("en-US")
        expect(t(getCar, [], {default:"汽车"})).toBe("car")
        await scope.change("ja-JP")
        expect(t(getCar, [], {default:"汽车"})).toBe("車")
        await scope.change("zh-TW")
        expect(t(getCar, [], {default:"汽车"})).toBe("汽車")

    });
})


