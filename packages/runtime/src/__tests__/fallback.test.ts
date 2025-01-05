
import { test, vi, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, getTestLanguageLoader, resetVoerkaI18n } from './_utils';
 
describe('切换回退语言功能', () => {
    beforeEach(() => {
      resetVoerkaI18n()
    });
    test("appScope切换到了不存在语言回退到默认语言", async () => {
        const appScope = createVoerkaI18nScope()
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('en')        
        await appScope.change('x')
        expect(appScope.activeLanguage).toBe('zh');         
    });
    test("appScope切换语言时出错回退到指定的回退语言", async () => {
        const appScope = createVoerkaI18nScope()
        // @ts-ignore
        appScope.messages.en = undefined
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('en')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 
    test("appScope切换远程语言时出错回退到指定的回退语言", async () => {
        const appScope = createVoerkaI18nScope({
            loader:async ()=>{throw new Error("加载语言包出错")}
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('x')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 

    test("appScope切换到不存在的语言时从远程加载出错回退到默认语言", async () => {
        // 增加语言且没有messages，并且当指定loader时会从远程加载
        const loader = getTestLanguageLoader(async (language,scope)=>{
            throw new Error()
        })
        const appScope = createVoerkaI18nScope({loader})           
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('xy')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 

    test("语言独立指定回退语言", async () => {
        const appScope = createVoerkaI18nScope()           
        appScope.languages.push({name:"x",fallback:"zh"})
        appScope.languages.push({name:"y",fallback:"en"})
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('x')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
        await appScope.change('y')    
        expect(appScope.activeLanguage).toBe('en');         
        expect(appScope.activeMessages).toEqual({ message: 'Hello' });
    }); 
    test("连续回退语言", async () => {
        const appScope = createVoerkaI18nScope()           
        appScope.languages.push({name:"a"})
        appScope.languages.push({name:"b",fallback:"a"})
        appScope.languages.push({name:"c",fallback:"b"})
        appScope.languages.push({name:"d",fallback:"c"})
        appScope.languages.push({name:"e",fallback:"d"})
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        await appScope.change('a')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
        await appScope.change('b')    
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' }); 
        await appScope.change('c')
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
        await appScope.change('d')
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
        await appScope.change('e')
        expect(appScope.activeLanguage).toBe('zh');         
        expect(appScope.activeMessages).toEqual({ message: '你好' });
    }); 

    test("appScope切换到libScope不存在的语言时，回退到libScope的默认语言", async () => {
        const libScope1 = createVoerkaI18nScope({
            id:"a", library:true,
            languages:[{name:"a"}],
            messages:{a:{message:"a"}}
        });       
        const appScope = createVoerkaI18nScope()        
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        expect(libScope1.activeLanguage).toBe('a');
        expect(libScope1.activeMessages).toEqual({ message: 'a' });
        await appScope.change('en')        
        // 当appScope切换到en语言时，libScope1不存在en语言，所以回退到libScope1的默认语言a
        expect(appScope.activeLanguage).toBe('en');         
        expect(libScope1.activeLanguage).toBe('a');
        expect(libScope1.activeMessages).toEqual({ message: 'a' });
    });

})