/**
 * 基本翻译功能
 */



import {test,vi,describe,expect,afterAll,beforeAll, beforeEach, afterEach} from 'vitest'
import { VoerkaI18nScope } from '../scope'  
import {  VoerkaI18nTranslate } from '../types'; 
import { createVoerkaI18nScope } from './_utils';

let scope:VoerkaI18nScope;
let t:VoerkaI18nTranslate

describe("翻译函数", () => {
    beforeAll(async ()=>{
        scope = createVoerkaI18nScope({
            messages:{
                zh:{
                    "你好":"你好",
                    "我叫{name},今年{age}岁":"我叫{name},今年{age}岁",
                    "我有{}部车":["我没有车","我有一部车","我有两部车","我有{}部车"],
                    "中国":"中国"
                },
                en:{
                    "你好":"hello",
                    "我叫{name},今年{age}岁":"My name is {name},Now {age} years old year",
                    "我有{}部车":["I don't have car","I have a car","I have two cars","I have {} cars"],
                    "中国":"china"
                }
            }
        })        
        await scope.ready()
        t = scope.t
    })
    afterEach(async ()=>{
        await scope.change("zh")        
    })
    test('基本翻译',async () => {
        expect(t("你好")).toBe("你好")
        expect(t("我叫{name},今年{age}岁",["张三",12])).toBe("我叫张三,今年12岁") 
        expect(t("我叫{name},今年{age}岁",()=>["张三",12])).toBe("我叫张三,今年12岁") 
        expect(t("我叫{name},今年{age}岁",{name:"张三",age:12})).toBe("我叫张三,今年12岁") 
        expect(t("我叫{name},今年{age}岁",()=>({name:"张三",age:12}))).toBe("我叫张三,今年12岁") 
        await scope.change("en")
        expect(t("你好")).toBe("hello")
        expect(t("我叫{name},今年{age}岁",["tom",12])).toBe("My name is tom,Now 12 years old year") 
        expect(t("我叫{name},今年{age}岁",()=>["tom",12])).toBe("My name is tom,Now 12 years old year")
        expect(t("我叫{name},今年{age}岁",{name:"tom",age:12})).toBe("My name is tom,Now 12 years old year") 
        expect(t("我叫{name},今年{age}岁",()=>({name:"tom",age:12}))).toBe("My name is tom,Now 12 years old year")
        expect(t("中国")).toBe("china")
    })
    test('基本复数翻译',async () => {
        expect(t("我有{}部车",0)).toBe("我没有车")
        expect(t("我有{}部车",1)).toBe("我有一部车")
        expect(t("我有{}部车",2)).toBe("我有两部车")
        expect(t("我有{}部车",3)).toBe("我有3部车")
        expect(t("我有{}部车",100)).toBe("我有100部车")
        expect(t("我有{count}部车",{count:3})).toBe("我有3部车")
        expect(t("我有{count}部车",{count:()=>3})).toBe("我有3部车")
        expect(t("我有{}部车",100)).toBe("我有100部车")
         
        expect(t("我有{}部车",()=>0)).toBe("我没有车")
        expect(t("我有{}部车",()=>1)).toBe("我有一部车")
        expect(t("我有{}部车",()=>2)).toBe("我有两部车")
        expect(t("我有{}部车",()=>3)).toBe("我有3部车")
        expect(t("我有{}部车",()=>100)).toBe("我有100部车")
        expect(t("我有{count}部车",{count:()=>3})).toBe("我有3部车")
        expect(t("我有{}部车",()=>100)).toBe("我有100部车")


        await scope.change("en")
        expect(t("我有{}部车",0)).toBe("I don't have car")
        expect(t("我有{}部车",1)).toBe("I have a car")
        expect(t("我有{}部车",2)).toBe("I have two cars")
        expect(t("我有{}部车",3)).toBe("I have 3 cars")
        expect(t("我有{}部车",100)).toBe("I have 100 cars")
         
        expect(t("我有{}部车",()=>0)).toBe("I don't have car")
        expect(t("我有{}部车",()=>1)).toBe("I have a car")
        expect(t("我有{}部车",()=>2)).toBe("I have two cars")
        expect(t("我有{}部车",()=>3)).toBe("I have 3 cars")
        expect(t("我有{}部车",()=>100)).toBe("I have 100 cars")



    }) 


})