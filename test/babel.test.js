const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const i18nPlugin = require("../src/babel-plugin-voerkai18n");

const code = `
function test(a,b){
    t("a")
    t('b')
    t('c{}{}',1,2)
    t('d{a}{b}',{a:1,b:2}),
    t('e',()=>{})
}` 

 
function expectBabelSuccess(result){
    expect(result.includes(`"#/languages"`)).toBeTruthy()
    expect(result.includes(`t("1"`)).toBeTruthy()
    expect(result.includes(`t("2"`)).toBeTruthy()
    expect(result.includes(`t("3"`)).toBeTruthy()
    expect(result.includes(`t("4"`)).toBeTruthy()
    expect(result.includes(`t("5"`)).toBeTruthy()
}
test("翻译函数转换",done=>{ 
    babel.transform(code, {
        plugins: [
            [
                i18nPlugin,
                {
                    // location:"",
                    // 指定语言文件存放的目录，即保存编译后的语言文件的文件夹
                    // 可以指定相对路径，也可以指定绝对路径
                    autoImport:"#/languages",
                    moduleType:"esm",
                    // 此参数仅仅用于单元测试时使用,正常情况下，会读取location文件夹下的idMap",                    idMap:{
                        "a":1,
                        "b":2,
                        "c{}{}":3,
                        "d{a}{b}":4,
                        "e":5
                    }              
                }            
            ]
        ]
    }, function(err, result) {  
        expectBabelSuccess(result.code)
        done()
    });
})
test("读取esm格式的idMap后进行翻译函数转换",done=>{ 
    babel.transform(code, {
        plugins: [
            [
                i18nPlugin,
                {
                    location:path.join(__dirname, "../demo/apps/lib1/languages"), 
                    autoImport:"#/languages",
                    moduleType:"esm",          
                }            
            ]
        ]
    }, function(err, result) { 
        expectBabelSuccess(result.code)
        done()
    });
})
test("读取commonjs格式的idMap后进行翻译函数转换",done=>{ 
    babel.transform(code, {
        plugins: [
            [
                i18nPlugin,
                {
                    location:path.join(__dirname, "../demo/apps/lib2/languages"), 
                    autoImport:"#/languages",
                    moduleType:"esm",          
                }            
            ]
        ]
    }, function(err, result) { 
        expectBabelSuccess(result.code)
        done()
    });
})