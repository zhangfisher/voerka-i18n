const extract = require("../packages/tools/extract.plugin");
const gulp = require('gulp'); 
const path = require('path');
const Vinyl = require('vinyl');
const {  getTranslateTexts, normalizeLanguageOptions } = require("../packages/tools/extract.plugin");

 
const languages = [{name:'en',title:"英文"},{name:'cn',title:"中文",default:true},{name:'de',title:"德语"},{name:'jp',title:"日本語"}]

test("扫描提取翻译文本",(done)=>{
    const file = new Vinyl({cwd: '/',base: '/test/',path: '/test/file.js',contents: Buffer.from("")});
    const texts =  getTranslateTexts(`t("a")\nt('b')\nt("c",1)\nt("d","a" )`,file,normalizeLanguageOptions({
        languages
    })).default      // 默认名称空间
    expect(Object.keys(texts).join()).toBe("a,b,c,d")
    Object.entries(texts).forEach(([text,langs])=>{
        if(!text.startsWith("$")){
            expect(langs["en"]).toEqual(text)
            expect(langs["jp"]).toEqual(text)
            expect(langs["de"]).toEqual(text) 
        }        
    })
    done()
})
 
 

test("启用名称空间后扫描提取翻译文本",(done)=>{ 
    const file = new Vinyl({base: '/test/',path: '/test/a/b/file.js',contents: Buffer.from("")});
    const texts =  getTranslateTexts(`t("a")\nt('b')\nt("c",1)\nt("d","a" )`,file,normalizeLanguageOptions({
        languages,
        namespaces:{
            "core":"a/b",               // 名称空间
        }
    }))     
    expect("core" in texts).toBeTruthy()
    expect(Object.keys(texts.core).join()).toBe("a,b,c,d")
    Object.entries(texts.core).forEach(([text,langs])=>{
        if(!text.startsWith("$")){
            expect(langs["en"]).toEqual(text)
            expect(langs["jp"]).toEqual(text)
            expect(langs["de"]).toEqual(text) 
        }        
    })
    done()
})
 