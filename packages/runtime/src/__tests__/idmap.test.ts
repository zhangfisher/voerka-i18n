import { test, describe, expect, beforeEach } from 'vitest'
import { createVoerkaI18nScope, resetVoerkaI18n } from './_utils';

 
describe('编译后的语言包功能', () => {
    beforeEach(() => {
        resetVoerkaI18n()
    });
    test("默认语言未编译的语言包", async () => {
        const appScope = createVoerkaI18nScope({
            messages:{
                "zh":{
                    "你好": "你好",
                    "我叫{name},今年{age}岁": "我叫{name},今年{age}岁",
                    "中国": "中国",
                    "我有{}部车": ["我没有车","我有一部车","我有两部车","我有{}部车"]  ,
                    "我的工资是每月{}元": "我的工资是每月{}元"
                },
                "en":{
                    "1": "hello",
                    "2": "My name is {name},Now {age} years old year",
                    "3": "china",
                    "4": ["I don't have car","I have a car","I have two cars","I have {} cars"],
                    "5":"My salary is {} yuan per month"
                }
            },
            idMap:{
                "你好":1,
                "我叫{name},今年{age}岁":2, 
                "中国":3,
                "我有{}部车":4,
                "我的工资是每月{}元":5
            }
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        const t = appScope.t
        expect(t("你好")).toBe("你好")
        expect(t("我叫{name},今年{age}岁",["张三",12])).toBe("我叫张三,今年12岁")
        expect(t("中国")).toBe("中国")
        expect(t("我有{}部车",0)).toBe("我没有车")
        expect(t("我有{}部车",1)).toBe("我有一部车")
        expect(t("我有{}部车",2)).toBe("我有两部车")    
        expect(t("我有{}部车",3)).toBe("我有3部车")
        expect(t("我有{}部车",100)).toBe("我有100部车")
        expect(t("我的工资是每月{}元",10000)).toBe("我的工资是每月10000元")
        await appScope.change("en")
        expect(t("你好")).toBe("hello")
        expect(t("我叫{name},今年{age}岁",["tom",12])).toBe("My name is tom,Now 12 years old year")
        expect(t("中国")).toBe("china")
        expect(t("我有{}部车",0)).toBe("I don't have car")
        expect(t("我有{}部车",1)).toBe("I have a car")
        expect(t("我有{}部车",2)).toBe("I have two cars")
        expect(t("我有{}部车",3)).toBe("I have 3 cars")
        expect(t("我有{}部车",100)).toBe("I have 100 cars")

    })

    test("默认语言替换后idMap的语言包", async () => {
        const appScope = createVoerkaI18nScope({
            messages:{
                "zh":{
                    "1": "你好",
                    "2": "我叫{name},今年{age}岁",
                    "3": "中国",
                    "4": ["我没有车","我有一部车","我有两部车","我有{}部车"]  ,
                    "5": "我的工资是每月{}元"
                },
                "en":{
                    "1": "hello",
                    "2": "My name is {name},Now {age} years old year",
                    "3": "china",
                    "4": ["I don't have car","I have a car","I have two cars","I have {} cars"],
                    "5":"My salary is {} yuan per month"
                }
            },
            idMap:{
                "你好":1,
                "我叫{name},今年{age}岁":2, 
                "中国":3,
                "我有{}部车":4,
                "我的工资是每月{}元":5
            }
        })
        await appScope.ready()
        expect(appScope.activeLanguage).toBe('zh');
        const t = appScope.t
        expect(t("你好")).toBe("你好")
        expect(t("我叫{name},今年{age}岁",["张三",12])).toBe("我叫张三,今年12岁")
        expect(t("中国")).toBe("中国")
        expect(t("我有{}部车",0)).toBe("我没有车")
        expect(t("我有{}部车",1)).toBe("我有一部车")
        expect(t("我有{}部车",2)).toBe("我有两部车")    
        expect(t("我有{}部车",3)).toBe("我有3部车")
        expect(t("我有{}部车",100)).toBe("我有100部车")
        expect(t("我的工资是每月{}元",10000)).toBe("我的工资是每月10000元")
        await appScope.change("en")
        expect(t("你好")).toBe("hello")
        expect(t("我叫{name},今年{age}岁",["tom",12])).toBe("My name is tom,Now 12 years old year")
        expect(t("中国")).toBe("china")
        expect(t("我有{}部车",0)).toBe("I don't have car")
        expect(t("我有{}部车",1)).toBe("I have a car")
        expect(t("我有{}部车",2)).toBe("I have two cars")
        expect(t("我有{}部车",3)).toBe("I have 3 cars")
        expect(t("我有{}部车",100)).toBe("I have 100 cars")

    })

})